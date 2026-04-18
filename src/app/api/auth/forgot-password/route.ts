import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import PasswordReset from "@/models/PasswordReset";
import { hashToken, sendPasswordResetEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    await dbConnect();

    // Always return success (prevents email enumeration)
    const successResponse = NextResponse.json({
      success: true,
      message: "If an account exists with this email, we've sent a password reset link.",
    });

    // Check if user exists
    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !user.password) {
      // If user doesn't exist or is Google-only, still return success
      return successResponse;
    }

    // Rate limit: max 3 reset requests per hour
    const recentResets = await PasswordReset.countDocuments({
      email: normalizedEmail,
      createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) },
    });

    if (recentResets >= 3) {
      return successResponse; // Silently rate limit
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = hashToken(token);

    // Delete old reset tokens
    await PasswordReset.deleteMany({ email: normalizedEmail });

    // Save hashed token
    await PasswordReset.create({
      email: normalizedEmail,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    // Send reset email with unhashed token
    await sendPasswordResetEmail(normalizedEmail, token);

    return successResponse;
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
