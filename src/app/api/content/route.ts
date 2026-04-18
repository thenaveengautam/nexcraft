import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Content from "@/models/Content";

// GET: Fetch user's content history
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const platform = searchParams.get("platform");
    const tone = searchParams.get("tone");
    const favorites = searchParams.get("favorites");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    await dbConnect();

    const userId = (session.user as Record<string, unknown>).id;

    // Build filter
    const filter: Record<string, unknown> = { userId };
    if (platform && platform !== "all") filter.platform = platform;
    if (tone && tone !== "all") filter.tone = tone;
    if (favorites === "true") filter.isFavorite = true;

    const total = await Content.countDocuments(filter);
    const contents = await Content.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        contents,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Content fetch error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
  }
}
