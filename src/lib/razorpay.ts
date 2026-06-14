import Razorpay from "razorpay";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
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

export async function createSubscription(userId: string, email: string, targetPlan: "pro" | "promax" = "pro") {
  // First create a customer if they don't have an ID
  const customer = await razorpay.customers.create({
    name: userId, // or actual name if available
    email: email,
    notes: {
      userId,
    },
  });

  const subscription = await razorpay.subscriptions.create({
    plan_id: RAZORPAY_PLANS[targetPlan].planId,
    customer_notify: 1,
    total_count: 120, // 10 years, or any suitable length
    notes: {
      userId,
    },
  });

  return { subscription, customerId: customer.id };
}

export async function cancelSubscription(subscriptionId: string) {
  const result = await razorpay.subscriptions.cancel(subscriptionId);
  return result;
}
