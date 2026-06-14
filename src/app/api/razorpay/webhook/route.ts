import { NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "crypto";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = headers();
  const signature = headersList.get("x-razorpay-signature");
  
  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  if (expectedSignature !== signature) {
    console.error("Webhook signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);
  await dbConnect();

  try {
    switch (event.event) {
      case "subscription.activated": {
        const subscriptionId = event.payload.subscription.entity.id;
        const notes = event.payload.subscription.entity.notes;
        const userId = notes?.userId;

        if (userId) {
          await User.findByIdAndUpdate(userId, {
            plan: "pro",
            razorpaySubscriptionId: subscriptionId,
          });
        }
        break;
      }

      case "subscription.cancelled":
      case "subscription.halted":
      case "subscription.completed": {
        const subscriptionId = event.payload.subscription.entity.id;
        await User.findOneAndUpdate(
          { razorpaySubscriptionId: subscriptionId },
          { plan: "free", razorpaySubscriptionId: null }
        );
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
