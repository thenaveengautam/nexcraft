"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut, Crown } from "lucide-react";
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
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 lg:px-8 bg-black border-b border-white/5">
      {/* Mobile Nav */}
      <MobileNav />

      {/* Spacer for desktop */}
      <div className="hidden lg:block" />

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Plan Badge */}
        {plan === "pro" && (
          <div className="pro-badge">
            <Crown className="w-3 h-3" />
            PRO
          </div>
        )}



        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Avatar className="w-9 h-9 border-2 border-white/10 hover:border-zinc-500/30 transition-all">
              <AvatarImage src={(user?.image as string) || ""} />
              <AvatarFallback className="bg-zinc-900 text-zinc-400 text-sm font-heading">
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
