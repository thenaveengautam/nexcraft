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
  caption: "Caption (keep it engaging and appropriate length for the platform)",
  "reel-hook": "Reel Hook (strictly 1-2 short punchy lines that stop scrolling)",
  bio: "Profile Bio (strictly short and punchy, maximum 150 characters)",
  "hashtag-set": "Set of relevant hashtags (exactly 20-30)",
  tweet: "Tweet (strictly under 280 characters)",
  thread: "Thread of 5 connected tweets (each under 280 characters)",
  "reply-hook": "Reply hook (strictly 1-2 short sentences to boost engagement)",
  post: "LinkedIn Post (well-structured, 3-5 short paragraphs)",
  "carousel-script": "Carousel slides script (8-10 slides with short heading + concise body)",
  "connection-note": "Connection request note (strictly under 300 characters)",
  "video-title": "Video Title (SEO optimized, strictly under 100 chars)",
  description: "Video Description (SEO optimized with timestamps, detailed but scannable)",
  "shorts-hook": "Shorts opening hook (strictly first 3 seconds script, very short)",
  "community-post": "Community tab post (concise and engaging)",
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
- STRICT LENGTH CONSTRAINT: Do NOT over-generate. Output length MUST perfectly match the real-world standard limit for this content type on ${PLATFORM_LABELS[platform]} (e.g., Bios MUST be extremely short).
- Write ONLY the content itself, no explanations, no meta-commentary, no intro/outro
- Make it engaging, scroll-stopping, and optimized for ${PLATFORM_LABELS[platform]}'s algorithm
- Use appropriate emojis naturally (don't overdo it)
- Include a strong call-to-action where appropriate
- Optimize for engagement (saves, shares, comments)
- If it's a thread, number each tweet and separate them clearly
- If it's hashtags, provide 20-30 relevant hashtags mixing popular and niche ones
- For carousel scripts, format each slide clearly with "Slide X: [Heading] — [Body]"
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
