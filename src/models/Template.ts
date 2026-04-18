import mongoose, { Schema, models } from "mongoose";

const TemplateSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    platform: {
      type: String,
      enum: ["instagram", "twitter", "linkedin", "youtube"],
      required: true,
    },
    contentType: { type: String, required: true },
    tone: {
      type: String,
      enum: ["professional", "casual", "humorous", "inspirational", "storytelling"],
      required: true,
    },
    language: {
      type: String,
      enum: ["english", "hindi", "hinglish"],
      default: "english",
    },
    topic: { type: String, required: true },
    icon: { type: String, default: "📝" },
    isDefault: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: "User" }, // null for default templates
  },
  { timestamps: true }
);

TemplateSchema.index({ isDefault: 1 });
TemplateSchema.index({ userId: 1 });

export default models.Template || mongoose.model("Template", TemplateSchema);
