import mongoose, { Schema, models } from "mongoose";

const OtpSchema = new Schema({
  email: { type: String, required: true, lowercase: true },
  otp: { type: String, required: true }, // Stored hashed
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // TTL: auto-delete after 10 minutes
});

// Index for quick lookup
OtpSchema.index({ email: 1 });

export default models.Otp || mongoose.model("Otp", OtpSchema);
