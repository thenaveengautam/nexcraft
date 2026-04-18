import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Content from "@/models/Content";
import { buildPrompt, generateContentStream } from "@/lib/gemini";
import { PLAN_LIMITS } from "@/lib/constants";
import { Platform, ContentType, Tone, Language } from "@/types";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { platform, contentType, tone, language, topic } = await req.json();

    if (!platform || !contentType || !tone || !language || !topic) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Check usage limits
    const plan = user.plan as "free" | "pro" | "business";
    const limits = PLAN_LIMITS[plan];

    // Reset usage count if it's a new month
    const now = new Date();
    const resetDate = new Date(user.usageResetDate);
    if (now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear()) {
      user.usageCount = 0;
      user.usageResetDate = now;
      await user.save();
    }

    if (user.usageCount >= limits.generationsPerMonth) {
      return NextResponse.json(
        { success: false, error: "USAGE_LIMIT_REACHED" },
        { status: 403 }
      );
    }

    // Check if tone is allowed for plan
    if (!limits.allowedTones.includes(tone)) {
      return NextResponse.json(
        { success: false, error: "This tone requires a higher plan" },
        { status: 403 }
      );
    }

    // Build prompt and stream response
    const prompt = buildPrompt(
      platform as Platform,
      contentType as ContentType,
      tone as Tone,
      language as Language,
      topic
    );

    const stream = await generateContentStream(prompt);

    let fullContent = "";

    // Create a ReadableStream for SSE
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.text();
            fullContent += text;
            const data = JSON.stringify({ text });
            controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
          }

          // Save content to DB after streaming completes
          await Content.create({
            userId: user._id,
            platform,
            contentType,
            tone,
            language,
            topic,
            generatedContent: fullContent,
          });

          // Increment usage
          user.usageCount += 1;
          await user.save();

          controller.enqueue(
            new TextEncoder().encode(`data: ${JSON.stringify({ done: true })}\n\n`)
          );
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ error: "Generation failed" })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
