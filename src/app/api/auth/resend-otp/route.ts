import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";
import { generateOTP } from "@/lib/utils";
import { hashToken, sendOtpEmail } from "@/lib/mail";

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

    // Check if user exists
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "No account found with this email" },
        { status: 404 }
      );
    }

    // Rate limiting: check recent OTPs (max 3 in 10 minutes)
    const recentOtps = await Otp.countDocuments({
      email: normalizedEmail,
      createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) },
    });

    if (recentOtps >= 3) {
      return NextResponse.json(
        { success: false, error: "Too many OTP requests. Please wait before trying again." },
        { status: 429 }
      );
    }

    // Delete old OTPs
    await Otp.deleteMany({ email: normalizedEmail });

    // Generate new OTP
    const otp = generateOTP();
    await Otp.create({
      email: normalizedEmail,
      otp: hashToken(otp),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendOtpEmail(normalizedEmail, otp);

    return NextResponse.json({
      success: true,
      message: "New verification code sent to your email",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
