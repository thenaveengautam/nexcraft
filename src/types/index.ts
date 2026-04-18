// Platform types
export type Platform = "instagram" | "twitter" | "linkedin" | "youtube";

// Content types per platform
export type InstagramContentType = "caption" | "reel-hook" | "bio" | "hashtag-set";
export type TwitterContentType = "tweet" | "thread" | "reply-hook";
export type LinkedInContentType = "post" | "carousel-script" | "connection-note";
export type YouTubeContentType = "video-title" | "description" | "shorts-hook" | "community-post";

export type ContentType =
  | InstagramContentType
  | TwitterContentType
  | LinkedInContentType
  | YouTubeContentType;

// Tone
export type Tone = "professional" | "casual" | "humorous" | "inspirational" | "storytelling";

// Language
export type Language = "english" | "hindi" | "hinglish";

// Plan
export type Plan = "free" | "pro" | "business";

// User interface
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  image?: string;
  emailVerified: boolean;
  plan: Plan;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  usageCount: number;
  usageResetDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Content interface
export interface IContent {
  _id: string;
  userId: string;
  platform: Platform;
  contentType: ContentType;
  tone: Tone;
  language: Language;
  topic: string;
  generatedContent: string;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Template interface
export interface ITemplate {
  _id: string;
  name: string;
  description: string;
  platform: Platform;
  contentType: ContentType;
  tone: Tone;
  language: Language;
  topic: string;
  isDefault: boolean;
  userId?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

// OTP interface
export interface IOtp {
  _id: string;
  email: string;
  otp: string;
  expiresAt: Date;
  attempts: number;
  createdAt: Date;
}

// Password Reset interface
export interface IPasswordReset {
  _id: string;
  email: string;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

// Generator form state
export interface GeneratorForm {
  platform: Platform;
  contentType: ContentType;
  tone: Tone;
  language: Language;
  topic: string;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Usage stats
export interface UsageStats {
  used: number;
  limit: number;
  plan: Plan;
  resetDate: Date;
  percentage: number;
}

// Session user extension
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  plan: Plan;
  usageCount: number;
  emailVerified: boolean;
}
