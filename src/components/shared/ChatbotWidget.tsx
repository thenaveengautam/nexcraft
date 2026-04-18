"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Bot, User, Mail, CheckCircle } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  time: string;
  hasEmailButton?: boolean;
}

const QUICK_REPLIES = [
  "How to get started?",
  "What plans do you offer?",
  "How does AI generation work?",
  "I need help with my account",
  "Contact support team",
];

// Comprehensive AI responses
function getBotResponse(input: string): { text: string; hasEmailButton?: boolean } {
  const lower = input.toLowerCase();

  // Greetings
  if (/^(hi|hello|hey|hii|hola|namaste|yo)\b/.test(lower)) {
    return {
      text: "Hey there! 👋 Welcome to Nexcraft support!\n\nI can help you with:\n• Getting started with Nexcraft\n• Plans & pricing info\n• How AI generation works\n• Account & billing issues\n• Templates & features\n• Language support\n• Technical issues\n\nJust ask me anything or tap a quick reply below!",
    };
  }

  // Getting started
  if (lower.includes("started") || lower.includes("start") || lower.includes("begin") || lower.includes("new") || lower.includes("setup") || lower.includes("how to use")) {
    return {
      text: "Getting started is super easy! 🚀\n\n1️⃣ **Sign Up** — Click 'Get Started' on the homepage. Enter name, email, and password.\n2️⃣ **Verify Email** — Enter the 6-digit OTP sent to your email.\n3️⃣ **Open Dashboard** — You'll land on the Generator page.\n4️⃣ **Pick Platform** — Choose Instagram, Twitter/X, LinkedIn, or YouTube.\n5️⃣ **Select Options** — Pick content type, tone, and language.\n6️⃣ **Enter Topic** — Type what you want content about.\n7️⃣ **Hit Generate!** — Watch AI create content in real-time! ✨\n\nYou get 10 free generations/month. No credit card needed!",
    };
  }

  // Plans & pricing
  if (lower.includes("plan") || lower.includes("pricing") || lower.includes("cost") || lower.includes("price") || lower.includes("upgrade") || lower.includes("subscription") || lower.includes("offer")) {
    return {
      text: "Here are our plans: 💳\n\n🆓 **Free** — $0/month\n• 10 generations/month\n• 3 tones (Professional, Casual, Inspirational)\n• All 4 platforms\n• Content history\n\n⚡ **Pro** — $9/month\n• 50 generations/month\n• All 5 tones\n• 20+ pre-built templates\n• Priority AI generation\n• Content export\n\n🏢 **Business** — $29/month\n• Unlimited generations\n• Custom templates\n• Dedicated support\n• Everything in Pro\n\nUpgrade anytime from Dashboard → Billing!",
    };
  }

  // AI generation / how it works
  if (lower.includes("ai") || lower.includes("generat") || lower.includes("how does") || lower.includes("how it work") || lower.includes("behind") || lower.includes("technology")) {
    return {
      text: "Here's how Nexcraft generates content: 🤖\n\n**Technology:** We use Google's Gemini AI — one of the most advanced language models.\n\n**Process:**\n1. You select platform, content type, tone & language\n2. We build an optimized prompt with platform-specific rules\n3. Gemini AI generates tailored content\n4. Content streams to you in real-time (token by token)\n5. Auto-saved to your content library\n\n**What makes it special:**\n• Follows each platform's character limits\n• Understands hashtag strategies\n• SEO-optimized for YouTube\n• Knows engagement patterns\n• Supports Hindi & Hinglish!",
    };
  }

  // Account & login issues
  if (lower.includes("account") || lower.includes("login") || lower.includes("password") || lower.includes("sign in") || lower.includes("sign up") || lower.includes("register") || lower.includes("forgot") || lower.includes("reset") || lower.includes("otp") || lower.includes("verify") || lower.includes("email")) {
    return {
      text: "Here's help with account issues: 🔐\n\n**Can't log in?**\n• Check if you're using the correct email\n• Use 'Forgot Password' to reset\n\n**Forgot password?**\n• Click 'Forgot Password' on login page\n• Enter your email → receive reset link\n• Click link → set new password\n\n**OTP not received?**\n• Check spam/junk folder\n• Wait 60 seconds and click 'Resend OTP'\n• Make sure email is correct\n\n**Email verification?**\n• Check inbox for 6-digit code\n• Enter it on the verification page\n• Code expires in 10 minutes\n\nStill stuck? Email our support team! 👇",
      hasEmailButton: true,
    };
  }

  // Templates
  if (lower.includes("template") || lower.includes("pre-built") || lower.includes("preset")) {
    return {
      text: "All about templates! 📋\n\n**What are templates?**\nPre-configured content generators — one click fills in platform, type, tone, language & topic.\n\n**20+ built-in templates:**\n• 📸 Instagram: Product Launch, Motivational Quote, BTS\n• 🐦 Twitter/X: Thread Starter, Trending Take, Poll\n• 💼 LinkedIn: Thought Leadership, Career Update, Case Study\n• 🎬 YouTube: SEO Title, Description, Shorts Hook\n\n**Who gets what:**\n• Free → No templates\n• Pro ($9/mo) → All 20+ pre-built templates\n• Business ($29/mo) → Create your own custom templates!\n\nAccess templates from the sidebar → Templates page.",
    };
  }

  // Language support
  if (lower.includes("language") || lower.includes("hindi") || lower.includes("hinglish") || lower.includes("english") || lower.includes("bhasha")) {
    return {
      text: "Language support in Nexcraft: 🌍\n\n🇺🇸 **English** — Standard English content\n🇮🇳 **Hindi** — Pure Hindi content (देवनागरी)\n🔀 **Hinglish** — Hindi + English mix\n\n**Hinglish example:**\n\"Yaar, aaj ka din mast hai! Let's talk about...\" 😄\n\n**How to use:**\n1. Go to Generator page\n2. Select your platform & content type\n3. Choose language from the Language dropdown\n4. Generate!\n\nAll languages work across all platforms and tones!",
    };
  }

  // Content types
  if (lower.includes("content type") || lower.includes("what can") || lower.includes("caption") || lower.includes("tweet") || lower.includes("post") || lower.includes("reel") || lower.includes("thread") || lower.includes("bio") || lower.includes("hashtag")) {
    return {
      text: "Content types we support: 📝\n\n**Instagram:**\n• Caption, Reel Hook, Bio, Hashtag Set\n\n**Twitter/X:**\n• Tweet, Thread, Reply Hook\n\n**LinkedIn:**\n• Post, Carousel Script, Connection Note\n\n**YouTube:**\n• Video Title, Description, Shorts Hook, Community Post\n\n**Each type is optimized** for that platform's algorithm, character limits, and engagement best practices!",
    };
  }

  // Tones
  if (lower.includes("tone") || lower.includes("professional") || lower.includes("casual") || lower.includes("humorous") || lower.includes("funny") || lower.includes("inspirational") || lower.includes("storytelling")) {
    return {
      text: "Available tones: 🎨\n\n1️⃣ **Professional** — Corporate, formal, business-like\n2️⃣ **Casual** — Relaxed, conversational, friendly\n3️⃣ **Humorous** — Funny, witty, entertaining (Pro+)\n4️⃣ **Inspirational** — Motivating, uplifting, empowering\n5️⃣ **Storytelling** — Narrative, engaging, emotional (Pro+)\n\n**Free plan:** Professional, Casual, Inspirational\n**Pro/Business:** All 5 tones\n\nTone affects the entire style and word choice of your content!",
    };
  }

  // History / content library
  if (lower.includes("history") || lower.includes("saved") || lower.includes("library") || lower.includes("previous") || lower.includes("old content") || lower.includes("favorite")) {
    return {
      text: "Your Content Library: 📚\n\n**Auto-save:** Every generated content is automatically saved.\n\n**Features:**\n• 🔍 Search by topic or content\n• 🏷️ Filter by platform, tone, language\n• ⭐ Mark favorites for quick access\n• 📋 One-click copy to clipboard\n• 🗑️ Delete content you don't need\n\n**Access:** Dashboard sidebar → History\n\nAll plans include content history — even Free!",
    };
  }

  // Billing & cancellation
  if (lower.includes("cancel") || lower.includes("refund") || lower.includes("billing") || lower.includes("payment") || lower.includes("stripe") || lower.includes("charge")) {
    return {
      text: "Billing & Cancellation: 💰\n\n**Cancel anytime:**\n• Go to Dashboard → Billing\n• Click 'Manage Subscription'\n• Access continues until billing period ends\n\n**Payment:**\n• Secure payments via Stripe\n• Credit/Debit cards accepted\n• Monthly billing, no annual lock-in\n\n**Refunds:**\n• Within 7 days of purchase\n• Email contact@trynaveen.com with order details\n\n**Need billing help?** Contact our team! 👇",
      hasEmailButton: true,
    };
  }

  // Contact / support / human
  if (lower.includes("contact") || lower.includes("support") || lower.includes("human") || lower.includes("agent") || lower.includes("real person") || lower.includes("talk to") || lower.includes("email") || lower.includes("help")) {
    return {
      text: "Here's how to reach us: 📬\n\n**Email Support:**\ncontact@trynaveen.com\n(Response within 24 hours)\n\n**Support Hours:**\nMon-Fri, 9am-6pm IST\n\n**Or use this chatbot** anytime — I'm available 24/7! 🤖\n\nClick below to compose an email directly! 👇",
      hasEmailButton: true,
    };
  }

  // Platform specific
  if (lower.includes("instagram") || lower.includes("insta")) {
    return {
      text: "Instagram on Nexcraft: 📸\n\n**Content types:**\n• Caption — Engaging post captions with emojis & CTA\n• Reel Hook — Attention-grabbing first lines for Reels\n• Bio — Optimized Instagram bio text\n• Hashtag Set — Researched, relevant hashtag groups\n\n**Tips:**\n• Use 'Casual' tone for relatable content\n• Hinglish works great for Indian audiences\n• Generated captions include suggested emojis!",
    };
  }

  if (lower.includes("twitter") || lower.includes("tweet") || lower.includes("x.com")) {
    return {
      text: "Twitter/X on Nexcraft: 🐦\n\n**Content types:**\n• Tweet — Single tweet within 280 chars\n• Thread — Multi-tweet thread with hooks\n• Reply Hook — Engaging reply starters\n\n**Tips:**\n• Threads get 10x more engagement\n• Use 'Humorous' tone for viral potential\n• AI ensures character limits are respected!",
    };
  }

  if (lower.includes("linkedin")) {
    return {
      text: "LinkedIn on Nexcraft: 💼\n\n**Content types:**\n• Post — Professional thought leadership\n• Carousel Script — Multi-slide carousel text\n• Connection Note — Personalized connection requests\n\n**Tips:**\n• 'Professional' or 'Storytelling' tones work best\n• Posts with stories get 3x engagement\n• Include a clear CTA at the end!",
    };
  }

  if (lower.includes("youtube") || lower.includes("video")) {
    return {
      text: "YouTube on Nexcraft: 🎬\n\n**Content types:**\n• Video Title — SEO-optimized, click-worthy titles\n• Description — Full descriptions with timestamps & links\n• Shorts Hook — Attention-grabbing first 3 seconds\n• Community Post — Engaging community tab posts\n\n**Tips:**\n• Titles under 60 chars perform best\n• AI includes relevant keywords automatically\n• Descriptions follow YouTube SEO best practices!",
    };
  }

  // Bug / issue / error
  if (lower.includes("bug") || lower.includes("error") || lower.includes("not working") || lower.includes("issue") || lower.includes("problem") || lower.includes("broken") || lower.includes("crash")) {
    return {
      text: "Sorry to hear you're having issues! 😕\n\n**Quick fixes:**\n• Refresh the page (Ctrl+R)\n• Clear browser cache\n• Try a different browser\n• Check your internet connection\n\n**Common issues:**\n• Generation stuck → Refresh and try again\n• OTP not received → Check spam folder\n• Page not loading → Clear cache\n\n**Still not fixed?** Please email our team with:\n1. What happened\n2. Screenshot of the error\n3. Your browser name\n\nWe'll fix it ASAP! 👇",
      hasEmailButton: true,
    };
  }

  // Thank you
  if (lower.includes("thank") || lower.includes("thanks") || lower.includes("thx") || lower.includes("appreciate")) {
    return {
      text: "You're welcome! 😊 Glad I could help!\n\nIs there anything else you'd like to know? I'm here 24/7!\n\nHappy creating! ✨",
    };
  }

  // Bye
  if (lower.includes("bye") || lower.includes("goodbye") || lower.includes("see you") || lower.includes("later")) {
    return {
      text: "Bye! 👋 Thanks for chatting with Nexcraft support.\n\nRemember, you can always come back by clicking the chat icon. Have a great day! ✨",
    };
  }

  // Default fallback
  return {
    text: "I appreciate your question! 🙏\n\nI can help with:\n• **Getting started** — How to use Nexcraft\n• **Plans & pricing** — Free, Pro, Business details\n• **AI generation** — How content is created\n• **Account issues** — Login, password, OTP\n• **Templates** — Pre-built & custom\n• **Content types** — What you can generate\n• **Languages** — English, Hindi, Hinglish\n• **Billing** — Payments & cancellation\n• **Platform tips** — Instagram, Twitter, LinkedIn, YouTube\n\nOr contact our team directly! 👇",
    hasEmailButton: true,
  };
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      text: "Hi! 👋 I'm Nexcraft Assistant. How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText("contact@trynaveen.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = getBotResponse(text);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: response.text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        hasEmailButton: response.hasEmailButton,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600 + Math.random() * 600);
  };

  return (
    <>
      {/* Chat Button */}
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
            {/* Pulse rings */}
            <span className="absolute inset-0.5 rounded-full animate-ping opacity-50" style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }} />
            <span className="absolute -inset-1.5 rounded-full border-2 border-violet-500/30 animate-pulse" />
            <span className="absolute -inset-3 rounded-full border border-violet-500/0" />
            <span className="absolute bottom-full right-0 mb-4 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gray-900/95 border border-white/10 shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none backdrop-blur-sm">
              Chat with Nexcraft ✨
              <span className="absolute top-full right-5 border-[10px] border-transparent border-t-gray-900/95" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-3rem)] rounded-2xl overflow-hidden shadow-2xl shadow-black/40 flex flex-col"
            style={{
              background: "linear-gradient(180deg, hsl(240 10% 6%) 0%, hsl(240 10% 4%) 100%)",
              border: "1px solid rgba(255,255,255,0.1)",
              height: "min(580px, calc(100vh - 3rem))",
            }}
          >
            {/* Header */}
            <div className="px-4 py-3.5 flex items-center justify-between shrink-0" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.08))" }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold font-heading">Nexcraft Support</h4>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] text-muted-foreground">Online • Replies instantly</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar min-h-0">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    msg.role === "bot"
                      ? "bg-violet-500/15"
                      : "bg-cyan-500/15"
                  }`}>
                    {msg.role === "bot" ? (
                      <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </div>
                  <div className={`max-w-[80%] ${msg.role === "user" ? "text-right" : ""}`}>
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed whitespace-pre-line ${
                        msg.role === "user"
                          ? "bg-violet-600/20 border border-violet-500/20 rounded-tr-md"
                          : "bg-white/5 border border-white/5 rounded-tl-md"
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Email support button */}
                    {msg.hasEmailButton && msg.role === "bot" && (
                      <a
                        href="#"
                        onClick={handleCopyEmail}
                        className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-violet-500/15 border border-violet-500/20 text-violet-300 hover:bg-violet-500/25 transition-colors"
                      >
                        {copied ? <CheckCircle className="w-3 h-3 text-green-400" /> : <Mail className="w-3 h-3" />}
                        {copied ? <span className="text-green-400">Copied!</span> : "Email contact@trynaveen.com"}
                      </a>
                    )}

                    <span className="text-[10px] text-muted-foreground/50 mt-1 inline-block px-1">{msg.time}</span>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2.5"
                >
                  <div className="w-7 h-7 rounded-lg bg-violet-500/15 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-white/5 border border-white/5">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => sendMessage(reply)}
                    className="px-3 py-1.5 rounded-full text-[11px] bg-violet-500/10 border border-violet-500/20 text-violet-300 hover:bg-violet-500/20 transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-3 py-3 border-t border-white/5 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 h-10 px-4 rounded-xl bg-white/5 border border-white/8 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-violet-500/40 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-violet-500/20"
                  style={{ background: input.trim() ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "rgba(255,255,255,0.05)" }}
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
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
    </>
  );
}
