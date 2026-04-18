"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { maskEmail } from "@/lib/utils";
import Link from "next/link";

function VerifyOtpContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // OTP Expiry countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    if (pastedData.length === 6) {
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = useCallback(async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast({
        title: "Incomplete OTP",
        description: "Please enter all 6 digits",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpString }),
      });

      const data = await res.json();

      if (!data.success) {
        toast({
          title: "Verification failed",
          description: data.error,
          variant: "destructive",
        });
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        toast({
          title: "Email verified! 🎉",
          description: "Signing you in...",
        });

        // Auto sign-in after verification
        const result = await signIn("credentials", {
          email,
          password: "auto-verified",
          redirect: false,
        });

        if (result?.error) {
          router.push("/login");
        } else {
          router.push("/dashboard");
          router.refresh();
        }
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
  }, [otp, email, toast, router]);

  // Auto-submit when all 6 digits entered
  useEffect(() => {
    if (otp.every((digit) => digit !== "")) {
      handleVerify();
    }
  }, [otp, handleVerify]);

  const handleResend = async () => {
    setResendLoading(true);

    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: "OTP resent!",
          description: "Check your email for the new code",
        });
        setResendCooldown(30);
        setTimeLeft(600);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        toast({
          title: "Resend failed",
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
      setResendLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient relative overflow-hidden px-4">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />

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

        <div className="glass-card p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8 text-violet-400" />
          </div>

          <h2 className="text-2xl font-heading font-semibold mb-2">Verify your email</h2>
          <p className="text-muted-foreground text-sm mb-1">We sent a 6-digit code to</p>
          <p className="text-violet-400 font-medium mb-6">{email ? maskEmail(email) : "your email"}</p>

          {/* OTP Input */}
          <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-heading font-bold rounded-lg bg-white/5 border border-white/10 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
              />
            ))}
          </div>

          {/* Timer */}
          <p className="text-sm text-muted-foreground mb-4">
            {timeLeft > 0 ? (
              <>Code expires in <span className="text-cyan-400 font-medium">{formatTime(timeLeft)}</span></>
            ) : (
              <span className="text-red-400">Code expired. Please request a new one.</span>
            )}
          </p>

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            disabled={loading || otp.some((d) => !d)}
            className="w-full h-11 btn-premium mb-4"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Verify Email
          </Button>

          {/* Resend */}
          <Button
            variant="ghost"
            onClick={handleResend}
            disabled={resendLoading || resendCooldown > 0}
            className="text-sm text-muted-foreground hover:text-violet-400"
          >
            {resendLoading ? (
              <Loader2 className="w-3 h-3 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-3 h-3 mr-2" />
            )}
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
          </Button>

          <p className="text-xs text-muted-foreground mt-4">
            Wrong email? <Link href="/register" className="text-violet-400 hover:text-violet-300">Go back</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center hero-gradient">
        <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
      </div>
    }>
      <VerifyOtpContent />
    </Suspense>
  );
}
