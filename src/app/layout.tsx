import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/layout/theme-provider";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DZ Ecom OS",
  description: "E-commerce operating system for Algerian merchants",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" className={`${geistSans.variable} ${geistMono.variable} h-full dark`} suppressHydrationWarning>
      <body className="min-h-full bg-background text-foreground antialiased">
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
