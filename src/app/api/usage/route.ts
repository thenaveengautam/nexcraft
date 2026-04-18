import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Content from "@/models/Content";
import { PLAN_LIMITS } from "@/lib/constants";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Reset usage count if new month
    const now = new Date();
    const resetDate = new Date(user.usageResetDate);
    if (now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear()) {
      user.usageCount = 0;
      user.usageResetDate = now;
      await user.save();
    }

    const plan = user.plan as "free" | "pro" | "business";
    const limit = PLAN_LIMITS[plan].generationsPerMonth;

    // Get total content count and favorites count
    const userId = user._id;
    const totalContent = await Content.countDocuments({ userId });
    const totalFavorites = await Content.countDocuments({ userId, isFavorite: true });

    return NextResponse.json({
      success: true,
      data: {
        used: user.usageCount,
        limit: limit === Infinity ? -1 : limit,
        plan: user.plan,
        resetDate: user.usageResetDate,
        percentage: limit === Infinity ? 0 : Math.round((user.usageCount / limit) * 100),
        totalContent,
        totalFavorites,
      },
    });
  } catch (error) {
    console.error("Usage fetch error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
  }
}
