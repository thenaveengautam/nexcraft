import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Template from "@/models/Template";
import { DEFAULT_TEMPLATES, PLAN_LIMITS } from "@/lib/constants";
import User from "@/models/User";

// GET: Fetch templates (defaults + user customs)
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const userId = (session.user as Record<string, unknown>).id;

    // Fetch custom templates from DB
    const customTemplates = await Template.find({ userId }).lean();

    // Return defaults + custom
    return NextResponse.json({
      success: true,
      data: {
        defaults: DEFAULT_TEMPLATES,
        custom: customTemplates,
      },
    });
  } catch (error) {
    console.error("Template fetch error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
  }
}

// POST: Create custom template (Pro only)
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const userId = (session.user as Record<string, unknown>).id;
    const user = await User.findById(userId);

    if (!user || !PLAN_LIMITS[user.plan as "free" | "pro" | "business"].customTemplates) {
      return NextResponse.json(
        { success: false, error: "Custom templates are a Business feature" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const template = await Template.create({
      ...body,
      userId,
      isDefault: false,
    });

    return NextResponse.json({ success: true, data: template });
  } catch (error) {
    console.error("Template create error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
  }
}
