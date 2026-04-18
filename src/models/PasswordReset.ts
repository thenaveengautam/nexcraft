import mongoose, { Schema, models } from "mongoose";

const PasswordResetSchema = new Schema({
  email: { type: String, required: true, lowercase: true },
  token: { type: String, required: true }, // Stored hashed
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: 3600 }, // TTL: auto-delete after 1 hour
});

PasswordResetSchema.index({ email: 1 });

export default models.PasswordReset || mongoose.model("PasswordReset", PasswordResetSchema);
