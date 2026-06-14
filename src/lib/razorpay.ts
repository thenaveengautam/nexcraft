import Razorpay from "razorpay";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "dummy_key_id",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_key_secret",
});

export const RAZORPAY_PLANS = {
  pro: {
    planId: process.env.RAZORPAY_PRO_PLAN_ID!,
    name: "Pro",
    price: 9,
  },
  promax: {
    planId: process.env.RAZORPAY_PROMAX_PLAN_ID!,
    name: "Pro Max",
    price: 29,
  },
};

export async function createSubscription(userId: string, email: string, targetPlan: "pro" | "promax" = "pro", existingCustomerId?: string) {
  let customerId = existingCustomerId;

  if (!customerId) {
    const customer = await razorpay.customers.create({
      name: userId,
      email: email,
      notes: { userId },
    });
    customerId = customer.id;
  }

  const subscription = await razorpay.subscriptions.create({
    plan_id: RAZORPAY_PLANS[targetPlan].planId,
    customer_id: customerId,
    customer_notify: 1,
    total_count: 120, // 10 years
    notes: { userId },
  });

  return { subscription, customerId };
}

export async function cancelSubscription(subscriptionId: string) {
  const result = await razorpay.subscriptions.cancel(subscriptionId);
  return result;
}
