"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Loader2, Check, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getPasswordStrength } from "@/lib/utils";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordStrength = getPasswordStrength(newPassword);

  const passwordChecks = [
    { label: "At least 8 characters", met: newPassword.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(newPassword) },
    { label: "One number", met: /\d/.test(newPassword) },
    { label: "Passwords match", met: newPassword === confirmPassword && confirmPassword.length > 0 },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
      } else {
        toast({
          title: "Reset failed",
          description: data.error,
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

  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center hero-gradient px-4">
        <div className="glass-card p-8 text-center max-w-md w-full">
          <h2 className="text-xl font-heading font-semibold mb-2 text-red-400">Invalid Reset Link</h2>
          <p className="text-muted-foreground text-sm mb-4">This password reset link is invalid or has expired.</p>
          <Link href="/forgot-password">
            <Button className="btn-premium">Request New Link</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient relative overflow-hidden px-4">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl animate-float" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-heading font-bold text-gradient">Nexcraft</h1>
          </Link>
        </div>

        <div className="glass-card p-8">
          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-heading font-semibold mb-2">Password Reset!</h2>
              <p className="text-muted-foreground text-sm">Redirecting to login...</p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-heading font-semibold text-center mb-2">Set new password</h2>
              <p className="text-muted-foreground text-center text-sm mb-6">
                Choose a strong password for your account
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 bg-white/5 border-white/10 focus:border-violet-500/50"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {newPassword && (
                    <div className="space-y-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="h-1 flex-1 rounded-full transition-all"
                            style={{
                              background: i < passwordStrength.score ? passwordStrength.color : "rgba(255,255,255,0.1)",
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-xs" style={{ color: passwordStrength.color }}>{passwordStrength.label}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 h-11 bg-white/5 border-white/10 focus:border-violet-500/50"
                      required
                    />
                  </div>
                </div>

                {(newPassword || confirmPassword) && (
                  <div className="space-y-1">
                    {passwordChecks.map((check, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        {check.met ? <Check className="w-3 h-3 text-green-500" /> : <X className="w-3 h-3 text-muted-foreground" />}
                        <span className={check.met ? "text-green-500" : "text-muted-foreground"}>{check.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading || !passwordChecks.every((c) => c.met)}
                  className="w-full h-11 btn-premium"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Reset Password
                </Button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center hero-gradient">
        <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
