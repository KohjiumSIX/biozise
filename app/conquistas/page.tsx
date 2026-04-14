import InnerPageShell from "@/components/layout/InnerPageShell";

const achievements = [
  {
    title: "Delta Padel",
    game: "Padel",
    prize: "R$ 3.600",
    result: "3ª grade MVP",
    year: "2026",
    highlight: true,
  },
  {
    title: "FPPR",
    game: "Padel",
    prize: "2º lugar",
    result: "Temporada 2026",
    year: "2026",
  },
  {
    title: "Wolfoxy 5x5",
    game: "Valorant",
    prize: "2400 VPs",
    result: "Campeonato 5v5",
    year: "2026",
  },
  {
    title: "Tipspace 5x5",
    game: "League of Legends",
    prize: "R$ 1.514",
    result: "520 LP",
    year: "2026",
  },
];

function AchievementCard({
  title,
  game,
  prize,
  result,
  year,
  highlight = false,
}: {
  title: string;
  game: string;
  prize: string;
  result: string;
  year: string;
  highlight?: boolean;
}) {
  return (
    <article
      className={[
        "group rounded-[28px] border p-5 transition-all duration-300",
        highlight
          ? "border-orange-400/20 bg-[linear-gradient(180deg,rgba(255,170,60,0.08),rgba(255,255,255,0.03))] shadow-[0_0_40px_rgba(255,170,60,0.08)]"
          : "border-white/10 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.05]",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
            {game}
          </p>
          <h3 className="mt-2 text-2xl font-black text-white">{title}</h3>
        </div>

        <span className="rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1 text-xs font-semibold text-orange-300">
          {year}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            Premiação / ganho
          </p>
          <p className="mt-2 text-lg font-bold text-white">{prize}</p>
        </div>

        <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            Resultado
          </p>
          <p className="mt-2 text-lg font-bold text-white">{result}</p>
        </div>
      </div>
    </article>
  );
}

export default function AchievementsPage() {
  return (
    <InnerPageShell
      eyebrow="Conquistas"
      title="Resultados"
      description="Aqui é uma área pessoal onde deixarei alguns dos resultados marcantes pra mim"
    >
      <div className="space-y-6">
        <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-300">
                Progressão real
              </p>

              <h2 className="mt-3 text-3xl font-black leading-tight text-white md:text-4xl">
                Poucas conquistas,
                <br />
                mas com peso real.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400 md:text-base">
                Essa página não é sobre quantidade. É sobre construção. Cada resultado aqui
                representa competição, consistência e evolução em jogos e esportes diferentes —
                e funciona como base e inspiração pra mim mesmo.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                  Registros
                </p>
                <p className="mt-2 text-3xl font-black text-white">4</p>
              </div>

              <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                  Jogos / esportes
                </p>
                <p className="mt-2 text-3xl font-black text-white">3</p>
              </div>

              <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                  Maior prêmio
                </p>
                <p className="mt-2 text-xl font-black text-white">R$ 3.600</p>
              </div>

              <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                  Fase atual
                </p>
                <p className="mt-2 text-xl font-black text-orange-300">Em evolução</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {achievements.map((achievement) => (
            <AchievementCard
              key={`${achievement.title}-${achievement.game}`}
              {...achievement}
            />
          ))}
        </section>

        <section className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
            Nota
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">
            Estou construindo minha trajetória de forma progressiva. Esta seção será atualizada
            conforme novos campeonatos, placements, rankings e premiações marcantes forem acontecendo.
          </p>
        </section>
      </div>
    </InnerPageShell>
  );
}