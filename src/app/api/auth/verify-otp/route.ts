import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";
import { hashToken, sendWelcomeEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    await dbConnect();

    // Find OTP record
    const otpRecord = await Otp.findOne({ email: normalizedEmail });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, error: "OTP expired or not found. Please request a new one." },
        { status: 400 }
      );
    }

    // Check expiry
    if (new Date() > otpRecord.expiresAt) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { success: false, error: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Check attempts (brute-force protection)
    if (otpRecord.attempts >= 5) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { success: false, error: "Too many failed attempts. Please request a new OTP." },
        { status: 429 }
      );
    }

    // Verify OTP
    const hashedOtp = hashToken(otp);
    if (hashedOtp !== otpRecord.otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return NextResponse.json(
        { success: false, error: `Incorrect OTP. ${5 - otpRecord.attempts} attempts remaining.` },
        { status: 400 }
      );
    }

    // OTP is correct — verify user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    user.emailVerified = true;
    await user.save();

    // Delete OTP record
    await Otp.deleteOne({ _id: otpRecord._id });

    // Send welcome email
    try {
      await sendWelcomeEmail(normalizedEmail, user.name);
    } catch {
      // Don't fail if welcome email fails
    }

    return NextResponse.json({
      success: true,
      message: "Email verified successfully!",
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
