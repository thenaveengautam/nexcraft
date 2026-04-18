import nodemailer from "nodemailer";
import { createHash } from "crypto";
import dns from "dns";
import { promisify } from "util";

const resolveMx = promisify(dns.resolveMx);

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Validate email domain using MX record lookup
export async function isValidEmailDomain(email: string): Promise<boolean> {
  try {
    const domain = email.split("@")[1];
    if (!domain) return false;
    const records = await resolveMx(domain);
    return records && records.length > 0;
  } catch {
    return false;
  }
}

// Hash OTP/token for secure storage
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

// Send OTP verification email
export async function sendOtpEmail(email: string, otp: string) {
  const mailOptions = {
    from: `"Nexcraft" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your Nexcraft account",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background-color:#0a0a0f;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
        <div style="max-width:500px;margin:0 auto;padding:40px 20px;">
          <div style="background:linear-gradient(135deg,rgba(124,58,237,0.1),rgba(6,182,212,0.05));border:1px solid rgba(139,92,246,0.2);border-radius:16px;padding:40px;text-align:center;">
            <h1 style="color:#a855f7;font-size:28px;margin:0 0 8px;">Nexcraft</h1>
            <p style="color:#64748b;font-size:14px;margin:0 0 30px;">Craft Content That Glows</p>
            
            <p style="color:#e2e8f0;font-size:16px;margin:0 0 24px;">Your verification code is:</p>
            
            <div style="background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.3);border-radius:12px;padding:20px;margin:0 0 24px;">
              <span style="font-size:36px;font-weight:700;letter-spacing:12px;color:#ffffff;">${otp}</span>
            </div>
            
            <p style="color:#94a3b8;font-size:13px;margin:0 0 8px;">This code expires in <strong style="color:#06b6d4;">10 minutes</strong></p>
            <p style="color:#64748b;font-size:12px;margin:0;">If you didn't request this code, you can safely ignore this email.</p>
          </div>
          
          <p style="color:#475569;font-size:11px;text-align:center;margin-top:20px;">© ${new Date().getFullYear()} Nexcraft. All rights reserved.</p>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}

// Send welcome email after verification
export async function sendWelcomeEmail(email: string, name: string) {
  const mailOptions = {
    from: `"Nexcraft" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to Nexcraft! 🎉",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background-color:#0a0a0f;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
        <div style="max-width:500px;margin:0 auto;padding:40px 20px;">
          <div style="background:linear-gradient(135deg,rgba(124,58,237,0.1),rgba(6,182,212,0.05));border:1px solid rgba(139,92,246,0.2);border-radius:16px;padding:40px;text-align:center;">
            <h1 style="color:#a855f7;font-size:28px;margin:0 0 8px;">Nexcraft</h1>
            <p style="color:#64748b;font-size:14px;margin:0 0 30px;">Craft Content That Glows</p>
            
            <h2 style="color:#ffffff;font-size:22px;margin:0 0 16px;">Welcome aboard, ${name}! 🚀</h2>
            <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0 0 24px;">
              Your account is now verified. Start creating AI-powered content for Instagram, Twitter/X, LinkedIn & YouTube in seconds.
            </p>
            
            <a href="${process.env.NEXTAUTH_URL}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:600;font-size:15px;">
              Go to Dashboard →
            </a>
            
            <p style="color:#64748b;font-size:13px;margin-top:30px;">
              You're on the <strong style="color:#ffffff;">Free Plan</strong> (10 generations/month).<br>
              Upgrade to <strong style="color:#f59e0b;">Pro</strong> for unlimited generations!
            </p>
          </div>
          
          <p style="color:#475569;font-size:11px;text-align:center;margin-top:20px;">© ${new Date().getFullYear()} Nexcraft. All rights reserved.</p>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}

// Send password reset email
export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  const mailOptions = {
    from: `"Nexcraft" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your Nexcraft password",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background-color:#0a0a0f;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
        <div style="max-width:500px;margin:0 auto;padding:40px 20px;">
          <div style="background:linear-gradient(135deg,rgba(124,58,237,0.1),rgba(6,182,212,0.05));border:1px solid rgba(139,92,246,0.2);border-radius:16px;padding:40px;text-align:center;">
            <h1 style="color:#a855f7;font-size:28px;margin:0 0 8px;">Nexcraft</h1>
            <p style="color:#64748b;font-size:14px;margin:0 0 30px;">Craft Content That Glows</p>
            
            <h2 style="color:#ffffff;font-size:20px;margin:0 0 16px;">Password Reset Request</h2>
            <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0 0 24px;">
              We received a request to reset your password. Click the button below to set a new password.
            </p>
            
            <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:600;font-size:15px;">
              Reset Password
            </a>
            
            <p style="color:#94a3b8;font-size:13px;margin-top:24px;">This link expires in <strong style="color:#06b6d4;">1 hour</strong></p>
            <p style="color:#64748b;font-size:12px;margin-top:8px;">If you didn't request this, your account is safe — no action needed.</p>
          </div>
          
          <p style="color:#475569;font-size:11px;text-align:center;margin-top:20px;">© ${new Date().getFullYear()} Nexcraft. All rights reserved.</p>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}

// Send password changed confirmation
export async function sendPasswordChangedEmail(email: string) {
  const mailOptions = {
    from: `"Nexcraft" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Nexcraft password has been changed",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background-color:#0a0a0f;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
        <div style="max-width:500px;margin:0 auto;padding:40px 20px;">
          <div style="background:linear-gradient(135deg,rgba(124,58,237,0.1),rgba(6,182,212,0.05));border:1px solid rgba(139,92,246,0.2);border-radius:16px;padding:40px;text-align:center;">
            <h1 style="color:#a855f7;font-size:28px;margin:0 0 8px;">Nexcraft</h1>
            <p style="color:#64748b;font-size:14px;margin:0 0 30px;">Craft Content That Glows</p>
            
            <div style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3);border-radius:12px;padding:20px;margin:0 0 20px;">
              <p style="color:#22c55e;font-size:16px;font-weight:600;margin:0;">✓ Password Changed Successfully</p>
            </div>
            
            <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0 0 16px;">
              Your password has been updated. You can now log in with your new password.
            </p>
            <p style="color:#ef4444;font-size:13px;margin:0;">
              ⚠️ If you didn't make this change, please contact support immediately.
            </p>
          </div>
          
          <p style="color:#475569;font-size:11px;text-align:center;margin-top:20px;">© ${new Date().getFullYear()} Nexcraft. All rights reserved.</p>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}
