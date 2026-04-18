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
              <div className="glass-card-hover p-4 flex items-center gap-3 cursor-pointer group">
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
        className="gradient-glow gradient-glow-active"
      >
        <div className="glass-card p-8 text-center">
          <Sparkles className="w-10 h-10 text-violet-400 mx-auto mb-4" />
          <h2 className="text-xl font-heading font-bold mb-2">Start Creating</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
            Generate scroll-stopping content for any social media platform in seconds with AI
          </p>
          <Link href="/generate">
            <button className="btn-premium px-8 py-3 text-sm">
              Open Generator <Sparkles className="w-4 h-4 ml-2 inline" />
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
