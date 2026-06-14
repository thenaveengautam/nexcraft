import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { createSubscription } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const body = await req.json();
    const targetPlan = body.plan || "pro";

    if (targetPlan !== "pro" && targetPlan !== "promax") {
      return NextResponse.json({ success: false, error: "Invalid plan selected" }, { status: 400 });
    }

    const userId = (session.user as Record<string, unknown>).id as string;
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Create new checkout session (subscription)
    const { subscription, customerId } = await createSubscription(userId, user.email, targetPlan, user.razorpayCustomerId);

    // Save razorpay customer ID if not exist
    if (!user.razorpayCustomerId) {
      user.razorpayCustomerId = customerId;
      await user.save();
    }

    return NextResponse.json({ 
      success: true, 
      data: { 
        subscriptionId: (subscription as any).id,
        keyId: process.env.RAZORPAY_KEY_ID
      } 
    });
  } catch (error) {
    console.error("Razorpay checkout error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
  }
}
