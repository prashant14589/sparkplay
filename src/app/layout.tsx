import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import { Analytics } from "@vercel/analytics/next";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SparkPlay — Games kids actually love",
  description: "Create personalised games for your kids — memory match, mazes, puzzles and more. No coding needed.",
  openGraph: {
    title: "SparkPlay — Games kids actually love",
    description: "Create personalised games for your kids in minutes.",
    siteName: "SparkPlay",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-nunito)]">
        {children}
        <CookieBanner />
        <Analytics />
      </body>
    </html>
  );
}
