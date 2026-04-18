import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
  typescript: true,
});

export const STRIPE_PLANS = {
  pro: {
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    name: "Pro",
    price: 9,
    currency: "usd",
  },
};

export async function createCheckoutSession(userId: string, email: string) {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: email,
    line_items: [
      {
        price: STRIPE_PLANS.pro.priceId,
        quantity: 1,
      },
    ],
    metadata: {
      userId,
    },
    success_url: `${process.env.NEXTAUTH_URL}/billing?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/billing?canceled=true`,
  });

  return session;
}

export async function createPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXTAUTH_URL}/billing`,
  });

  return session;
}
