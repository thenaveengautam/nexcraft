import { cn } from "@/lib/utils"
import { Sora, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/components/providers/AuthProvider";
import ChatbotWidget from "@/components/shared/ChatbotWidget";
import type { Metadata } from "next";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Nexcraft - Craft Content That Glows",
  description: "AI-powered social media content generator for Instagram, Twitter/X, LinkedIn & YouTube. Generate viral content in seconds.",
  keywords: ["AI content generator", "social media", "content creation", "Instagram", "Twitter", "LinkedIn", "YouTube"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          sora.variable,
          jakarta.variable,
          "font-body antialiased min-h-screen bg-background text-foreground"
        )}
      >
        <AuthProvider>
          {children}
          <Toaster />
          <ChatbotWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
