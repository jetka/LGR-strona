import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "LGR - Limanowska Grupa Rowerowa",
  description: "Limanowska Grupa Rowerowa to coś więcej niż klub. To społeczność zjednoczona przez pasję do dwóch kółek i miłość do naszych gór.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main className="pt-24 min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
