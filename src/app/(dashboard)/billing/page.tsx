"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Crown,
  Check,
  X,
  Zap,
  Infinity,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Suspense } from "react";

function BillingContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const user = session?.user as Record<string, unknown> | undefined;
  const plan = (user?.plan as string) || "free";
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState<{ used: number; limit: number; percentage: number } | null>(null);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast({ title: "🎉 Welcome to Pro!", description: "Your account has been upgraded." });
    }
    if (searchParams.get("canceled") === "true") {
      toast({ title: "Checkout canceled", description: "No charges were made.", variant: "destructive" });
    }
  }, [searchParams, toast]);

  useEffect(() => {
    fetch("/api/usage")
      .then((r) => r.json())
      .then((d) => { if (d.success) setUsage(d.data); });
  }, []);

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.success && data.data?.url) {
        window.location.href = data.data.url;
      }
    } catch {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "0",
      description: "Perfect for getting started",
      features: [
        { text: "10 generations per month", included: true },
        { text: "3 tone options", included: true },
        { text: "All platforms", included: true },
        { text: "Content history", included: true },
        { text: "20+ templates", included: false },
        { text: "Custom templates", included: false },
        { text: "All 5 tones", included: false },
        { text: "Priority generation", included: false },
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: "9",
      description: "For serious content creators",
      features: [
        { text: "50 generations per month", included: true },
        { text: "All 5 tone options", included: true },
        { text: "All platforms", included: true },
        { text: "Content history", included: true },
        { text: "20+ templates", included: true },
        { text: "Priority AI generation", included: true },
        { text: "Content export", included: true },
        { text: "Custom templates", included: false },
      ],
    },
    {
      id: "business",
      name: "Business",
      price: "29",
      description: "Unlimited power for teams",
      features: [
        { text: "Unlimited generations", included: true },
        { text: "All 5 tone options", included: true },
        { text: "All platforms", included: true },
        { text: "Content history", included: true },
        { text: "20+ templates", included: true },
        { text: "Custom templates", included: true },
        { text: "Priority AI generation", included: true },
        { text: "Content export", included: true },
        { text: "Dedicated support", included: true },
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-heading font-bold mb-1">Billing & Plans</h1>
        <p className="text-muted-foreground text-sm mb-8">Manage your subscription and usage</p>
      </motion.div>

      {/* Current Plan */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-heading font-semibold">Current Plan</h3>
              {plan === "pro" ? (
                <span className="pro-badge"><Crown className="w-3 h-3" /> PRO</span>
              ) : plan === "business" ? (
                <span className="pro-badge"><Crown className="w-3 h-3" /> BUSINESS</span>
              ) : (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground">FREE</span>
              )}
            </div>
            {usage && plan === "free" && (
              <div className="mt-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  {usage.used} / {usage.limit} generations used this month
                </div>
                <div className={`usage-bar w-64 ${usage.percentage >= 80 ? "usage-bar-warning" : ""}`}>
                  <div className="usage-bar-fill" style={{ width: `${Math.min(usage.percentage, 100)}%` }} />
                </div>
              </div>
            )}
            {usage && plan === "pro" && (
              <div className="mt-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  {usage.used} / {usage.limit} generations used this month
                </div>
                <div className={`usage-bar w-64 ${usage.percentage >= 80 ? "usage-bar-warning" : ""}`}>
                  <div className="usage-bar-fill" style={{ width: `${Math.min(usage.percentage, 100)}%` }} />
                </div>
              </div>
            )}
            {plan === "business" && (
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                <Infinity className="w-4 h-4" /> Unlimited generations
              </p>
            )}
          </div>
          {(plan === "pro" || plan === "business") && (
            <Button
              onClick={handleManageSubscription}
              disabled={loading}
              variant="outline"
              className="bg-white/5 border-white/10"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Manage Subscription
            </Button>
          )}
        </div>
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6 pt-2">
        {plans.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className={`glass-card p-6 relative overflow-visible ${p.id === "pro" ? "border-violet-500/30" : ""}`}
          >
            {p.id === "pro" && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                <span className="pro-badge px-4 py-1.5 text-xs whitespace-nowrap shadow-lg shadow-violet-500/20">⭐ RECOMMENDED</span>
              </div>
            )}

            <div className="mb-6">
              <h3 className="font-heading font-bold text-lg">{p.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{p.description}</p>
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-4xl font-heading font-bold">${p.price}</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {p.features.map((f) => (
                <div key={f.text} className="flex items-center gap-3">
                  {f.included ? (
                    <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                  )}
                  <span className={`text-sm ${f.included ? "" : "text-muted-foreground/50"}`}>
                    {f.text}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button logic */}
            {p.id === plan ? (
              <Button disabled className="w-full h-11 bg-violet-500/10 text-violet-400 border border-violet-500/30">
                <Check className="w-4 h-4 mr-2" /> Current Plan
              </Button>
            ) : (p.id === "pro" && plan === "free") || (p.id === "business" && (plan === "free" || plan === "pro")) ? (
              <Button onClick={handleManageSubscription} disabled={loading} className="w-full h-11 btn-premium">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
                Upgrade to {p.name}
              </Button>
            ) : null}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-violet-400" /></div>}>
      <BillingContent />
    </Suspense>
  );
}
