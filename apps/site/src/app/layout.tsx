import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AmbientBackground } from "@/components/ui/AmbientBackground";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Architecture-As-Memory (AAM) | Persistent Architectural Cognition",
  description: "Real-time architectural memory and boundaries for AI-native software teams and agentic coding assistants.",
  icons: {
    icon: "/AAMLogo.png",
    shortcut: "/AAMLogo.png",
    apple: "/AAMLogo.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col relative bg-brand-bg text-white selection:bg-brand-ember/20 selection:text-brand-ember-light">
        {/* 1. Global Ambient Visual Backdrop */}
        <AmbientBackground />
        
        {/* 2. Global Sticky Header Navigation */}
        <Navbar />
        
        {/* 3. Main Page Contents */}
        <main className="flex-grow relative z-10 w-full">
          {children}
        </main>
        
        {/* 4. Global Footer Shell */}
        <Footer />
      </body>
    </html>
  );
}
