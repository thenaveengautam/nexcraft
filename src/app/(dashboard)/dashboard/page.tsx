"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  Star,
  TrendingUp,
  ArrowRight,
  Zap,
} from "lucide-react";

interface UsageData {
  used: number;
  limit: number;
  plan: string;
  percentage: number;
  totalContent: number;
  totalFavorites: number;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user as Record<string, unknown> | undefined;
  const [usage, setUsage] = useState<UsageData | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  useEffect(() => {
    fetch("/api/usage")
      .then((r) => r.json())
      .then((d) => { if (d.success) setUsage(d.data); });
  }, []);

  const stats = [
    {
      label: "Total Generations",
      value: usage?.totalContent || 0,
      icon: Sparkles,
      color: "#a855f7",
      bg: "rgba(168, 85, 247, 0.1)",
    },
    {
      label: "This Month",
      value: usage?.used || 0,
      icon: TrendingUp,
      color: "#06b6d4",
      bg: "rgba(6, 182, 212, 0.1)",
    },
    {
      label: "Favorites",
      value: usage?.totalFavorites || 0,
      icon: Star,
      color: "#f59e0b",
      bg: "rgba(245, 158, 11, 0.1)",
    },
    {
      label: "Plan",
      value: usage?.plan === "pro" ? "Pro ✨" : "Free",
      icon: Zap,
      color: usage?.plan === "pro" ? "#f59e0b" : "#64748b",
      bg: usage?.plan === "pro" ? "rgba(245, 158, 11, 0.1)" : "rgba(100, 116, 139, 0.1)",
    },
  ];

  const quickActions = [
    { label: "Instagram Caption", href: "/generate?platform=instagram&type=caption", emoji: "📸" },
    { label: "Tweet", href: "/generate?platform=twitter&type=tweet", emoji: "🐦" },
    { label: "LinkedIn Post", href: "/generate?platform=linkedin&type=post", emoji: "💼" },
    { label: "YouTube Title", href: "/generate?platform=youtube&type=video-title", emoji: "🎬" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-heading font-bold mb-1">
          Welcome back, <span className="text-gradient">{(user?.name as string)?.split(" ")[0] || "Creator"}</span> 👋
        </h1>
        <p className="text-muted-foreground">Ready to craft some amazing content?</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="glass-card p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: stat.bg }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-2xl font-heading font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Usage Meter (Free users) */}
      {usage && usage.plan === "free" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-semibold">Monthly Usage</h3>
            <span className="text-sm text-muted-foreground">
              <span className="text-foreground font-medium">{usage.used}</span> / {usage.limit} generations
            </span>
          </div>
          <div className={`usage-bar ${usage.percentage >= 80 ? "usage-bar-warning" : ""}`}>
            <div
              className="usage-bar-fill"
              style={{ width: `${Math.min(usage.percentage, 100)}%` }}
            />
          </div>
          {usage.percentage >= 80 && (
            <p className="text-xs text-amber-400 mt-2 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Running low! <Link href="/billing" className="text-violet-400 underline">Upgrade to Pro</Link> for unlimited.
            </p>
          )}
        </motion.div>
      )}

      {/* Quick Generate */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <h2 className="text-lg font-heading font-semibold mb-4">Quick Generate</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}>
              <div className="glass-card p-4 flex items-center gap-3 cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-500/10">
                <span className="text-2xl">{action.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{action.label}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-violet-400 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <div 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative overflow-hidden rounded-2xl p-[1px] text-center group shadow-2xl hover:shadow-violet-500/20 transition-[box-shadow,transform] duration-200 ease-out"
        >
          {/* Animated Spinning Border Beams */}
          <div className="absolute inset-[-100%] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#00000000_80%,#8b5cf6_100%)] animate-[spin_4s_linear_infinite]" />
          <div className="absolute inset-[-100%] bg-[conic-gradient(from_270deg_at_50%_50%,#00000000_50%,#00000000_80%,#06b6d4_100%)] animate-[spin_4s_linear_infinite]" />

          {/* Inner Card (covers the middle of the conic gradient) */}
          <div className="relative h-full w-full bg-[#09090b] rounded-[15px] p-8 lg:p-12 overflow-hidden flex flex-col items-center justify-center">

            {/* Animated Cosmic Grid Background (Inside) */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none" />

            {/* Moving Gradient Orbs */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-violet-600/30 rounded-full blur-[120px] animate-pulse pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: "2s" }} />

            <div className="relative z-10 w-full">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 mb-6 shadow-lg shadow-black/50 backdrop-blur-md">
                <Sparkles className="w-8 h-8 text-violet-400 animate-[pulse_3s_ease-in-out_infinite]" />
              </div>
              <h2 className="text-3xl font-heading font-bold mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-white animate-pulse">Start Creating</h2>
              <p className="text-muted-foreground text-sm md:text-base mb-8 max-w-md mx-auto leading-relaxed">
                Generate scroll-stopping content for any social media platform in seconds with AI.
              </p>
              <Link href="/generate">
                <button className="btn-premium px-8 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-violet-500/40">
                  Open Generator <ArrowRight className="w-4 h-4 ml-2 inline transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
