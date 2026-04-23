import Groq from "groq-sdk";
import { Platform, ContentType, Tone, Language } from "@/types";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: "Instagram",
  twitter: "Twitter/X",
  linkedin: "LinkedIn",
  youtube: "YouTube",
};

const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  caption: "Caption",
  "reel-hook": "Reel Hook (opening line that stops scrolling)",
  bio: "Bio",
  "hashtag-set": "Set of relevant hashtags (20-30)",
  tweet: "Tweet (max 280 characters)",
  thread: "Thread of 5 connected tweets",
  "reply-hook": "Reply hook to boost engagement",
  post: "LinkedIn Post",
  "carousel-script": "Carousel slides script (8-10 slides with heading + body)",
  "connection-note": "Connection request note (max 300 characters)",
  "video-title": "Video Title (SEO optimized, max 100 chars)",
  description: "Video Description (SEO optimized with timestamps)",
  "shorts-hook": "Shorts opening hook (first 3 seconds script)",
  "community-post": "Community tab post",
};

const TONE_PROMPTS: Record<Tone, string> = {
  professional: "Use a polished, authoritative, and business-appropriate tone. Be clear and credible.",
  casual: "Use a friendly, relaxed, conversational tone. Write like talking to a friend.",
  humorous: "Use a witty, funny, and entertaining tone. Include clever wordplay or relatable humor.",
  inspirational: "Use an uplifting, motivational, and empowering tone. Inspire action and belief.",
  storytelling: "Use a narrative, immersive storytelling tone. Create vivid scenes and emotional connection.",
};

const LANGUAGE_PROMPTS: Record<Language, string> = {
  english: "Write entirely in English.",
  hindi: "Write entirely in Hindi (Devanagari script).",
  hinglish: "Write in Hinglish — a natural mix of Hindi and English using Roman script, as commonly used by Indian social media users.",
};

export function buildPrompt(
  platform: Platform,
  contentType: ContentType,
  tone: Tone,
  language: Language,
  topic: string
): string {
  return `You are an expert social media content creator and copywriter.

TASK: Create a ${CONTENT_TYPE_LABELS[contentType]} for ${PLATFORM_LABELS[platform]}.

TOPIC/CONTEXT: ${topic}

TONE: ${TONE_PROMPTS[tone]}

LANGUAGE: ${LANGUAGE_PROMPTS[language]}

IMPORTANT GUIDELINES:
- Write ONLY the content itself, no explanations or meta-commentary
- Make it engaging, scroll-stopping, and optimized for ${PLATFORM_LABELS[platform]}'s algorithm
- Use appropriate emojis naturally (don't overdo it)
- Include a strong call-to-action where appropriate
- Optimize for engagement (saves, shares, comments)
- If it's a thread, number each tweet and separate them clearly
- If it's hashtags, provide 20-30 relevant hashtags mixing popular and niche ones
- For carousel scripts, format each slide clearly with "Slide X: [Heading] — [Body]"
- Keep within platform character limits
- Make sure the content feels authentic and human-written, not AI-generated

Now create the content:`;
}

export async function generateContentStream(prompt: string) {
  const stream = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    stream: true,
    max_tokens: 1024,
  });

  return stream;
}
