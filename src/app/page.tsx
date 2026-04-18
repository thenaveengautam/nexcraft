"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Zap,
  Shield,
  Globe,
  Crown,
  Star,
  CheckCircle,
  X,
  ChevronRight,
  ChevronDown,
  ArrowUp,
  Users,
  FileText,
  TrendingUp,
  Menu,
  X as XIcon,
} from "lucide-react";
import { InstagramIcon, TwitterIcon, LinkedinIcon, YoutubeIcon } from "@/components/icons/SocialIcons";
import { Button } from "@/components/ui/button";
import { NexcraftLogo } from "@/components/shared/NexcraftLogo";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

// Counter animation component
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasAnimated(true);
          let current = 0;
          const step = Math.ceil(target / 60);
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(current);
            }
          }, 20);
        }
      },
      { threshold: 0.5 }
    );
    const el = document.getElementById(`counter-${target}`);
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return (
    <span id={`counter-${target}`}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}



export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText("contact@trynaveen.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Reviews", href: "#reviews" },
    { label: "FAQ", href: "#faq" },
    { label: "Footer", href: "#footer" },
  ];

  const faqs = [
    {
      question: "What is Nexcraft and how does it work?",
      answer: "Nexcraft is an AI-powered social media content generator. Simply select your platform (Instagram, Twitter/X, LinkedIn, YouTube), choose a content type, set your tone and language, enter a topic — and our AI generates scroll-stopping content in seconds using advanced language models.",
    },
    {
      question: "Is there a free plan available?",
      answer: "Yes! Our Free plan gives you 10 generations per month with 3 tone options across all platforms. No credit card required to get started.",
    },
    {
      question: "What's the difference between Pro and Business?",
      answer: "Pro gives you 50 generations/month, access to all 5 tones, 20+ pre-built templates, and priority AI generation. Business gives you unlimited generations, custom templates, and dedicated support — perfect for teams and agencies.",
    },
    {
      question: "Can I generate content in Hindi or Hinglish?",
      answer: "Absolutely! Nexcraft supports English, Hindi, and Hinglish content generation. This makes it perfect for Indian creators and businesses targeting multilingual audiences.",
    },
    {
      question: "How does the AI generate content?",
      answer: "We use Google's Gemini AI model to generate high-quality, contextual content. Each generation is tailored to the specific platform's best practices, character limits, and formatting guidelines.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your Pro or Business subscription at any time from the Billing page. No hidden fees, no long-term commitments. Your access continues until the end of your billing period.",
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden scroll-smooth">
      {/* ===== NAVBAR ===== */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/5"
            : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1 group">
            <NexcraftLogo />
            <span className="text-xl font-heading font-bold text-white tracking-wide">Nexcraft</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-white hover:text-white transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-violet-500 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" className="text-sm text-white/90 hover:text-white bg-white/[0.03] border border-violet-500/20 hover:bg-violet-500/10 hover:border-violet-500/70 hover:shadow-lg hover:shadow-violet-500/10 rounded-lg px-5 transition-all duration-300">
                Sign In
              </Button>
            </Link>
            <Link href="/register" className="hidden sm:block">
              <Button className="btn-premium text-sm px-5">
                Get Started <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            >
              {mobileMenuOpen ? <XIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background/95 backdrop-blur-xl border-b border-white/10"
            >
              <div className="px-4 py-4 space-y-3">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="flex gap-2 pt-2">
                  <Link href="/login" className="flex-1">
                    <Button variant="outline" className="w-full bg-white/5 border-white/10">Sign In</Button>
                  </Link>
                  <Link href="/register" className="flex-1">
                    <Button className="w-full btn-premium">Get Started</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative pt-20 pb-20 px-4 sm:px-6 hero-gradient overflow-hidden">
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] animate-float pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[120px] animate-float pointer-events-none" style={{ animationDelay: "3s" }} />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div {...fadeIn} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-sm text-indigo-300 mb-6 hover:bg-indigo-500/15 transition-colors cursor-default">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Content Generator
            </div>
          </motion.div>

          <motion.h1 {...fadeIn} transition={{ duration: 0.6, delay: 0.1 }} className="text-4xl sm:text-5xl lg:text-7xl font-heading font-bold leading-tight mb-6">
            Craft Content That{" "}
            <span className="text-gradient">Glows</span>
          </motion.h1>

          <motion.p {...fadeIn} transition={{ duration: 0.6, delay: 0.2 }} className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Generate scroll-stopping social media content for Instagram, Twitter/X, LinkedIn & YouTube in seconds with the power of AI.
          </motion.p>

          <motion.div {...fadeIn} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button className="btn-premium h-13 px-8 text-base">
                Start Free <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" className="h-13 px-8 text-base bg-white/[0.01] border-violet-500/30 text-white hover:bg-violet-500/10 hover:border-violet-500/70 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300">
                See Features
              </Button>
            </a>
          </motion.div>

          {/* Platform icons */}
          <motion.div {...fadeIn} transition={{ duration: 0.6, delay: 0.4 }} className="flex items-center justify-center gap-6 mt-12">
            {[
              { icon: InstagramIcon, color: "#E1306C", label: "Instagram" },
              { icon: TwitterIcon, color: "#1DA1F2", label: "Twitter/X" },
              { icon: LinkedinIcon, color: "#0A66C2", label: "LinkedIn" },
              { icon: YoutubeIcon, color: "#FF0000", label: "YouTube" },
            ].map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-125 hover:shadow-lg cursor-pointer"
                style={{ background: `${p.color}15` }}
                title={p.label}
              >
                <p.icon className="w-6 h-6" style={{ color: p.color }} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF STATS ===== */}
      <section className="py-16 px-4 sm:px-6 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 10000, suffix: "+", label: "Active Creators", icon: Users },
              { value: 500000, suffix: "+", label: "Content Generated", icon: FileText },
              { value: 4, suffix: "", label: "Platforms Supported", icon: Globe },
              { value: 98, suffix: "%", label: "Satisfaction Rate", icon: TrendingUp },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center bg-violet-500/10 group-hover:bg-violet-500/20 transition-colors">
                  <stat.icon className="w-5 h-5 text-violet-400" />
                </div>
                <p className="text-3xl sm:text-4xl font-heading font-bold text-gradient">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeIn} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
              Everything You Need to <span className="text-gradient">Create & Scale</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Powerful features designed for modern content creators, marketers, and businesses
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Sparkles, title: "AI Content Generator", description: "Generate captions, tweets, posts, and more with advanced AI. Choose your platform, tone, and language.", color: "#a855f7" },
              { icon: Zap, title: "Real-time Streaming", description: "Watch your content generate token-by-token in real-time. No waiting for results.", color: "#06b6d4" },
              { icon: Globe, title: "Multi-Language", description: "Create content in English, Hindi, or Hinglish. Perfect for Indian and global audiences.", color: "#22c55e" },
              { icon: Star, title: "20+ Templates", description: "Pre-built templates for product launches, motivational quotes, offers, and more. One-click fill.", color: "#f59e0b" },
              { icon: Shield, title: "Content Library", description: "All your generated content saved automatically. Search, filter, favorite, and reuse anytime.", color: "#ef4444" },
              { icon: Crown, title: "Pro Features", description: "Unlimited generations, custom templates, all tones, and priority AI for power users.", color: "#f59e0b" },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 group cursor-default transition-all duration-300 hover:-translate-y-2 hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-500/10"
                style={{ overflow: "visible" }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                  style={{ background: `${feature.color}15` }}
                >
                  <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="font-heading font-semibold mb-2 group-hover:text-white transition-colors">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 px-4 sm:px-6 relative">
        <div className="absolute inset-0 hero-gradient opacity-50" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div {...fadeIn} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-muted-foreground">Three simple steps to viral content</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Choose Platform", description: "Select your target platform — Instagram, Twitter/X, LinkedIn, or YouTube", emoji: "🎯" },
              { step: "02", title: "Customize", description: "Pick content type, tone, language, and enter your topic or keywords", emoji: "⚙️" },
              { step: "03", title: "Generate & Ship", description: "AI creates your content in seconds. Copy, edit, and post to your audience", emoji: "🚀" },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center group cursor-default"
              >
                <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">{item.emoji}</div>
                <div className="text-xs text-violet-400 font-heading font-bold mb-2">STEP {item.step}</div>
                <h3 className="font-heading font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeIn} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
              Simple, Transparent <span className="text-gradient">Pricing</span>
            </h2>
            <p className="text-muted-foreground">Start free. Upgrade when you need more power.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-4">
            {[
              {
                name: "Free",
                price: "0",
                description: "Get started with AI content",
                features: ["10 generations/month", "3 tones", "All platforms", "Content history"],
                notIncluded: ["20+ templates", "Custom templates", "All 5 tones", "Priority generation"],
                cta: "Get Started Free",
                popular: false,
              },
              {
                name: "Pro",
                price: "9",
                description: "For serious content creators",
                features: ["50 generations/month", "All 5 tones", "All platforms", "Content history", "20+ templates", "Priority AI generation", "Content export"],
                notIncluded: ["Custom templates", "Unlimited generations"],
                cta: "Start Pro Plan",
                popular: true,
              },
              {
                name: "Business",
                price: "29",
                description: "Unlimited power for teams",
                features: ["Unlimited generations", "All 5 tones", "All platforms", "Content history", "20+ templates", "Custom templates", "Priority AI generation", "Content export", "Dedicated support"],
                notIncluded: [],
                cta: "Start Business Plan",
                popular: false,
              },
            ].map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`glass-card p-8 relative overflow-visible transition-all duration-300 hover:-translate-y-2 hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-500/10 cursor-default`}
              >
                {p.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                    <span className="pro-badge px-4 py-1.5 text-xs whitespace-nowrap shadow-lg shadow-violet-500/20">⭐ MOST POPULAR</span>
                  </div>
                )}

                <h3 className="font-heading font-bold text-xl mb-1">{p.name}</h3>
                <p className="text-xs text-muted-foreground mb-4">{p.description}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl font-heading font-bold">${p.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>

                <div className="space-y-3 mb-8">
                  {p.features.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                      <span className="text-sm">{f}</span>
                    </div>
                  ))}
                  {p.notIncluded.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <X className="w-4 h-4 text-muted-foreground/30 shrink-0" />
                      <span className="text-sm text-muted-foreground/50">{f}</span>
                    </div>
                  ))}
                </div>

                <Link href="/register">
                  <Button className="w-full h-12 btn-premium">
                    {p.cta} <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="reviews" className="py-20 px-4 sm:px-6 relative">
        <div className="absolute inset-0 hero-gradient opacity-30" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div {...fadeIn} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
              Loved by <span className="text-gradient">Creators</span>
            </h2>
            <p className="text-muted-foreground">See what our users have to say</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Priya Sharma", role: "Instagram Creator", text: "Nexcraft saves me hours every week. The captions are spot-on and my engagement has doubled!", avatar: "PS", stars: 5 },
              { name: "Alex Chen", role: "Marketing Manager", text: "The multi-language support in Hinglish is incredible. Finally a tool that understands our audience.", avatar: "AC", stars: 5 },
              { name: "Rahul Singh", role: "YouTube Creator", text: "From video titles to descriptions, Nexcraft nails SEO optimization every time. Worth every penny.", avatar: "RS", stars: 5 },
              { name: "Sneha Patel", role: "Digital Marketer", text: "The thread generator is insane! I grew from 2K to 50K followers on Twitter/X in just 3 months using Nexcraft.", avatar: "SP", stars: 5 },
              { name: "David Miller", role: "Freelance Writer", text: "I was skeptical about AI writing tools, but Nexcraft's tone control is the best I've seen. Clients love the output.", avatar: "DM", stars: 5 },
              { name: "Ananya Gupta", role: "Startup Founder", text: "We replaced 3 different tools with Nexcraft. The templates alone save us 10+ hours per week on content creation.", avatar: "AG", stars: 5 },
            ].map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-6 transition-all duration-300 hover:-translate-y-2 hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-500/10 cursor-default group"
              >
                <div className="flex mb-3">
                  {[...Array(testimonial.stars)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform" style={{ transitionDelay: `${j * 30}ms` }} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">&quot;{testimonial.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-violet-500/15 flex items-center justify-center text-xs font-heading font-bold text-violet-300">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeIn} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
            <p className="text-muted-foreground">Everything you need to know about Nexcraft</p>
          </motion.div>

          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-500/10"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left group"
                >
                  <span className="font-heading font-medium text-base pr-4 group-hover:text-white transition-colors">{faq.question}</span>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${openFaq === i ? 'bg-violet-500/20 rotate-180' : 'bg-white/5'
                    }`}>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-colors duration-300 ${openFaq === i ? "text-violet-400" : "text-muted-foreground"
                        }`}
                    />
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-5">
                        <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* ===== FINAL CTA ===== */}
      <section className="py-20 px-4 sm:px-6 relative">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="glass-card p-12 transition-all duration-300 hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-500/10">
              <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
                Ready to <span className="text-gradient">Glow Up</span> Your Content?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Join thousands of creators using AI to craft scroll-stopping social media content in seconds.
              </p>
              <Link href="/register">
                <Button className="btn-premium h-13 px-10 text-base">
                  Get Started Free <Sparkles className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground mt-4">No credit card required · 10 free generations</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer id="footer" className="border-t border-white/5 pt-16 pb-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Footer Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Brand + Contact */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-1.5 mb-4 group inline-flex cursor-default">
                <NexcraftLogo />
                <span className="font-heading font-bold text-white tracking-wide">Nexcraft</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                AI-powered content generator for social media. Craft content that glows.
              </p>
              <a
                href="#"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 text-xs text-violet-400 hover:text-violet-300 transition-colors"
                title="Click to copy email"
              >
                {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-400" /> : <Globe className="w-3.5 h-3.5" />}
                {copied ? <span className="text-green-400">Copied to clipboard!</span> : "contact@trynaveen.com"}
              </a>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-heading font-semibold text-sm mb-4">Product</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Generator", href: "/register" },
                  { label: "Templates", href: "/register" },
                  { label: "Pricing", href: "#pricing" },
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-heading font-semibold text-sm mb-4">Support</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "FAQ", href: "#faq", onClick: undefined },
                  { label: "Contact Us", href: "#", onClick: handleCopyEmail },
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} onClick={item.onClick} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      {item.label === "Contact Us" && copied ? <span className="text-green-400 font-medium">Copied Email!</span> : item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-heading font-semibold text-sm mb-4">Legal</h4>
              <ul className="space-y-2.5">
                {[
                  "Privacy Policy",
                  "Terms of Service",
                ].map((item) => (
                  <li key={item}>
                    <span className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} &nbsp;Nexcraft.&nbsp; All&nbsp; rights&nbsp; reserved.
            </p>
            <p className="text-xs text-muted-foreground tracking-wide">Made&nbsp; with ✨ by&nbsp; Naveen</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
