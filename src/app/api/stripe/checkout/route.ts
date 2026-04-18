import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { createCheckoutSession, createPortalSession } from "@/lib/stripe";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(_req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const userId = (session.user as Record<string, unknown>).id as string;
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // If user already has a Stripe customer, redirect to portal
    if (user.stripeCustomerId) {
      const portalSession = await createPortalSession(user.stripeCustomerId);
      return NextResponse.json({ success: true, data: { url: portalSession.url } });
    }

    // Create new checkout session
    const checkoutSession = await createCheckoutSession(userId, user.email);

    return NextResponse.json({ success: true, data: { url: checkoutSession.url } });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
  }
}
