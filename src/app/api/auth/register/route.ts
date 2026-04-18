import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";
import { generateOTP } from "@/lib/utils";
import { isValidEmailDomain, hashToken, sendOtpEmail } from "@/lib/mail";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;
    const normalizedEmail = email.toLowerCase();

    // Validate email domain (MX record check)
    const isRealEmail = await isValidEmailDomain(normalizedEmail);
    if (!isRealEmail) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      if (existingUser.emailVerified) {
        return NextResponse.json(
          { success: false, error: "An account with this email already exists" },
          { status: 400 }
        );
      } else {
        // User exists but unverified — update the password and resend OTP
        const hashedPassword = await bcrypt.hash(password, 12);
        existingUser.name = name;
        existingUser.password = hashedPassword;
        await existingUser.save();

        // Delete old OTPs and send new one
        await Otp.deleteMany({ email: normalizedEmail });
        const otp = generateOTP();
        await Otp.create({
          email: normalizedEmail,
          otp: hashToken(otp),
          expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        });

        await sendOtpEmail(normalizedEmail, otp);

        return NextResponse.json({
          success: true,
          message: "Verification code sent to your email",
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user (unverified)
    await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      emailVerified: false,
      plan: "free",
      usageCount: 0,
      usageResetDate: new Date(),
    });

    // Generate and send OTP
    const otp = generateOTP();
    await Otp.create({
      email: normalizedEmail,
      otp: hashToken(otp),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendOtpEmail(normalizedEmail, otp);

    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
