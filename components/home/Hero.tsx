"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Radio, Disc3, Eye, BarChart3 } from "lucide-react";
import {
  YouTubeIcon,
  TwitchIcon,
  DiscordIcon,
  TikTokIcon,
} from "@/components/ui/SocialIcons";
import ProfileIntroExtras from "@/components/profile/ProfileIntroExtras";

type Media = {
  title: string;
  url: string;
  publishedAt: string;
  thumbnail: string | null;
  platform: "YouTube" | "TikTok";
};

type TwitchLive = {
  live: boolean;
  platform: "Twitch";
  title: string | null;
  viewerCount: number | null;
  startedAt: string | null;
  thumbnail: string | null;
  url: string;
};

type DiscordPresence = {
  status: string;
  avatar: string;
};

type ProfileStats = {
  uniqueViews: number;
  siteViews: number;
  socialTotal: number;
  grandTotal: number;
};

type SpotifyNowPlaying = {
  source: "currently_playing" | "recently_played";
  isPlaying: boolean;
  title: string;
  artists: string;
  album: string | null;
  albumImage: string | null;
  progressMs: number;
  durationMs: number;
  url: string | null;
  playedAt: string | null;
};

type ActivityRow = {
  name: string;
  status: string;
  description: string;
  accent: string;
  href?: string | null;
};

const PROFILE_SLUG = "need";

const profileLinks = {
  youtube: "https://www.youtube.com/@NeedFB",
  twitch: "https://www.twitch.tv/neednz",
  discord: "https://discord.com/users/1025068709859045468",
  tiktok: "https://www.tiktok.com/@needmvp",
};

const mainLinks = [
  {
    name: "YouTube",
    href: profileLinks.youtube,
    external: true,
    icon: YouTubeIcon,
    color: "text-red-400 group-hover:text-red-200",
    glow: "from-red-500/22 via-red-400/8 to-transparent",
  },
  {
    name: "Twitch",
    href: profileLinks.twitch,
    external: true,
    icon: TwitchIcon,
    color: "text-purple-400 group-hover:text-purple-200",
    glow: "from-violet-500/22 via-purple-400/8 to-transparent",
  },
  {
    name: "Discord",
    href: profileLinks.discord,
    external: true,
    icon: DiscordIcon,
    color: "text-indigo-200 group-hover:text-white",
    glow: "from-indigo-500/14 via-indigo-300/6 to-transparent",
  },
  {
    name: "TikTok",
    href: profileLinks.tiktok,
    external: true,
    icon: TikTokIcon,
    color: "text-cyan-300 group-hover:text-pink-200",
    glow: "from-cyan-400/18 via-pink-400/8 to-transparent",
  },
];

function timeAgoFromDate(dateString: string) {
  const then = new Date(dateString).getTime();
  const now = Date.now();
  const diffMs = now - then;

  if (!Number.isFinite(then) || diffMs < 0) return "recente";

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;

  if (diffMs < hour) {
    const minutes = Math.max(1, Math.floor(diffMs / minute));
    return `há ${minutes} min`;
  }

  if (diffMs < day) {
    const hours = Math.floor(diffMs / hour);
    return `há ${hours}h`;
  }

  if (diffMs < week) {
    const days = Math.floor(diffMs / day);
    return `há ${days} dia${days > 1 ? "s" : ""}`;
  }

  if (diffMs < month) {
    const weeks = Math.floor(diffMs / week);
    return `há ${weeks} semana${weeks > 1 ? "s" : ""}`;
  }

  const months = Math.floor(diffMs / month);
  return `há ${months} mês${months > 1 ? "es" : ""}`;
}

function getDiscordStatus(status?: string) {
  switch (status) {
    case "online":
      return {
        label: "online",
        description: "Online",
        color: "text-emerald-400",
      };
    case "idle":
      return {
        label: "ausente",
        description: "Ausente",
        color: "text-yellow-400",
      };
    case "dnd":
      return {
        label: "ocupado",
        description: "Ocupado",
        color: "text-red-400",
      };
    default:
      return {
        label: "offline",
        description: "Offline",
        color: "text-zinc-400",
      };
  }
}

function formatNumber(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("pt-BR").format(value);
}

function formatTime(ms?: number | null) {
  if (!ms || ms <= 0) return "0:00";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  const [media, setMedia] = useState<Media | null>(null);
  const [mediaLoading, setMediaLoading] = useState(true);

  const [twitchLive, setTwitchLive] = useState<TwitchLive | null>(null);
  const [twitchLoading, setTwitchLoading] = useState(true);

  const [discord, setDiscord] = useState<DiscordPresence | null>(null);

  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [spotify, setSpotify] = useState<SpotifyNowPlaying | null>(null);
  const [spotifyProgressMs, setSpotifyProgressMs] = useState(0);
  const [spotifyLoading, setSpotifyLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadLatestMedia() {
      try {
        setMediaLoading(true);

        const response = await fetch("/api/youtube/latest", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch latest media");
        }

        const data: Media = await response.json();

        if (!cancelled) {
          setMedia(data);
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setMedia(null);
        }
      } finally {
        if (!cancelled) {
          setMediaLoading(false);
        }
      }
    }

    loadLatestMedia();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadTwitchLive() {
      try {
        setTwitchLoading(true);

        const response = await fetch("/api/twitch/live", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch Twitch live status");
        }

        const data: TwitchLive = await response.json();

        if (!cancelled) {
          setTwitchLive(data);
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setTwitchLive(null);
        }
      } finally {
        if (!cancelled) {
          setTwitchLoading(false);
        }
      }
    }

    loadTwitchLive();

    const interval = setInterval(loadTwitchLive, 60_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadDiscord() {
      try {
        const response = await fetch("/api/discord", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch Discord data");
        }

        const data: DiscordPresence = await response.json();

        if (!cancelled) {
          setDiscord(data);
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setDiscord(null);
        }
      }
    }

    loadDiscord();

    const interval = setInterval(loadDiscord, 30_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadSpotify() {
      try {
        setSpotifyLoading(true);

        const response = await fetch("/api/spotify/now-playing", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch Spotify data");
        }

        const data: SpotifyNowPlaying = await response.json();

        if (!cancelled) {
          setSpotify(data);
          setSpotifyProgressMs(data.progressMs ?? 0);
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setSpotify(null);
          setSpotifyProgressMs(0);
        }
      } finally {
        if (!cancelled) {
          setSpotifyLoading(false);
        }
      }
    }

    loadSpotify();

    const interval = setInterval(loadSpotify, 15_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!spotify) return;

    if (!spotify.isPlaying) {
      setSpotifyProgressMs(spotify.progressMs ?? 0);
      return;
    }

    const interval = setInterval(() => {
      setSpotifyProgressMs((current) => {
        const next = current + 1000;
        const duration = spotify.durationMs ?? 0;

        if (duration > 0) {
          return Math.min(next, duration);
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [spotify]);

  useEffect(() => {
    let cancelled = false;

    async function loadProfileStats() {
      try {
        const response = await fetch(
          `/api/profile-stats?profileSlug=${encodeURIComponent(PROFILE_SLUG)}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile stats");
        }

        const raw = await response.json();

        const data: ProfileStats = {
          uniqueViews:
            typeof raw?.uniqueViews === "number" ? raw.uniqueViews : 0,
          siteViews: typeof raw?.siteViews === "number" ? raw.siteViews : 0,
          socialTotal:
            typeof raw?.socialTotal === "number" ? raw.socialTotal : 0,
          grandTotal:
            typeof raw?.grandTotal === "number" ? raw.grandTotal : 0,
        };

        if (!cancelled) {
          setStats(data);
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setStats({
            uniqueViews: 0,
            siteViews: 0,
            socialTotal: 0,
            grandTotal: 0,
          });
        }
      } finally {
        if (!cancelled) {
          setStatsLoading(false);
        }
      }
    }

    async function registerProfileView() {
      const sessionKey = `profile-view-registered:${PROFILE_SLUG}`;

      try {
        if (
          typeof window !== "undefined" &&
          sessionStorage.getItem(sessionKey)
        ) {
          await loadProfileStats();
          return;
        }

        const response = await fetch("/api/profile-view", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            profileSlug: PROFILE_SLUG,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to register profile view");
        }

        if (typeof window !== "undefined") {
          sessionStorage.setItem(sessionKey, "1");
        }
      } catch (error) {
        console.error(error);
      } finally {
        await loadProfileStats();
      }
    }

    registerProfileView();

    return () => {
      cancelled = true;
    };
  }, []);

  const activityRows = useMemo<ActivityRow[]>(() => {
    const discordStatus = getDiscordStatus(discord?.status);

    const streamingRow: ActivityRow = {
      name: "Streaming",
      status: twitchLoading ? "..." : twitchLive?.live ? "online" : "offline",
      description: twitchLoading
        ? "Carregando"
        : twitchLive?.live
          ? "Twitch • Ao vivo"
          : "Offline",
      accent: twitchLive?.live ? "text-emerald-400" : "text-zinc-400",
      href: twitchLive?.url ?? null,
    };

    const mediaRow: ActivityRow = {
      name: "Mídia",
      status: mediaLoading
        ? "..."
        : media
          ? media.platform.toLowerCase()
          : "offline",
      description: mediaLoading
        ? "Carregando"
        : media
          ? `${media.platform} • ${timeAgoFromDate(media.publishedAt)}`
          : "Offline",
      accent:
        media?.platform === "YouTube"
          ? "text-red-400"
          : media?.platform === "TikTok"
            ? "text-cyan-300"
            : "text-zinc-400",
      href: media?.url ?? null,
    };

    const discordRow: ActivityRow = {
      name: "Discord",
      status: discordStatus.label,
      description: discordStatus.description,
      accent: discordStatus.color,
      href: profileLinks.discord,
    };

    return [streamingRow, mediaRow, discordRow];
  }, [media, mediaLoading, twitchLive, twitchLoading, discord]);

  const spotifyProgress = useMemo(() => {
    if (!spotify?.durationMs || spotify.durationMs <= 0) return 0;

    const value = Math.min(
      100,
      Math.max(0, (spotifyProgressMs / spotify.durationMs) * 100)
    );

    return Number.isFinite(value) ? value : 0;
  }, [spotify?.durationMs, spotifyProgressMs]);

  return (
    <section
      className={`relative flex min-h-screen items-start pt-1 ${
        mounted ? "page-enter-ready" : "page-enter"
      }`}
      id="home"
    >
      <div className="ambient-orb ambient-orb-1" />
      <div className="ambient-orb ambient-orb-2" />

      <div className="container-custom relative z-10">
        <div className="hero-shell rounded-[32px] p-6 shadow-2xl">
          <div className="grid items-start gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="grid grid-cols-[112px_minmax(0,1fr)] gap-x-5 gap-y-4">
              <div className="hero-logo-wrap h-28 w-28 rounded-[28px]">
                <div className="hero-logo-core h-full w-full overflow-hidden rounded-[28px] bg-black">
                  {discord?.avatar ? (
                    <img
                      src={discord.avatar}
                      alt="Discord avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-[linear-gradient(135deg,rgba(225,29,72,0.72),rgba(212,175,55,0.30))]" />
                  )}
                </div>
              </div>

              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
                  Profile
                </p>

                <h1 className="mt-1 text-3xl font-black text-white">NEED</h1>

                <p className="mt-1 text-[15px] font-medium text-zinc-200">
                  Matheus Felipe Valério
                </p>

                <p className="mt-1 text-sm text-zinc-400">19 anos • Brasil</p>

                <p className="mt-1 text-sm text-zinc-500">
                  Player • Builder • Creator
                </p>
              </div>

              <div className="col-span-2 flex flex-wrap gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
                  <p className="text-xs text-zinc-500">Status</p>
                  <p className="text-sm font-semibold text-emerald-300">
                    Online
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
                  <p className="text-xs text-zinc-500">Focus</p>
                  <p className="text-sm font-semibold text-white">Growth</p>
                </div>

                <div className="rounded-2xl border border-orange-400/20 bg-orange-400/10 px-4 py-2">
                  <p className="text-xs text-orange-200/70">Atleta</p>
                  <p className="text-sm font-semibold text-orange-300">
                    Aprovado pela FCP
                  </p>
                </div>
              </div>

              <div className="col-span-2 space-y-3">
                <p className="max-w-[560px] text-[15px] leading-7 text-zinc-200">
Caso tenha interesse em algum projeto ou serviço, entre em contato pela plataforma de sua preferência sendo claro e objetivo sobre a sua demanda.
                </p>
<div className="w-full flex justify-center">
<a
  href="https://mail.google.com/mail/?view=cm&fs=1&to=kohjium@protonmail.com&su=Contato%20via%20site&body=Olá,%20vim%20pelo%20seu%20site..."
  target="_blank"
  className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-5 py-2 text-xs font-medium uppercase tracking-[0.18em] text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.1] hover:text-white">
                  Contato Profissional
                </a>
              </div>
            </div>
            </div>

            <div className="grid auto-rows-min items-start gap-5 md:grid-cols-2">
              <div className="ambient-card rounded-[24px] border border-white/10 bg-white/5 p-3">
                <div className="flex items-center gap-2 text-zinc-400">
                  <span className="stat-icon-glow stat-icon-live">
                    <Radio size={14} />
                  </span>
                  <span className="text-xs uppercase tracking-[0.2em]">
                    Activity
                  </span>
                </div>

                <div className="mt-3 space-y-1.5">
                  {activityRows.map((platform) => {
                    const inner = (
                      <div className="flex items-start justify-between gap-4 text-sm">
                        <div className="min-w-0">
                          <span className="text-white">{platform.name}</span>
                          <p className="text-[11px] capitalize text-zinc-400">
                            {platform.description}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 text-xs font-medium ${platform.accent}`}
                        >
                          {platform.status}
                        </span>
                      </div>
                    );

                    const baseClassName = "block rounded-xl px-2 py-1";

                    return platform.href ? (
                      <a
                        key={platform.name}
                        href={platform.href}
                        target="_blank"
                        rel="noreferrer"
                        className={`${baseClassName} transition-colors hover:bg-white/[0.04]`}
                      >
                        {inner}
                      </a>
                    ) : (
                      <div key={platform.name} className={baseClassName}>
                        {inner}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="ambient-card rounded-[24px] border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3 text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span className="stat-icon-glow stat-icon-spotify">
                      <Disc3 size={14} />
                    </span>
                    <span className="text-xs uppercase tracking-[0.2em]">
                      {spotify?.isPlaying ? "Now Playing" : "Last Played"}
                    </span>
                  </div>

                  <a
                    href={spotify?.url ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] uppercase tracking-[0.16em] text-zinc-500 transition hover:text-zinc-300"
                  >
                    Open
                  </a>
                </div>

                <div className="mt-3 flex gap-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                    {spotify?.albumImage ? (
                      <img
                        src={spotify.albumImage}
                        alt={spotify.album ?? spotify.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-600">
                        <Disc3 size={18} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">
                      {spotifyLoading
                        ? "Carregando..."
                        : spotify?.title ?? "Sem dados"}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-zinc-400">
                      {spotifyLoading
                        ? "Spotify"
                        : spotify?.artists ?? "Nada recente"}
                    </p>

                    <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                      {spotifyLoading
                        ? "syncing"
                        : spotify?.isPlaying
                          ? "listening now"
                          : spotify?.playedAt
                            ? timeAgoFromDate(spotify.playedAt)
                            : "offline"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-rose-500 transition-[width] duration-700 ease-out"
                      style={{
                        width: `${spotifyLoading ? 22 : spotifyProgress}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>{formatTime(spotifyProgressMs)}</span>
                  <span>{formatTime(spotify?.durationMs)}</span>
                </div>

                <div className="mt-0 flex justify-center">
                  <a
                    href={spotify?.url ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.1] hover:text-white"
                  >
                    Ouvir essa música
                  </a>
                </div>
              </div>

              <div className="ambient-card rounded-[24px] border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-zinc-400">
                  <span className="stat-icon-glow stat-icon-views">
                    <Eye size={14} />
                  </span>
                  <span className="text-xs uppercase tracking-[0.2em]">
                    Views
                  </span>
                </div>

                <p className="mt-3 text-2xl font-black text-white">
                  {statsLoading ? "..." : formatNumber(stats?.uniqueViews)}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  Visitantes únicos
                </p>
              </div>

              <Link
                href="/total"
                className="ambient-card group rounded-[24px] border border-white/10 bg-white/5 p-4 transition hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.07]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <span className="stat-icon-glow stat-icon-total">
                      <BarChart3 size={14} />
                    </span>
                    <span className="text-xs uppercase tracking-[0.2em]">
                      Total
                    </span>
                  </div>

                  <span className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 transition group-hover:text-zinc-300">
                    Abrir
                  </span>
                </div>

                <p className="mt-3 text-2xl font-black text-white">
                  {statsLoading ? "..." : formatNumber(stats?.grandTotal)}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  Redes + views do site
                </p>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {mainLinks.map((item) => {
            const Icon = item.icon;

            const card = (
              <>
                <div
                  className={`main-link-glow absolute inset-0 bg-gradient-to-br ${item.glow}`}
                />

                <div className="relative flex min-h-[112px] flex-col justify-between">
                  <div className="flex justify-between">
                    <div className="main-link-icon flex h-11 w-11 items-center justify-center rounded-2xl bg-black/60">
                      <Icon className={item.color} />
                    </div>

                    <span className="text-[11px] text-zinc-400">OPEN</span>
                  </div>

                  <div>
                    <p className="text-lg text-white">{item.name}</p>
                    <p className="text-sm text-zinc-400">
                      {item.name === "Discord"
                        ? "Abrir privado"
                        : "Acessar perfil"}
                    </p>
                  </div>
                </div>
              </>
            );

            if (item.external) {
              return (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="main-link-card ambient-card group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.045] px-5 py-4"
                >
                  {card}
                </a>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className="main-link-card ambient-card group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.045] px-5 py-4"
              >
                {card}
              </Link>
            );
          })}
        </div>

        <ProfileIntroExtras />
      </div>
    </section>
  );
}