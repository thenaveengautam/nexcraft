"use client";

import { useState, useEffect } from "react";
import { Crown, Check, Zap, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

export default function UpgradeModal({ open, onClose }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/razorpay/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "pro" }),
      });
      const data = await res.json();
      
      if (data.success && data.data?.subscriptionId) {
        const options = {
          key: data.data.keyId,
          subscription_id: data.data.subscriptionId,
          name: "Nexcraft",
          description: "Pro Plan Subscription",
          handler: function () {
            window.location.href = "/billing?success=true";
          },
          theme: {
            color: "#8b5cf6",
          },
        };
        // @ts-expect-error - Razorpay is loaded via script tag
        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response: { error: { description: string } }) {
          toast({
            title: "Payment Failed",
            description: response.error.description,
            variant: "destructive",
          });
        });
        rzp.open();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create checkout session",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const proFeatures = [
    "Unlimited generations per month",
    "All 5 tone options",
    "Custom templates",
    "Priority AI generation",
    "Content export options",
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/10 max-w-md p-0 overflow-hidden">
        {/* Gradient header */}
        <div className="bg-gradient-to-br from-violet-600/20 to-cyan-500/10 p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-3">
            <Crown className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-heading font-bold">Upgrade to Pro</h2>
          <p className="text-muted-foreground text-sm mt-1">Unlock the full power of Nexcraft</p>
        </div>

        <div className="p-6">
          {/* Price */}
          <div className="text-center mb-6">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-heading font-bold">$9</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6">
            {proFeatures.map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-green-400" />
                </div>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full h-12 btn-premium"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Zap className="w-4 h-4 mr-2" />
            )}
            Upgrade Now
          </Button>

          <p className="text-xs text-muted-foreground text-center mt-3">
            Cancel anytime. No hidden fees.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
