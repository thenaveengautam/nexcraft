"use client";

import { useSession, signOut } from "next-auth/react";
import { Bell, LogOut, Crown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MobileNav from "./MobileNav";
import Link from "next/link";

export default function Topbar() {
  const { data: session } = useSession();
  const user = session?.user as Record<string, unknown> | undefined;
  const plan = (user?.plan as string) || "free";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 lg:px-8 glass-card rounded-none border-b border-white/5">
      {/* Mobile Nav */}
      <MobileNav />

      {/* Spacer for desktop */}
      <div className="hidden lg:block" />

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Plan Badge */}
        {plan === "pro" ? (
          <div className="pro-badge">
            <Crown className="w-3 h-3" />
            PRO
          </div>
        ) : (
          <Link href="/billing">
            <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground hover:text-violet-400 hover:border-violet-500/30 transition-all cursor-pointer">
              Free Plan
            </span>
          </Link>
        )}

        {/* Notifications */}
        <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all relative">
          <Bell className="w-5 h-5" />
        </button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Avatar className="w-9 h-9 border-2 border-white/10 hover:border-violet-500/30 transition-all">
              <AvatarImage src={(user?.image as string) || ""} />
              <AvatarFallback className="bg-violet-500/10 text-violet-400 text-sm font-heading">
                {(user?.name as string)?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 glass-card border-white/10">
            <div className="p-3">
              <p className="text-sm font-medium">{user?.name as string}</p>
              <p className="text-xs text-muted-foreground">{user?.email as string}</p>
            </div>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/billing" className="cursor-pointer">Billing</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/" })}
              className="cursor-pointer text-red-400 focus:text-red-400 font-semibold hover:!bg-red-500 hover:!text-white focus:!bg-red-500 focus:!text-white transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
