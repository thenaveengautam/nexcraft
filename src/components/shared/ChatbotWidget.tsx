"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Mail, CheckCheck, Check, MessageCircle, Zap } from "lucide-react";

// Premium "N" avatar for header
function NxAvatar() {
  return (
    <div
      className="relative shrink-0 flex items-center justify-center font-bold text-white select-none"
      style={{
        width: 42,
        height: 42,
        borderRadius: 12,
        background: "linear-gradient(135deg, #4f1fb8 0%, #7c3aed 60%, #a855f7 100%)",
        boxShadow: "0 4px 16px rgba(124,58,237,0.55), inset 0 1px 0 rgba(255,255,255,0.25)",
        fontSize: "1.15rem",
        letterSpacing: "-0.5px",
      }}
    >
      N
      <span
        className="absolute flex items-center justify-center bg-[#1a1a2e] rounded-full"
        style={{ width: 16, height: 16, bottom: -4, right: -4, border: "2px solid #6d28d9" }}
      >
        <Zap className="text-violet-400" style={{ width: 9, height: 9 }} fill="currentColor" />
      </span>
    </div>
  );
}

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  time: string;
  quickReplies?: string[];
  hasEmailButton?: boolean;
  isRead?: boolean;
}

function renderMarkdown(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

function renderMessage(text: string) {
  return text.split("\n").map((line, i, arr) => (
    <span key={i}>{renderMarkdown(line)}{i < arr.length - 1 && <br />}</span>
  ));
}

function getBotResponse(input: string): { text: string; quickReplies?: string[]; hasEmailButton?: boolean } {
  const q = input.toLowerCase();

  if (/^(hi+|hello|hey|hola|namaste|yo)\b/.test(q)) return {
    text: "Hi there! 👋 Welcome to **Nexcraft**!\n\nI'm your AI-powered support assistant. I can help you with plans, features, account issues, and more.\n\nWhat can I help you with today?",
    quickReplies: ["How to get started? 🚀", "View pricing plans 💳", "How does AI work? 🤖", "Contact support 📬"],
  };

  if (q.includes("get started") || q.includes("started") || q.includes("begin") || q.includes("setup") || q.includes("how to use") || q.includes("kaise")) return {
    text: "Getting started is super easy! 🚀\n\n**Step 1** — Sign up on the homepage\n**Step 2** — Verify your email with OTP\n**Step 3** — Open the Generator on your dashboard\n**Step 4** — Pick platform, tone & language\n**Step 5** — Enter your topic & hit Generate!\n\nYou get **10 free generations/month** — no credit card needed! ✨",
    quickReplies: ["View pricing plans 💳", "What content can I create?", "Which platforms?"],
  };

  if (q.includes("plan") || q.includes("pric") || q.includes("cost") || q.includes("upgrade") || q.includes("subscri") || q.includes("offer") || q.includes("free tier")) return {
    text: "Here are our plans: 💳\n\n🆓 **Free** — $0/month\n• 10 generations/month\n• 3 tones • All 4 platforms\n\n⚡ **Pro** — $9/month\n• 50 generations/month\n• All 5 tones • 20+ templates\n• Priority generation\n\n🏢 **Business** — $29/month\n• Unlimited generations\n• Custom templates\n• Dedicated support\n\nUpgrade anytime from **Dashboard → Billing**!",
    quickReplies: ["What are templates?", "How do I upgrade?", "Cancel anytime?"],
  };

  if (q.includes("ai") || q.includes("how does") || q.includes("how it work") || q.includes("technolog") || q.includes("gemini")) return {
    text: "Here's how Nexcraft works: 🤖\n\nWe use **Google's Gemini AI** — one of the most powerful language models.\n\n**The process:**\n• You pick platform, type, tone & language\n• We craft an optimized AI prompt\n• Gemini generates tailored content\n• Content streams to you **in real-time**\n• Auto-saved to your library ✨\n\nSupports Hindi & Hinglish too! 🇮🇳",
    quickReplies: ["Which languages?", "What content types?", "View pricing 💳"],
  };

  if (q.includes("account") || q.includes("login") || q.includes("password") || q.includes("sign in") || q.includes("sign up") || q.includes("forgot") || q.includes("reset") || q.includes("otp") || q.includes("verify")) return {
    text: "Help with account issues: 🔐\n\n**Can't log in?**\n→ Check your email is correct\n→ Use 'Forgot Password' on the login page\n\n**OTP not received?**\n→ Check spam/junk folder\n→ Wait 60 seconds, then click Resend\n\n**Email verification?**\n→ 6-digit code in your inbox\n→ Code expires in 10 minutes\n\nStill stuck? Our team is here! 👇",
    quickReplies: ["Contact support 📬", "Billing help"],
    hasEmailButton: true,
  };

  if (q.includes("template") || q.includes("pre-built") || q.includes("preset")) return {
    text: "All about templates! 📋\n\n**Templates** are one-click content generators — they auto-fill platform, type, tone & topic.\n\n**20+ built-in templates:**\n📸 Instagram: Product Launch, Motivational Quote\n🐦 Twitter/X: Thread Starter, Trending Take\n💼 LinkedIn: Thought Leadership, Career Update\n🎬 YouTube: SEO Title, Shorts Hook\n\n**Who gets them:**\n• Free → No templates\n• Pro ($9/mo) → All 20+\n• Business → Create custom ones!",
    quickReplies: ["View pricing plans 💳", "How to get started? 🚀"],
  };

  if (q.includes("language") || q.includes("hindi") || q.includes("hinglish") || q.includes("bhasha")) return {
    text: "Language support: 🌍\n\n🇺🇸 **English** — Standard professional content\n🇮🇳 **Hindi** — Pure Hindi (देवनागरी)\n🔀 **Hinglish** — Hindi + English mix\n\n**Hinglish example:**\n*\"Yaar, aaj ka din mast hai! Let's talk about...\"* 😄\n\nAll languages work across all platforms and tones!",
    quickReplies: ["What content types?", "How to get started? 🚀"],
  };

  if (q.includes("content type") || q.includes("what can") || q.includes("caption") || q.includes("reel") || q.includes("thread") || q.includes("bio") || q.includes("hashtag")) return {
    text: "Content types we support: 📝\n\n**Instagram:** Caption, Reel Hook, Bio, Hashtag Set\n**Twitter/X:** Tweet, Thread, Reply Hook\n**LinkedIn:** Post, Carousel Script, Connection Note\n**YouTube:** Video Title, Description, Shorts Hook, Community Post\n\nEvery type is **optimized** for that platform's algorithm, limits & engagement! 🎯",
    quickReplies: ["Which tones?", "View pricing plans 💳"],
  };

  if (q.includes("tone") || q.includes("professional") || q.includes("casual") || q.includes("humorous") || q.includes("inspirational") || q.includes("storytelling")) return {
    text: "Available tones: 🎨\n\n1️⃣ **Professional** — Corporate, formal\n2️⃣ **Casual** — Relaxed, conversational\n3️⃣ **Inspirational** — Motivating, uplifting\n4️⃣ **Humorous** — Funny, witty *(Pro+)*\n5️⃣ **Storytelling** — Narrative, emotional *(Pro+)*\n\n**Free plan:** Tones 1, 2, 3\n**Pro/Business:** All 5 tones",
    quickReplies: ["View pricing plans 💳", "What content types?"],
  };

  if (q.includes("cancel") || q.includes("refund") || q.includes("billing") || q.includes("payment") || q.includes("charge")) return {
    text: "Billing & Cancellation: 💰\n\n**Cancel anytime:**\n→ Dashboard → Billing → Manage Subscription\n→ Access continues until period ends\n\n**Payment:** Secure via **Stripe**\n→ Credit/Debit cards • Monthly billing\n\n**Refunds:** Within 7 days of purchase\n→ Email us with order details\n\nNeed help? Contact our team! 👇",
    quickReplies: ["Contact support 📬", "View pricing plans 💳"],
    hasEmailButton: true,
  };

  if (q.includes("contact") || q.includes("support") || q.includes("human") || q.includes("agent") || q.includes("talk to") || q.includes("email support")) return {
    text: "Here's how to reach us: 📬\n\n**Email Support:**\ncontact@trynaveen.com\n*(Response within 24 hours)*\n\n**Support Hours:**\nMon–Fri, 9am–6pm IST\n\n**Or keep chatting** with me — I'm available 24/7! 🤖\n\nClick below to copy our email 👇",
    quickReplies: ["Billing help", "Report a bug 🐛"],
    hasEmailButton: true,
  };

  if (q.includes("instagram") || q.includes("insta")) return {
    text: "Instagram on Nexcraft: 📸\n\n**Content types:**\n• Caption — Engaging captions with emojis & CTA\n• Reel Hook — Attention-grabbing first lines\n• Bio — Optimized Instagram bio\n• Hashtag Set — Researched relevant hashtags\n\n**Tip:** Hinglish works great for Indian audiences! 🇮🇳",
    quickReplies: ["Other platforms?", "View pricing plans 💳"],
  };

  if (q.includes("twitter") || q.includes("x.com")) return {
    text: "Twitter/X on Nexcraft: 🐦\n\n**Content types:**\n• Tweet — Within 280 chars\n• Thread — Multi-tweet with hooks\n• Reply Hook — Engaging reply starters\n\n**Tip:** Threads get 10x more engagement!\nAI ensures character limits are always respected ✅",
    quickReplies: ["Other platforms?", "View pricing plans 💳"],
  };

  if (q.includes("linkedin")) return {
    text: "LinkedIn on Nexcraft: 💼\n\n**Content types:**\n• Post — Professional thought leadership\n• Carousel Script — Multi-slide text\n• Connection Note — Personalized requests\n\n**Tip:** Posts with stories get 3x engagement!\nAlways include a clear CTA at the end 🎯",
    quickReplies: ["Other platforms?", "View pricing plans 💳"],
  };

  if (q.includes("youtube") || q.includes("shorts")) return {
    text: "YouTube on Nexcraft: 🎬\n\n**Content types:**\n• Video Title — SEO-optimized, click-worthy\n• Description — Full with timestamps\n• Shorts Hook — Attention-grabbing first 3 seconds\n• Community Post — Engaging tab posts\n\n**Tip:** Titles under 60 chars perform best! ✅",
    quickReplies: ["Other platforms?", "View pricing plans 💳"],
  };

  if (q.includes("bug") || q.includes("error") || q.includes("not working") || q.includes("issue") || q.includes("problem") || q.includes("broken") || q.includes("report")) return {
    text: "Sorry to hear you're having issues! 😕\n\n**Quick fixes to try:**\n→ Refresh the page (Ctrl+R / Cmd+R)\n→ Clear your browser cache\n→ Try a different browser\n→ Check your internet connection\n\n**Still not fixed?** Email us with:\n1. What happened\n2. Screenshot of the error\n3. Your browser name\n\nWe'll fix it ASAP! 👇",
    quickReplies: ["Contact support 📬"],
    hasEmailButton: true,
  };

  if (q.includes("thank") || q.includes("thx") || q.includes("appreciate")) return {
    text: "You're welcome! 😊 Happy to help!\n\nAnything else you'd like to know? I'm here 24/7.\n\nHappy creating with Nexcraft! ✨",
    quickReplies: ["How to get started? 🚀", "View pricing plans 💳"],
  };

  if (q.includes("bye") || q.includes("goodbye") || q.includes("see you")) return {
    text: "Bye! 👋 Thanks for chatting with Nexcraft support.\n\nFeel free to come back anytime — just click the chat icon. Have a great day! ✨",
  };

  return {
    text: "I appreciate your question! 🙏\n\nHere's what I can help you with — pick a topic below or type your question:",
    quickReplies: ["How to get started? 🚀", "View pricing plans 💳", "How does AI work? 🤖", "Contact support 📬"],
  };
}


export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    id: "welcome",
    role: "bot",
    text: "Hi there! 👋 I'm **Nexcraft Assistant** — your AI-powered support guide.\n\nHow can I help you today?",
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    quickReplies: ["How to get started? 🚀", "View pricing plans 💳", "How does AI work? 🤖", "Contact support 📬"],
  }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [badge, setBadge] = useState(false);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => { if (!isOpen) setBadge(true); }, 4000);
    return () => clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) { setBadge(false); setTimeout(() => inputRef.current?.focus(), 300); }
  }, [isOpen]);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText("contact@trynaveen.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isRead: false,
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => setMessages(prev => prev.map(m => m.id === userMsg.id ? { ...m, isRead: true } : m)), 900);
    setTimeout(() => {
      const res = getBotResponse(text);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: res.text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        quickReplies: res.quickReplies,
        hasEmailButton: res.hasEmailButton,
      }]);
      setIsTyping(false);
    }, 900 + Math.min(text.length * 12, 1200));
  };

  return (
    <>
      {/* Trigger Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 group"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
          >
            <MessageCircle className="w-6 h-6 text-white" />
            <span className="absolute inset-0.5 rounded-full animate-ping opacity-50" style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }} />
            <span className="absolute -inset-1.5 rounded-full border-2 border-violet-500/30 animate-pulse" />
            <span className="absolute bottom-full right-0 mb-4 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gray-900/95 border border-white/10 shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none backdrop-blur-sm">
              Chat with Nexcraft ✨
              <span className="absolute top-full right-5 border-[10px] border-transparent border-t-gray-900/95" />
            </span>
            <AnimatePresence>
              {badge && (
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#0f0f17]"
                >1</motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="nx-chat-window fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl overflow-hidden bg-background border border-white/[0.07]"
            style={{
              width: "380px",
              maxWidth: "calc(100vw - 1.5rem)",
              height: "min(600px, calc(100vh - 3rem))",
              boxShadow: "0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.1)",
            }}
          >
            {/* Header */}
            <div className="shrink-0 px-4 py-3.5 flex items-center gap-3" style={{ background: "linear-gradient(135deg, #6d28d9 0%, #7c3aed 100%)" }}>
              <div className="relative shrink-0">
                <NxAvatar />
                <span className="absolute w-3 h-3 rounded-full bg-green-400 border-2 border-violet-800 z-10" style={{ bottom: -2, right: -2 }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-none mb-1">Nexcraft Support</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[11px] text-violet-200">Online · Replies instantly</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors shrink-0">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0" style={{ scrollbarWidth: "none" }}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  {/* Bubble */}
                  <div className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${msg.role === "user"
                      ? "rounded-br-sm text-white bg-violet-600/20 border border-violet-500/20"
                      : "rounded-bl-sm text-foreground bg-white/5 border border-white/5"
                    }`}>
                    {msg.role === "bot" ? renderMessage(msg.text) : msg.text}
                  </div>

                  {/* Email button */}
                  {msg.hasEmailButton && msg.role === "bot" && (
                    <motion.a
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                      href="#" onClick={handleCopyEmail}
                      className="mt-2 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-medium transition-all bg-violet-500/15 border border-violet-500/20 text-violet-300 hover:bg-violet-500/25"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      {copied ? <span className="text-green-400">✓ Copied to clipboard!</span> : "contact@trynaveen.com"}
                    </motion.a>
                  )}

                  {/* Quick Replies */}
                  {msg.role === "bot" && msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                      {msg.quickReplies.map((qr) => (
                        <motion.button
                          key={qr}
                          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
                          onClick={() => sendMessage(qr)}
                          disabled={isTyping}
                          className="px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:scale-105 disabled:opacity-50 bg-violet-500/10 border border-violet-500/20 text-violet-300 hover:bg-violet-500/20"
                        >
                          {qr}
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* Time + Read receipt */}
                  <div className={`flex items-center gap-1 mt-1 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    <span className="text-[10px] text-gray-600">{msg.time}</span>
                    {msg.role === "user" && (
                      msg.isRead
                        ? <CheckCheck className="w-3 h-3 text-violet-400" />
                        : <Check className="w-3 h-3 text-gray-600" />
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-start">
                    <div className="px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 bg-white/5 border border-white/5">
                      {[0, 150, 300].map((delay) => (
                        <span key={delay} className="w-2 h-2 rounded-full bg-violet-400" style={{ animation: `bounce 1s ${delay}ms infinite` }} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="shrink-0 px-3 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 h-10 px-4 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-violet-500/40 transition-colors bg-white/5 border border-white/[0.08]"
                />
                <motion.button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all disabled:opacity-30"
                  style={{ background: input.trim() ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "rgba(255,255,255,0.05)" }}
                >
                  <Send className="w-4 h-4 text-white" />
                </motion.button>
              </form>
              <p className="text-[10px] text-muted-foreground/90 text-center mt-2">
                Powered by Nexcraft ·{" "}
                <a
                  href="#"
                  onClick={handleCopyEmail}
                  className="text-[11px] hover:text-violet-300 transition-colors" title="Click to copy">
                  {copied ? <span className="text-green-400 font-medium">Copied to clipboard!</span> : "contact@trynaveen.com"}
                </a>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
        @media (max-width: 640px) {
          .nx-chat-window {
            height: min(440px, calc(100vh - 5rem)) !important;
            right: 5px !important;
          }
        }
      `}</style>
    </>
  );
}
