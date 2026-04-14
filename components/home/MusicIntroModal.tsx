"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

type MusicIntroModalProps = {
  onClose: (settings: {
    enabled: boolean;
    volume: number;
  }) => void;
};

export default function MusicIntroModal({
  onClose,
}: MusicIntroModalProps) {
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const alreadySeen = window.localStorage.getItem("music-intro-seen");

    if (!alreadySeen) {
      setOpen(true);
      return;
    }

    const savedEnabled = window.localStorage.getItem("site-music-enabled");
    const savedVolume = window.localStorage.getItem("site-music-volume");

    onClose({
      enabled: savedEnabled === "true",
      volume: savedVolume ? Number(savedVolume) : 1,
    });
  }, [onClose]);

  const handleEnter = () => {
    window.localStorage.setItem("music-intro-seen", "true");
    window.localStorage.setItem("site-music-enabled", String(enabled));
    window.localStorage.setItem("site-music-volume", String(volume));

    setOpen(false);
    onClose({ enabled, volume });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28 }}
            className="glass w-full max-w-xl rounded-[28px] p-6 shadow-2xl sm:p-8"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-rose-300">
              Ambient Sound
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Ativar a trilha sonora do site?
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-300 sm:text-base">
              Para uma experiência mais imersiva, você pode ativar a música de
              fundo do site. O volume começa bem baixo para evitar qualquer
              impacto desagradável no áudio.
            </p>

            <div className="mt-8 rounded-[22px] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Música ambiente
                  </p>
                  <p className="mt-1 text-xs text-zinc-400">
                    Ative apenas se quiser uma experiência mais vibes.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setEnabled((prev) => !prev)}
                  className={`relative inline-flex h-8 w-16 items-center rounded-full transition ${
                    enabled ? "bg-rose-600" : "bg-white/10"
                  }`}
                  aria-label="Alternar música ambiente"
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                      enabled ? "translate-x-9" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-300">
                    {enabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    <span className="text-sm">Volume inicial</span>
                  </div>

                  <span className="text-sm font-semibold text-white">
                    {volume}%
                  </span>
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
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleEnter}
                className="rounded-full bg-rose-600 px-6 py-3 font-semibold text-white transition hover:bg-rose-500"
              >
                Entrar no site
              </button>

              <button
                type="button"
                onClick={() => {
                  setEnabled(false);
                  setVolume(1);
                }}
                className="rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Deixar sem música
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}