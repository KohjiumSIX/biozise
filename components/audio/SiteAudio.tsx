"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";

type Track = {
  title: string;
  artist: string;
  src: string;
};

const tracks: Track[] = [
  {
    title: "Silence",
    artist: "Marshmello, Bastille",
    src: "/audio/silence.mp3",
  },
  {
    title: "Artista Genérico",
    artist: "Veigh",
    src: "/audio/artistagenerico.mp3",
  },
  {
    title: "The Search - Edit",
    artist: "NF",
    src: "/audio/thesearch.mp3",
  },
  {
    title: "Darkside",
    artist: "Neoni",
    src: "/audio/darkside.mp3",
  },
];

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

export default function SiteAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const frameRef = useRef<number | null>(null);

  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [volume, setVolume] = useState(2);
  const [lastVolume, setLastVolume] = useState(18);

  const currentTrack = useMemo(() => tracks[trackIndex], [trackIndex]);

  const normalizedVolume = useMemo(() => {
    return Math.min(Math.max(volume / 100, 0), 1);
  }, [volume]);

  const setBeatGlow = (value: number) => {
    document.documentElement.style.setProperty(
      "--beat-glow",
      value.toFixed(4)
    );
  };

  const stopBeatLoop = () => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    setBeatGlow(0);
  };

  const ensureAudioAnalyzer = async () => {
    const audio = audioRef.current;
    if (!audio) return null;

    try {
      if (!audioContextRef.current) {
        const AudioCtor =
          window.AudioContext ||
          (window as Window & {
            webkitAudioContext?: typeof AudioContext;
          }).webkitAudioContext;

        if (!AudioCtor) return null;

        const ctx = new AudioCtor();
        const analyser = ctx.createAnalyser();
        const gainNode = ctx.createGain();

        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.38;

        const source = ctx.createMediaElementSource(audio);

        source.connect(analyser);
        analyser.connect(gainNode);
        gainNode.connect(ctx.destination);

        gainNode.gain.value = normalizedVolume;

        audioContextRef.current = ctx;
        analyserRef.current = analyser;
        sourceRef.current = source;
        gainNodeRef.current = gainNode;

        audio.volume = 1;
        audio.muted = false;
      }

      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }

      return analyserRef.current;
    } catch (error) {
      console.error("Erro ao iniciar analyser:", error);
      return null;
    }
  };

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = normalizedVolume;
    }
  }, [normalizedVolume]);

  const startBeatLoop = async () => {
    const analyser = await ensureAudioAnalyzer();
    if (!analyser) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    stopBeatLoop();

    let lastWeightedBass = 0;
    let energy = 0;

    const avgRange = (start: number, end: number) => {
      let sum = 0;
      let count = 0;

      for (let i = start; i <= end; i += 1) {
        sum += dataArray[i] ?? 0;
        count += 1;
      }

      return count > 0 ? sum / count : 0;
    };

    const loop = () => {
      analyser.getByteFrequencyData(dataArray);

      // Grave real / subgrave
      const subBass = avgRange(1, 5);
      const bass = avgRange(6, 12);

      // Região da voz / presença
      const lowMid = avgRange(13, 24);
      const mids = avgRange(25, 48);

      // Dá mais peso ao grave e reduz influência da voz
      const weightedBassRaw = subBass * 1.25 + bass * 1.0 - lowMid * 0.55 - mids * 0.2;
      const weightedBass = Math.max(0, weightedBassRaw);

      const weightedBassNorm = clamp(weightedBass / 190);
      const impact = Math.max(0, weightedBass - lastWeightedBass);
      const impactNorm = clamp(impact / 42);

      lastWeightedBass = weightedBass;

      // Só dispara forte quando o grave realmente entra
      let target = 0;

      if (impactNorm > 0.16 || weightedBassNorm > 0.22) {
        const body = Math.pow(weightedBassNorm, 1.18);
        const attack = Math.pow(impactNorm, 0.9);

        target = clamp(body * 0.62 + attack * 0.95);
      }

      // Ataque rápido, queda rápida quando não tem grave
      if (target > energy) {
        energy = target;
      } else {
        if (weightedBassNorm < 0.06) {
          energy *= 0.52;
        } else if (weightedBassNorm < 0.11) {
          energy *= 0.66;
        } else if (weightedBassNorm < 0.18) {
          energy *= 0.78;
        } else {
          energy *= 0.9;
        }
      }

      // Limpa resíduos pequenos para sumir de verdade
      if (energy < 0.012) {
        energy = 0;
      }

      // Curva final para abrir bem mais diferença entre fala e kick
      const finalGlow = clamp(Math.pow(energy, 0.82));

      setBeatGlow(finalGlow);

      frameRef.current = requestAnimationFrame(loop);
    };

    loop();
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const tryPlay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
        setAutoplayBlocked(false);
      } catch {
        setIsPlaying(false);
        setAutoplayBlocked(true);
      }
    };

    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    stopBeatLoop();
    void tryPlay();
  }, [trackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      stopBeatLoop();
      setTrackIndex((prev) => (prev + 1) % tracks.length);
    };

    const handleTimeUpdate = () => {
      const current = audio.currentTime || 0;
      const total = audio.duration || 0;

      setCurrentTime(current);
      setDuration(total);
      setProgress(total > 0 ? (current / total) * 100 : 0);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      void startBeatLoop();
    };

    const handlePause = () => {
      setIsPlaying(false);
      stopBeatLoop();
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      stopBeatLoop();
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
        setAutoplayBlocked(false);
      } catch {
        setIsPlaying(false);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
      stopBeatLoop();
    }
  };

  const goPrev = () => {
    setTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const goNext = () => {
    setTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const toggleMute = () => {
    if (volume <= 0) {
      setVolume(lastVolume > 0 ? lastVolume : 2);
      return;
    }

    setLastVolume(volume);
    setVolume(0);
  };

  return (
    <div className="fixed bottom-[clamp(60px,8vh,100px)] right-4 z-[70]">
      <audio ref={audioRef} src={currentTrack.src} preload="auto" loop={false} />

      <div className="group w-[290px] rounded-[22px] border border-white/10 bg-black/50 px-4 py-3 backdrop-blur-xl shadow-[0_14px_40px_rgba(0,0,0,0.35)] transition duration-300 hover:bg-black/70 hover:shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-500">
              Tocando
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-white">
              {currentTrack.title}
            </p>
            <p className="truncate text-xs text-zinc-400">
              {currentTrack.artist}
            </p>
          </div>

          <div className="flex items-center gap-1 opacity-85 transition group-hover:opacity-100">
            <button
              type="button"
              onClick={goPrev}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-200 transition hover:bg-white/10"
            >
              <SkipBack size={14} />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition hover:bg-white/15"
            >
              {isPlaying ? (
                <Pause size={14} />
              ) : (
                <Play size={14} className="ml-[1px]" />
              )}
            </button>

            <button
              type="button"
              onClick={goNext}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-200 transition hover:bg-white/10"
            >
              <SkipForward size={14} />
            </button>
          </div>
        </div>

        <div className="mt-3">
          <div className="h-[5px] w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[#ff0050] transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-1 flex items-center justify-between text-[11px] text-zinc-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMute}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-200 transition hover:bg-white/10"
              >
                {volume <= 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>

              <span className="text-sm text-zinc-300">Volume</span>
            </div>

            <span className="text-sm font-semibold text-white">{volume}%</span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Controle de volume"
            className="music-volume-slider"
          />
        </div>

        {autoplayBlocked ? (
          <p className="mt-2 text-[11px] text-zinc-500">
            Clique em play para iniciar.
          </p>
        ) : null}
      </div>
    </div>
  );
}