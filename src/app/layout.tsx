// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/header";
import { AuthProvider } from "@/hooks/use-auth";
import { Footer } from "@/components/footer";
import { Alegreya, Belleza } from "next/font/google";

export const metadata: Metadata = {
  title: "TechnoTrac",
  description: "Rent farming equipment in India",
};

// ✅ Load fonts via next/font
const alegreya = Alegreya({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-alegreya",
});

const belleza = Belleza({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-belleza",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${alegreya.variable} ${belleza.variable} font-body antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
