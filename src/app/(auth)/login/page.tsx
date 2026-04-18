"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { GoogleIcon } from "@/components/icons/SocialIcons";
import { Button } from "@/components/ui/button";
import { NexcraftLogo } from "@/components/shared/NexcraftLogo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error.startsWith("UNVERIFIED:")) {
          const userEmail = result.error.split("UNVERIFIED:")[1];
          toast({
            title: "Email not verified",
            description: "Please verify your email first",
            variant: "destructive",
          });
          router.push(`/verify-otp?email=${encodeURIComponent(userEmail)}`);
          return;
        }

        toast({
          title: "Login failed",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "Redirecting to dashboard...",
        });
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center hero-gradient relative px-4 py-4 sm:py-8">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <Link href="/" className="flex items-center gap-1 group">
            <NexcraftLogo />
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-gradient">Nexcraft</h1>
          </Link>
        </div>

        {/* Card */}
        <div className="glass-card p-5 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-heading font-semibold text-center mb-4 sm:mb-6">Welcome back</h2>

          {/* Google */}
          <Button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            variant="outline"
            className="w-full h-10 sm:h-11 bg-white/5 border-white/10 hover:bg-white/10 hover:border-violet-500/30 transition-all mb-4 sm:mb-5"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mr-2" />
            ) : (
              <GoogleIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            )}
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4 sm:mb-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-muted-foreground text-xs">or sign in with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-10 sm:h-11 bg-white/5 border-white/10 focus:border-violet-500/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-10 sm:h-11 bg-white/5 border-white/10 focus:border-violet-500/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 sm:h-11 btn-premium"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Sign In
            </Button>
          </form>

          <p className="text-center text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-5">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
