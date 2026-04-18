"use client";

import { useState, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  Sparkles,
  Copy,
  RefreshCw,
  Check,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PLATFORMS, TONES, LANGUAGES, PLAN_LIMITS } from "@/lib/constants";
import { Platform, ContentType, Tone, Language } from "@/types";
import { cn } from "@/lib/utils";
import UpgradeModal from "@/components/shared/UpgradeModal";

function GenerateContent() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const user = session?.user as Record<string, unknown> | undefined;
  const plan = (user?.plan as string) || "free";
  const { toast } = useToast();

  const [platform, setPlatform] = useState<Platform>(
    (searchParams.get("platform") as Platform) || "instagram"
  );
  const [contentType, setContentType] = useState<ContentType>(
    (searchParams.get("type") as ContentType) || "caption"
  );
  const [tone, setTone] = useState<Tone>("professional");
  const [language, setLanguage] = useState<Language>("english");
  const [topic, setTopic] = useState(searchParams.get("topic") || "");
  const [output, setOutput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const currentPlatform = PLATFORMS.find((p) => p.id === platform)!;
  const currentContentType = currentPlatform.contentTypes.find((c) => c.id === contentType);
  const charLimit = currentContentType?.charLimit;

  const handlePlatformChange = (p: Platform) => {
    setPlatform(p);
    const first = PLATFORMS.find((pl) => pl.id === p)?.contentTypes[0];
    if (first) setContentType(first.id);
  };

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) {
      toast({ title: "Enter a topic", description: "Please enter a topic or keyword", variant: "destructive" });
      return;
    }

    setGenerating(true);
    setOutput("");

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, contentType, tone, language, topic }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const err = await res.json();
        if (err.error === "USAGE_LIMIT_REACHED") {
          setShowUpgrade(true);
          setGenerating(false);
          return;
        }
        throw new Error(err.error || "Generation failed");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No reader");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.done) break;
              if (data.error) throw new Error(data.error);
              if (data.text) {
                setOutput((prev) => prev + data.text);
              }
            } catch {
              // Skip parse errors
            }
          }
        }
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        toast({
          title: "Generation failed",
          description: (error as Error).message,
          variant: "destructive",
        });
      }
    } finally {
      setGenerating(false);
    }
  }, [platform, contentType, tone, language, topic, toast]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied!", description: "Content copied to clipboard" });
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setGenerating(false);
  };

  const planLimits = PLAN_LIMITS[plan as "free" | "pro"];

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-heading font-bold mb-1">Content Generator</h1>
        <p className="text-muted-foreground text-sm mb-6">Create AI-powered content for any platform</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Controls */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-5"
        >
          {/* Platform Selector */}
          <div>
            <label className="text-sm font-medium mb-3 block">Platform</label>
            <div className="grid grid-cols-2 gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePlatformChange(p.id)}
                  className={cn(
                    "glass-card p-3 flex items-center gap-3 transition-all duration-200 cursor-pointer",
                    platform === p.id ? "platform-selected" : "hover:bg-white/5"
                  )}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: p.bgColor }}
                  >
                    <p.icon className="w-5 h-5" style={{ color: p.color }} />
                  </div>
                  <span className="text-sm font-medium">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Type */}
          <div>
            <label className="text-sm font-medium mb-3 block">Content Type</label>
            <div className="flex flex-wrap gap-2">
              {currentPlatform.contentTypes.map((ct) => (
                <button
                  key={ct.id}
                  onClick={() => setContentType(ct.id)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    contentType === ct.id
                      ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                      : "bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10"
                  )}
                >
                  {ct.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tone */}
          <div>
            <label className="text-sm font-medium mb-3 block">Tone</label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => {
                const isAllowed = planLimits.allowedTones.includes(t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => isAllowed ? setTone(t.id) : setShowUpgrade(true)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5",
                      !isAllowed && "opacity-50",
                      tone === t.id
                        ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                        : "bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10"
                    )}
                  >
                    <span>{t.emoji}</span>
                    {t.label}
                    {!isAllowed && <span className="pro-badge text-[10px] ml-1 py-0 px-1.5">PRO</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="text-sm font-medium mb-3 block">Language</label>
            <div className="flex gap-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLanguage(l.id)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                    language === l.id
                      ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                      : "bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10"
                  )}
                >
                  <span>{l.flag}</span>
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Topic Input */}
          <div>
            <label className="text-sm font-medium mb-3 block">Topic / Keywords</label>
            <Textarea
              placeholder="E.g., Launch of our new AI productivity app that helps freelancers save 10 hours per week..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="min-h-[120px] bg-white/5 border-white/10 focus:border-violet-500/50 resize-none"
            />
            <div className="flex justify-between mt-2">
              <p className="text-xs text-muted-foreground">{topic.length} characters</p>
              {charLimit && (
                <p className="text-xs text-muted-foreground">Output limit: {charLimit} chars</p>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex gap-3">
            <Button
              onClick={generating ? handleStop : handleGenerate}
              disabled={!topic.trim() && !generating}
              className={cn(
                "flex-1 h-12 font-heading font-semibold text-sm",
                generating
                  ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                  : "btn-premium"
              )}
            >
              {generating ? (
                <>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Content
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Right: Output Panel */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="gradient-glow gradient-glow-active sticky top-24">
            <div className="glass-card min-h-[500px] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span className="text-sm font-heading font-semibold">Output</span>
                  {generating && (
                    <span className="flex items-center gap-1 text-xs text-cyan-400">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Generating...
                    </span>
                  )}
                </div>
                {output && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      className="text-sm h-8 text-muted-foreground hover:text-foreground"
                    >
                      {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleGenerate}
                      disabled={generating}
                      className="text-sm h-8 text-muted-foreground hover:text-foreground"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Redo
                    </Button>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                {output ? (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{output}</div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mb-4">
                      <Sparkles className="w-8 h-8 text-violet-400/50" />
                    </div>
                    <p className="text-muted-foreground text-sm">Your AI-generated content will appear here</p>
                    <p className="text-muted-foreground text-xs mt-1">Select options and click Generate</p>
                  </div>
                )}
              </div>

              {/* Character count */}
              {output && charLimit && (
                <div className="px-6 py-3 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {output.length} / {charLimit} characters
                    </span>
                    <div className="w-32 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min((output.length / charLimit) * 100, 100)}%`,
                          background: output.length > charLimit
                            ? "#ef4444"
                            : "linear-gradient(90deg, #7c3aed, #06b6d4)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-violet-400" /></div>}>
      <GenerateContent />
    </Suspense>
  );
}
