import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String }, // Only for email/password auth
    image: { type: String, default: "" },
    emailVerified: { type: Boolean, default: false },
    plan: { type: String, enum: ["free", "pro", "business"], default: "free" },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    usageCount: { type: Number, default: 0 },
    usageResetDate: { type: Date, default: () => new Date() },
  },
  { timestamps: true }
);

export default models.User || mongoose.model("User", UserSchema);
