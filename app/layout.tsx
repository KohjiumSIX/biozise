import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import SiteAudio from "@/components/audio/SiteAudio";
import PageTransition from "@/components/ui/PageTransition";

export const metadata: Metadata = {
  title: "NEED",
  description: "Profile, highlights, configs e conteúdo.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="home-ambient">
        <Navbar />
        <PageTransition>{children}</PageTransition>
        <SiteAudio />
      </body>
    </html>
  );
}