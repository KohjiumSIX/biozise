"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";

type SiteMusicControllerProps = {
  enabledByDefault?: boolean;
  defaultVolume?: number;
};

type Track = {
  title: string;
  src: string;
};

const playlist: Track[] = [
  { title: "Silence - Marshmello, Bastille", src: "/audio/track-01.mp3" },
  { title: "Track 02", src: "/audio/track-02.mp3" },
  { title: "Track 03", src: "/audio/track-03.mp3" },
  { title: "Track 04", src: "/audio/track-04.mp3" },
  { title: "Track 05", src: "/audio/track-05.mp3" },
  { title: "Track 06", src: "/audio/track-06.mp3" },
  { title: "Track 07", src: "/audio/track-07.mp3" },
  { title: "Track 08", src: "/audio/track-08.mp3" },
  { title: "Track 09", src: "/audio/track-09.mp3" },
  { title: "Track 10", src: "/audio/track-10.mp3" },
];

export default function SiteMusicController({
  enabledByDefault = false,
  defaultVolume = 1,
}: SiteMusicControllerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [enabled, setEnabled] = useState(enabledByDefault);
  const [volume, setVolume] = useState(defaultVolume);
  const [mounted, setMounted] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  const normalizedVolume = useMemo(() => {
    return Math.min(Math.max(volume / 100, 0.01), 1);
  }, [volume]);

  const currentTrack = playlist[trackIndex];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = normalizedVolume;
  }, [normalizedVolume]);

  useEffect(() => {
    if (!mounted) return;

    const savedEnabled = window.localStorage.getItem("site-music-enabled");
    const savedVolume = window.localStorage.getItem("site-music-volume");
    const savedTrackIndex = window.localStorage.getItem("site-music-track-index");

    if (savedEnabled !== null) {
      setEnabled(savedEnabled === "true");
    }

    if (savedVolume !== null) {
      setVolume(Number(savedVolume));
    }

    if (savedTrackIndex !== null) {
      const parsed = Number(savedTrackIndex);
      if (!Number.isNaN(parsed) && parsed >= 0 && parsed < playlist.length) {
        setTrackIndex(parsed);
      }
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted || !audioRef.current) return;

    audioRef.current.load();

    if (enabled) {
      audioRef.current
        .play()
        .catch(() => {
          setEnabled(false);
        });
    }
  }, [trackIndex, enabled, mounted]);

  useEffect(() => {
    if (!mounted || !audioRef.current) return;

    if (enabled) {
      audioRef.current
        .play()
        .catch(() => {
          setEnabled(false);
        });
    } else {
      audioRef.current.pause();
    }

    window.localStorage.setItem("site-music-enabled", String(enabled));
  }, [enabled, mounted]);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem("site-music-volume", String(volume));
  }, [volume, mounted]);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem("site-music-track-index", String(trackIndex));
  }, [trackIndex, mounted]);

  const goToNextTrack = () => {
    setTrackIndex((prev) => (prev + 1) % playlist.length);
  };

  const goToPreviousTrack = () => {
    setTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  if (!mounted) return null;

  return (
    <>
      <audio ref={audioRef} preload="auto" onEnded={goToNextTrack}>
        <source src={currentTrack.src} type="audio/mpeg" />
      </audio>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="glass fixed bottom-5 right-5 z-[90] w-[290px] rounded-[24px] p-4 shadow-2xl"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
              Site Audio
            </p>
            <p className="mt-1 text-sm font-semibold text-white">
              Música ambiente
            </p>
          </div>

          <button
            type="button"
            onClick={() => setEnabled((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
            aria-label="Alternar música ambiente"
          >
            {enabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Tocando
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-white">
            {currentTrack.title}
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            Faixa {trackIndex + 1} de {playlist.length}
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={goToPreviousTrack}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
            aria-label="Faixa anterior"
          >
            <SkipBack size={16} />
          </button>

          <button
            type="button"
            onClick={goToNextTrack}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
            aria-label="Próxima faixa"
          >
            <SkipForward size={16} />
          </button>

          <div className="ml-auto text-xs text-zinc-500">
            Playlist ativa
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-zinc-300">Volume</span>
            <span className="text-sm font-semibold text-white">{volume}%</span>
          </div>

          <input
            type="range"
            min={1}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-rose-500"
          />
        </div>
      </motion.div>
    </>
  );
}