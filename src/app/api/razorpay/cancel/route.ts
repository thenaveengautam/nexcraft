import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { cancelSubscription } from "@/lib/razorpay";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const userId = (session.user as Record<string, unknown>).id as string;
    const user = await User.findById(userId);

    if (!user || !user.razorpaySubscriptionId) {
      return NextResponse.json({ success: false, error: "No active subscription found" }, { status: 404 });
    }

    // Cancel on Razorpay
    await cancelSubscription(user.razorpaySubscriptionId);

    // Update user locally
    user.plan = "free";
    user.razorpaySubscriptionId = null;
    await user.save();

    return NextResponse.json({ success: true, message: "Subscription cancelled successfully" });
  } catch (error) {
    console.error("Razorpay cancel error:", error);
    return NextResponse.json({ success: false, error: "Failed to cancel subscription" }, { status: 500 });
  }
}
