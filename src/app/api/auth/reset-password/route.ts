import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import PasswordReset from "@/models/PasswordReset";
import { hashToken, sendPasswordChangedEmail } from "@/lib/mail";

const resetSchema = z.object({
  email: z.string().email(),
  token: z.string().min(1),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = resetSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, token, newPassword } = validation.data;
    const normalizedEmail = email.toLowerCase();

    await dbConnect();

    // Find reset token
    const resetRecord = await PasswordReset.findOne({
      email: normalizedEmail,
      used: false,
    });

    if (!resetRecord) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired reset link. Please request a new one." },
        { status: 400 }
      );
    }

    // Check expiry
    if (new Date() > resetRecord.expiresAt) {
      await PasswordReset.deleteOne({ _id: resetRecord._id });
      return NextResponse.json(
        { success: false, error: "Reset link has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Verify token
    const hashedToken = hashToken(token);
    if (hashedToken !== resetRecord.token) {
      return NextResponse.json(
        { success: false, error: "Invalid reset link." },
        { status: 400 }
      );
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await User.updateOne(
      { email: normalizedEmail },
      { password: hashedPassword }
    );

    // Mark token as used
    resetRecord.used = true;
    await resetRecord.save();

    // Send confirmation email
    try {
      await sendPasswordChangedEmail(normalizedEmail);
    } catch {
      // Don't fail if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Password reset successfully! You can now log in.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
