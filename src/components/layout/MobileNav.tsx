"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu, Sparkles, LayoutDashboard, History, LayoutTemplate, CreditCard, Settings } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { NexcraftLogo } from "@/components/shared/NexcraftLogo";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/generate", label: "Generate", icon: Sparkles },
  { href: "/history", label: "History", icon: History },
  { href: "/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden flex items-center gap-2">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="p-2 -ml-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
            <Menu className="w-5 h-5" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 glass-card border-white/5 p-0">
          {/* Logo */}
          <div className="p-6 border-b border-white/5">
            <Link href="/dashboard" className="flex items-center gap-1.5 group" onClick={() => setOpen(false)}>
              <div className="flex items-center justify-center scale-90">
                 <NexcraftLogo />
              </div>
              <h1 className="text-xl font-heading font-bold text-zinc-100 tracking-wide group-hover:opacity-90 transition-opacity">Nexcraft</h1>
            </Link>
          </div>

          {/* Nav */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-zinc-900 text-zinc-400 border border-zinc-500/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
      <Link href="/dashboard" className="flex items-center gap-1.5 group">
        <div className="flex items-center justify-center scale-75">
           <NexcraftLogo />
        </div>
        <div>
          <h1 className="text-lg font-heading font-bold text-zinc-100 tracking-wide group-hover:opacity-90 transition-opacity">Nexcraft</h1>
        </div>
      </Link>
    </div>
  );
}
