"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Crown,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_TEMPLATES } from "@/lib/constants";
import UpgradeModal from "@/components/shared/UpgradeModal";

export default function TemplatesPage() {
  const { data: session } = useSession();
  const user = session?.user as Record<string, unknown> | undefined;
  const plan = (user?.plan as string) || "free";
  const router = useRouter();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [customTemplates, setCustomTemplates] = useState<typeof DEFAULT_TEMPLATES>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    platform: "instagram",
    contentType: "caption",
    tone: "professional",
    language: "english",
    topic: "",
  });

  // Fetch custom templates
  useEffect(() => {
    fetch("/api/templates")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setCustomTemplates(d.data.custom);
      });
  }, []);

  const allTemplates = [
    ...DEFAULT_TEMPLATES.map((t) => ({ ...t, isDefault: true as const, _id: t.name })),
    ...customTemplates.map((t) => ({ ...t, isDefault: false as const })),
  ];

  const filtered = allTemplates.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleUseTemplate = (template: (typeof allTemplates)[0]) => {
    const params = new URLSearchParams({
      platform: template.platform,
      type: template.contentType,
      topic: template.topic,
    });
    router.push(`/generate?${params}`);
  };

  const handleCreateTemplate = async () => {
    if (plan !== "business") {
      setShowUpgrade(true);
      return;
    }

    setCreateLoading(true);
    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTemplate),
      });
      const data = await res.json();
      if (data.success) {
        setCustomTemplates((prev) => [...prev, data.data]);
        setShowCreate(false);
        setNewTemplate({ name: "", description: "", platform: "instagram", contentType: "caption", tone: "professional", language: "english", topic: "" });
        toast({ title: "Template created!" });
      }
    } catch {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-heading font-bold mb-1">Templates</h1>
            <p className="text-muted-foreground text-sm">One-click content generation with pre-built prompts</p>
          </div>
          <Button
            onClick={() => plan === "business" ? setShowCreate(true) : setShowUpgrade(true)}
            className="btn-premium text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Template
            {plan !== "business" && <Crown className="w-3 h-3 ml-2 text-amber-400" />}
          </Button>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 focus:border-violet-500/50"
          />
        </div>
      </motion.div>

      {/* Template Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((template, i) => (
          <motion.div
            key={template.name + i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="glass-card-hover p-5 cursor-pointer group"
            onClick={() => handleUseTemplate(template)}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{template.icon}</span>
              {!template.isDefault && (
                <span className="text-xs px-2 py-0.5 rounded bg-violet-500/10 text-violet-400">Custom</span>
              )}
            </div>
            <h3 className="font-heading font-semibold text-sm mb-1">{template.name}</h3>
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{template.description}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-white/5 capitalize">{template.platform}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-white/5 capitalize">{template.tone}</span>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">
              Use template <ArrowRight className="w-3 h-3" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Template Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="glass-card border-white/10 max-w-lg">
          <h2 className="text-lg font-heading font-semibold mb-4">Create Custom Template</h2>
          <div className="space-y-4">
            <div>
              <Label>Template Name</Label>
              <Input
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                placeholder="E.g., Weekly Product Update"
                className="bg-white/5 border-white/10 mt-1"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                placeholder="Brief description of this template"
                className="bg-white/5 border-white/10 mt-1"
              />
            </div>
            <div>
              <Label>Default Topic / Prompt</Label>
              <Textarea
                value={newTemplate.topic}
                onChange={(e) => setNewTemplate({ ...newTemplate, topic: e.target.value })}
                placeholder="The topic or prompt that will auto-fill when using this template"
                className="bg-white/5 border-white/10 mt-1 min-h-[80px]"
              />
            </div>
            <Button onClick={handleCreateTemplate} disabled={createLoading || !newTemplate.name || !newTemplate.topic} className="w-full btn-premium">
              {createLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Create Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  );
}
