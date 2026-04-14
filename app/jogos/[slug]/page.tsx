import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Play,
  Settings2,
  Monitor,
} from "lucide-react";
import { getGameBySlug, gamesData } from "@/lib/games";
import CopyButton from "@/components/games/CopyButton";

type GamePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return Object.keys(gamesData).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: GamePageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    return {
      title: "Jogo não encontrado",
    };
  }

  return {
    title: `${game.title} | NEED`,
    description: game.description,
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  return (
    <main className="page-micro-enter relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(225,29,72,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(212,175,55,0.08),transparent_25%)]" />

      <div className="container-custom relative z-10 py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
          >
            <ArrowLeft size={16} />
            Voltar para home
          </Link>
        </div>

        <section
          className={`relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-6 md:p-8 ${game.accentClass}`}
        >
          <div className="game-page-ambient absolute inset-0" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-zinc-400">
                {game.heroCaptionEyebrow ?? game.eyebrow}
              </p>

              <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
                {game.title}
              </h1>

              <p className="mt-4 max-w-[680px] text-[15px] leading-7 text-zinc-300">
                {game.description}
              </p>

              {game.heroBadge ? (
                <div className="mt-5 inline-flex items-center rounded-full border border-[#d4af37]/25 bg-[#d4af37]/10 px-4 py-2 text-sm font-semibold text-[#f4d67a] backdrop-blur-sm">
                  {game.heroBadge}
                </div>
              ) : null}

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {game.stats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[22px] border border-white/10 bg-black/25 px-4 py-4 backdrop-blur-sm"
                  >
                    <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/30">
              <video
                src={game.heroVideo}
                autoPlay
                loop
                muted
                playsInline
                className="h-full min-h-[320px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/5" />

              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-zinc-300">
                    {game.heroCaptionEyebrow ?? "Página do jogo"}
                  </p>
                  <p className="mt-1 text-xl font-bold text-white">
                    {game.heroCaptionTitle ?? "Highlights, configs e setup"}
                  </p>
                </div>

                <div className="rounded-full border border-white/15 bg-black/45 p-3 text-white backdrop-blur-md">
                  <Play size={18} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white">
                <Play size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                  {game.contentSectionEyebrow ?? "Conteúdo"}
                </p>
                <h2 className="mt-1 text-2xl font-bold text-white">
                  {game.contentSectionTitle ?? "Highlights e sessões"}
                </h2>
              </div>
            </div>

            <div className="grid gap-4">
              {game.highlights.map((item) =>
                item.videoUrl ? (
                  <div
                    key={item.title}
                    className="overflow-hidden rounded-[26px] border border-white/10 bg-black/25 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-black">
                      {item.poster ? (
                        <img
                          src={item.poster}
                          alt={item.title}
                          className="pointer-events-none absolute inset-0 h-full w-full scale-[1.03] object-cover blur-[2px] opacity-25"
                        />
                      ) : null}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

                      <iframe
                        className="relative z-10 h-full w-full"
                        src={item.videoUrl}
                        title={item.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>

                    <div className="border-t border-white/10 p-5">
                      <h3 className="text-lg font-semibold text-white">
                        {item.title}
                      </h3>
                      {item.description ? (
                        <p className="mt-2 text-sm leading-6 text-zinc-300">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div
                    key={item.title}
                    className="rounded-[24px] border border-white/10 bg-black/20 p-5"
                  >
                    <h3 className="text-lg font-semibold text-white">
                      {item.title}
                    </h3>
                    {item.description ? (
                      <p className="mt-2 text-sm leading-6 text-zinc-300">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                )
              )}

              {game.rankShowcase ? (
                <div className="overflow-hidden rounded-[26px] border border-white/10 bg-[#07090d] shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                  <div className="border-b border-white/8 bg-white/[0.02] px-5 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-300">
                      Current Rating
                    </p>
                  </div>

                  <div className="bg-[linear-gradient(180deg,rgba(20,28,38,0.92),rgba(12,17,24,0.96))] px-5 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                        <img
                          src={game.rankShowcase.current.icon}
                          alt={game.rankShowcase.current.title}
                          className="h-10 w-10 object-contain"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[15px] font-semibold leading-none text-zinc-200">
                          {game.rankShowcase.current.title}
                        </p>

                        <div className="mt-1 flex items-baseline gap-1.5">
                          <span className="text-[30px] font-black leading-none text-[#f4c96b]">
                            {game.rankShowcase.current.rr}
                          </span>
                        </div>

                        <p className="mt-1 text-xs font-medium text-zinc-500">
                          {game.rankShowcase.current.placement}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/8 bg-[#09111a] px-5 py-4">
                    <p className="text-[13px] font-medium text-zinc-300">
                      Peak Rating
                    </p>

                    <div className="mt-3 flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                        <img
                          src={game.rankShowcase.peak.icon}
                          alt={game.rankShowcase.peak.title}
                          className="h-10 w-10 object-contain"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="text-[16px] font-bold leading-none text-white">
                            {game.rankShowcase.peak.title}
                          </span>

                          <span className="text-[28px] font-black leading-none text-[#f4c96b]">
                            {game.rankShowcase.peak.rr}
                          </span>
                        </div>

                        <p className="mt-1 text-xs font-medium text-zinc-500">
                          {game.rankShowcase.peak.act}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white">
                  <Settings2 size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                    Setup
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-white">
                    Configurações
                  </h2>
                </div>
              </div>

              <div className="grid gap-3">
                {game.config.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-3 rounded-[20px] border border-white/10 bg-black/20 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                        {item.label}
                      </p>
                      <p className="mt-1 truncate text-sm font-medium text-white">
                        {item.value}
                      </p>
                    </div>

                    {item.type === "copy" ? (
                      <CopyButton value={item.copyValue} />
                    ) : item.type === "link" ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                      >
                        Abrir
                        <ExternalLink size={14} />
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            {game.links.length > 0 ? (
              <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white">
                    <Monitor size={18} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                      {game.linksSectionEyebrow ?? "Links"}
                    </p>
                    <h2 className="mt-1 text-2xl font-bold text-white">
                      {game.linksSectionTitle ?? "Acessos"}
                    </h2>
                  </div>
                </div>

                <div className="grid gap-3">
                  {game.links.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between rounded-[20px] border border-white/10 bg-black/20 px-4 py-4 transition hover:border-white/20 hover:bg-black/30"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {item.label}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                          Abrir link externo
                        </p>
                      </div>

                      <div className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-zinc-300 transition group-hover:border-white/20 group-hover:bg-white/[0.08] group-hover:text-white">
                        <ExternalLink size={16} />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}