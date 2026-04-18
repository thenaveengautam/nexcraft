"use client";

import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { User, Mail, Shield, LogOut, Crown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const { data: session } = useSession();
  const user = session?.user as Record<string, unknown> | undefined;
  const plan = (user?.plan as string) || "free";

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-heading font-bold mb-1">Settings</h1>
        <p className="text-muted-foreground text-sm mb-8">Manage your account</p>
      </motion.div>

      {/* Profile */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 mb-6"
      >
        <h3 className="font-heading font-semibold mb-4">Profile</h3>
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border-2 border-white/10">
            <AvatarImage src={(user?.image as string) || ""} />
            <AvatarFallback className="bg-violet-500/10 text-violet-400 text-xl font-heading">
              {(user?.name as string)?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium flex items-center gap-2">
              {user?.name as string}
              {plan === "pro" && <span className="pro-badge text-[10px]"><Crown className="w-2.5 h-2.5" /> PRO</span>}
            </p>
            <p className="text-sm text-muted-foreground">{user?.email as string}</p>
          </div>
        </div>
      </motion.div>

      {/* Account */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 mb-6"
      >
        <h3 className="font-heading font-semibold mb-4">Account</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Name</p>
              <p className="text-xs text-muted-foreground">{user?.name as string}</p>
            </div>
          </div>
          <Separator className="bg-white/5" />
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-xs text-muted-foreground">{user?.email as string}</p>
            </div>
          </div>
          <Separator className="bg-white/5" />
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Email Verified</p>
              <p className="text-xs text-green-400">✓ Verified</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6 border-red-500/0"
      >
        <h3 className="font-heading font-semibold mb-4 text-red-400">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-4">Sign out of your account</p>
        <Button
          onClick={() => signOut({ callbackUrl: "/" })}
          variant="outline"
          className="border-red-500/30 text-red-400 hover:bg-red-600/90"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </motion.div>
    </div>
  );
}
