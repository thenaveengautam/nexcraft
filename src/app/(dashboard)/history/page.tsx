"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Copy,
  Trash2,
  Check,
  Sparkles,
} from "lucide-react";
import { InstagramIcon, TwitterIcon, LinkedinIcon, YoutubeIcon } from "@/components/icons/SocialIcons";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn, timeAgo } from "@/lib/utils";
import { IContent, Platform } from "@/types";
import Link from "next/link";

const platformIcons: Record<Platform, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  instagram: InstagramIcon,
  twitter: TwitterIcon,
  linkedin: LinkedinIcon,
  youtube: YoutubeIcon,
};

const platformColors: Record<Platform, string> = {
  instagram: "#E1306C",
  twitter: "#1DA1F2",
  linkedin: "#0A66C2",
  youtube: "#FF0000",
};

export default function HistoryPage() {
  const [contents, setContents] = useState<IContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchContents = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.set("platform", filter);
      if (favoritesOnly) params.set("favorites", "true");
      params.set("limit", "50");

      const res = await fetch(`/api/content?${params}`);
      const data = await res.json();
      if (data.success) {
        setContents(data.data.contents);
      }
    } catch {
      toast({ title: "Error loading history", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [filter, favoritesOnly, toast]);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  const handleToggleFavorite = async (id: string) => {
    try {
      const res = await fetch(`/api/content/${id}`, { method: "PATCH" });
      const data = await res.json();
      if (data.success) {
        setContents((prev) =>
          prev.map((c) => (c._id === id ? { ...c, isFavorite: !c.isFavorite } : c))
        );
      }
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/content/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setContents((prev) => prev.filter((c) => c._id !== id));
        toast({ title: "Content deleted" });
      }
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const platforms = [
    { id: "all", label: "All" },
    { id: "instagram", label: "Instagram" },
    { id: "twitter", label: "Twitter/X" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "youtube", label: "YouTube" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-heading font-bold mb-1">Content History</h1>
        <p className="text-muted-foreground text-sm mb-6">All your generated content in one place</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-3 mb-6"
      >
        <div className="flex gap-1 bg-white/5 rounded-lg p-1">
          {platforms.map((p) => (
            <button
              key={p.id}
              onClick={() => setFilter(p.id)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                filter === p.id
                  ? "bg-violet-500/20 text-violet-400"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setFavoritesOnly(!favoritesOnly)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
            favoritesOnly
              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
              : "bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10"
          )}
        >
          <Star className="w-3 h-3" />
          Favorites
        </button>
      </motion.div>

      {/* Content List */}
      {loading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card p-6 shimmer h-40 rounded-xl" />
          ))}
        </div>
      ) : contents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-violet-400/50" />
          </div>
          <h3 className="font-heading font-semibold mb-2">No content yet</h3>
          <p className="text-muted-foreground text-sm mb-4">Start generating to build your library</p>
          <Link href="/generate">
            <Button className="btn-premium">Go to Generator</Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {contents.map((content, i) => {
            const Icon = platformIcons[content.platform];
            const color = platformColors[content.platform];
            return (
              <motion.div
                key={content._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card-hover p-5 group"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${color}15` }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-white/5 capitalize">
                        {content.contentType.replace("-", " ")}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize">{content.tone}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{timeAgo(content.createdAt)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 truncate">{content.topic}</p>
                    <p className="text-sm line-clamp-3 leading-relaxed">{content.generatedContent}</p>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => handleToggleFavorite(content._id)}
                      className={cn(
                        "p-2 rounded-lg transition-all",
                        content.isFavorite ? "text-amber-400" : "text-muted-foreground hover:text-amber-400"
                      )}
                    >
                      <Star className={cn("w-4 h-4", content.isFavorite && "fill-current")} />
                    </button>
                    <button
                      onClick={() => handleCopy(content._id, content.generatedContent)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-all"
                    >
                      {copiedId === content._id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(content._id)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
