"use client";

import Link from "next/link";

const games = [
  {
    name: "Valorant",
    subtitle: "Highlights, config e perfil",
    video: "/games/valorant.mp4",
    href: "/jogos/valorant",
    theme: "game-card-red",
  },
  {
    name: "LoL",
    subtitle: "Highlights, config e perfil",
    video: "/games/lol.mp4",
    href: "/jogos/lol",
    theme: "game-card-gold",
  },
];

export default function ProfileIntroExtras() {
  return (
    <section className="mt-6 pb-10">
      <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-400">
            Jogos recentes
          </p>

          <span className="text-[11px] text-zinc-500">02</span>
        </div>

        <div className="flex flex-wrap gap-4">
          {games.map((game) => (
            <Link
              key={game.name}
              href={game.href}
              className={`game-card-shell ${game.theme} group relative block h-[260px] w-[190px] shrink-0 overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03]`}
            >
              <div className="game-card-glow-ring absolute -inset-[2px] rounded-[26px]" />
              <div className="game-card-glow-fill absolute inset-0 rounded-[24px]" />

              <div className="game-card-video-wrap absolute inset-0">
                <video
                  src={game.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="media-card-media absolute inset-0 h-full w-full object-cover"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
              <div className="media-card-overlay absolute inset-0 bg-black/0" />

              <div className="media-card-center absolute inset-0 z-20 flex items-center justify-center">
                <div className="flex items-center justify-center rounded-full border border-white/15 bg-black/55 px-5 py-2 text-sm font-medium leading-none text-white backdrop-blur-md">
                  Abrir página
                </div>
              </div>

              <div className="media-card-content relative z-10 flex h-full flex-col justify-between p-4">
                <div className="flex items-start justify-between">
                  <div className="rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/70 backdrop-blur-sm">
                    Game
                  </div>

                  <span className="text-[10px] uppercase tracking-[0.22em] text-white/55">
                    Enter
                  </span>
                </div>

                <div>
                  <p className="text-2xl font-bold text-white">{game.name}</p>
                  <p className="mt-1 text-sm text-white/75">{game.subtitle}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}