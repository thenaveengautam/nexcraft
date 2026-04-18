"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Sparkles,
  History,
  LayoutTemplate,
  CreditCard,
  Settings,
  Crown,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/generate", label: "Generate", icon: Sparkles },
  { href: "/history", label: "History", icon: History },
  { href: "/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 glass-card rounded-none border-r border-white/5 z-40">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 to-violet-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-heading font-bold text-gradient">Nexcraft</h1>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Pro Upgrade CTA */}
      <div className="p-4">
        <div className="rounded-xl p-4 bg-gradient-to-br from-violet-600/10 to-cyan-500/10 border border-violet-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-5 h-5 text-gold-500" />
            <span className="font-heading font-semibold text-sm">Upgrade to Pro</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Unlimited generations, all tones, custom templates</p>
          <Link href="/billing">
            <button className="w-full py-2 rounded-lg text-xs font-semibold btn-premium">
              Upgrade — $9/mo
            </button>
          </Link>
        </div>
      </div>
    </aside>
  );
}
