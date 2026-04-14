"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Eye,
  Users,
  PlayCircle,
  Radio,
  Music4,
  ArrowUpRight,
} from "lucide-react";
import InnerPageShell from "@/components/layout/InnerPageShell";

type ProfileStatsResponse = {
  uniqueViews: number;
  siteViews: number;
  socialTotal: number;
  grandTotal: number;
  socialBreakdown?: {
    tiktokViews: number;
    tiktokFollowers: number;
    twitchViews: number;
    twitchFollowers: number;
    discordMembers: number;
    youtubeViews: number;
    youtubeSubscribers: number;
  };
};

type BreakdownCard = {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
};

const PROFILE_SLUG = "need";

function formatNumber(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("pt-BR").format(value);
}

export default function TotalPage() {
  const [stats, setStats] = useState<ProfileStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/profile-stats?profileSlug=${encodeURIComponent(PROFILE_SLUG)}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile stats");
        }

        const data: ProfileStatsResponse = await response.json();

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
            socialBreakdown: {
              tiktokViews: 0,
              tiktokFollowers: 0,
              twitchViews: 0,
              twitchFollowers: 0,
              discordMembers: 0,
              youtubeViews: 0,
              youtubeSubscribers: 0,
            },
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadStats();

    return () => {
      cancelled = true;
    };
  }, []);

  const cards = useMemo<BreakdownCard[]>(() => {
    const breakdown = stats?.socialBreakdown;

    return [
      {
        title: "TikTok Views",
        value: breakdown?.tiktokViews ?? 0,
        description: "Visualizações manuais do TikTok",
        icon: <Music4 size={18} />,
      },
      {
        title: "TikTok Followers",
        value: breakdown?.tiktokFollowers ?? 0,
        description: "Seguidores manuais do TikTok",
        icon: <Users size={18} />,
      },
      {
        title: "Twitch Views",
        value: breakdown?.twitchViews ?? 0,
        description: "Visualizações manuais da Twitch",
        icon: <PlayCircle size={18} />,
      },
      {
        title: "Twitch Followers",
        value: breakdown?.twitchFollowers ?? 0,
        description: "Seguidores manuais da Twitch",
        icon: <Users size={18} />,
      },
      {
        title: "Discord Members",
        value: breakdown?.discordMembers ?? 0,
        description: "Membros da comunidade no Discord",
        icon: <Users size={18} />,
      },
      {
        title: "YouTube Views",
        value: breakdown?.youtubeViews ?? 0,
        description: "Visualizações manuais do YouTube",
        icon: <PlayCircle size={18} />,
      },
      {
        title: "YouTube Subscribers",
        value: breakdown?.youtubeSubscribers ?? 0,
        description: "Inscritos manuais do YouTube",
        icon: <Users size={18} />,
      },
      {
        title: "Site Views",
        value: stats?.siteViews ?? 0,
        description: "Visualizações acumuladas do site",
        icon: <Eye size={18} />,
      },
    ];
  }, [stats]);

  return (
    <InnerPageShell
      eyebrow="Total Breakdown"
      title="De onde vêm os números"
      description="Aqui fica a composição do total geral exibido na home, somando redes sociais preenchidas manualmente na Supabase com as visualizações do site."
    >
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 md:p-6">
          <div className="flex items-center gap-2 text-zinc-400">
            <BarChart3 size={16} />
            <span className="text-xs uppercase tracking-[0.22em]">
              Resumo geral
            </span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[22px] border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                Total Geral
              </p>
              <p className="mt-3 text-3xl font-black text-white">
                {loading ? "..." : formatNumber(stats?.grandTotal)}
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                Redes sociais + views do site
              </p>
            </div>

            <div className="rounded-[22px] border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                Social Total
              </p>
              <p className="mt-3 text-3xl font-black text-white">
                {loading ? "..." : formatNumber(stats?.socialTotal)}
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                Soma manual das plataformas
              </p>
            </div>

            <div className="rounded-[22px] border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                Site Views
              </p>
              <p className="mt-3 text-3xl font-black text-white">
                {loading ? "..." : formatNumber(stats?.siteViews)}
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                Visualizações acumuladas do site
              </p>
            </div>

            <div className="rounded-[22px] border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                Unique Views
              </p>
              <p className="mt-3 text-3xl font-black text-white">
                {loading ? "..." : formatNumber(stats?.uniqueViews)}
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                Visitantes únicos do site
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 md:p-6">
          <div className="flex items-center gap-2 text-zinc-400">
            <ArrowUpRight size={16} />
            <span className="text-xs uppercase tracking-[0.22em]">
              Fórmula
            </span>
          </div>

          <div className="mt-5 space-y-4">
            <div className="rounded-[22px] border border-white/10 bg-black/30 p-4">
              <p className="text-sm text-zinc-300">
                <span className="font-semibold text-white">Total Geral</span> =
                {" "}
                <span className="text-rose-300">Social Total</span> +{" "}
                <span className="text-amber-300">Site Views</span>
              </p>
            </div>

            <div className="rounded-[22px] border border-white/10 bg-black/30 p-4">
              <p className="text-sm leading-7 text-zinc-400">
                Os números das redes são preenchidos manualmente na Supabase.
                Já as views do site continuam sendo contadas automaticamente.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-5 md:p-6">
        <div className="flex items-center gap-2 text-zinc-400">
          <Radio size={16} />
          <span className="text-xs uppercase tracking-[0.22em]">
            Plataformas
          </span>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-[22px] border border-white/10 bg-black/30 p-4"
            >
              <div className="flex items-center gap-2 text-zinc-400">
                {card.icon}
                <span className="text-xs uppercase tracking-[0.16em]">
                  {card.title}
                </span>
              </div>

              <p className="mt-3 text-2xl font-black text-white">
                {loading ? "..." : formatNumber(card.value)}
              </p>

              <p className="mt-1 text-sm text-zinc-500">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </InnerPageShell>
  );
}