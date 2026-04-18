import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = headers();
  const signature = headersList.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  await dbConnect();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      if (userId) {
        await User.findByIdAndUpdate(userId, {
          plan: "pro",
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await User.findOneAndUpdate(
        { stripeSubscriptionId: subscription.id },
        { plan: "free", stripeSubscriptionId: null }
      );
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      console.log("Payment failed for customer:", invoice.customer);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
