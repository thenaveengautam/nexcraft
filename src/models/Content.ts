import mongoose, { Schema, models } from "mongoose";

const ContentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
      required: true,
    },
    topic: { type: String, required: true },
    generatedContent: { type: String, required: true },
    isFavorite: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index for efficient querying
ContentSchema.index({ userId: 1, createdAt: -1 });
ContentSchema.index({ userId: 1, platform: 1 });
ContentSchema.index({ userId: 1, isFavorite: 1 });

export default models.Content || mongoose.model("Content", ContentSchema);
