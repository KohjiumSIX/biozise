"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import MusicIntroModal from "@/components/home/MusicIntroModal";
import SiteMusicController from "@/components/home/SiteMusicController";

export default function HomeClient() {
  const [musicSettings, setMusicSettings] = useState<{
    enabled: boolean;
    volume: number;
  }>({
    enabled: false,
    volume: 1,
  });

  return (
    <>
      <MusicIntroModal onClose={setMusicSettings} />
      <Navbar />
      <main className="min-h-screen">
        <Hero />
      </main>
      <SiteMusicController
        enabledByDefault={musicSettings.enabled}
        defaultVolume={musicSettings.volume}
      />
    </>
  );
}