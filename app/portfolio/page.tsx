import Link from "next/link";
import InnerPageShell from "@/components/layout/InnerPageShell";

type PortfolioItem = {
  title: string;
  description: string;
  status: string;
  statusClass: string;
  href?: string;
  donateHref?: string;
  external?: boolean;
};

const portfolioItems: PortfolioItem[] = [
  {
    title: "Projetos concluídos",
    description:
      "Lista de projetos já finalizados, publicados e entregues.",
    status: "Concluído",
    statusClass:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    href: "/portfolio/projetos-concluidos",
  },
  {
    title: "FairplayAC",
    description:
      "Anticheat kernel mode para servidores e jogos terceirizados.",
    status: "Em desenvolvimento",
    statusClass:
      "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",
    donateHref: "https://livepix.gg/neednz",
  },
  {
    title: "ProAcademy",
    description:
      "Projeto em andamento focado em evolução, performance e estrutura.",
    status: "Em andamento",
    statusClass:
      "border-orange-400/20 bg-orange-400/10 text-orange-300",
    donateHref: "https://livepix.gg/neednz",
  },
];

function CardShell({
  item,
  children,
}: {
  item: PortfolioItem;
  children: React.ReactNode;
}) {
  return (
    <div className="ambient-card group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.045] px-5 py-4 transition hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.07]">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent opacity-80" />

      <div className="relative flex min-h-[190px] flex-col justify-between">
        <div className="flex items-center justify-between gap-3">
          <span
            className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] ${item.statusClass}`}
          >
            {item.status}
          </span>

          {item.href ? (
            <span className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 transition group-hover:text-zinc-300">
              Abrir
            </span>
          ) : null}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white">{item.title}</h3>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            {item.description}
          </p>
        </div>

        <div className="mt-5 flex items-center gap-3">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <InnerPageShell
      eyebrow="Portfolio"
      title="Projetos e construção"
      description="Projetos, ideias e trabalhos que fazem parte da minha evolução."
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {portfolioItems.map((item) => {
          const actions = (
            <>
              {item.href ? (
                <Link
                  href={item.href}
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.1] hover:text-white"
                >
                  Ver projeto
                </Link>
              ) : null}

              {item.donateHref ? (
                <a
                  href={item.donateHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-orange-300 transition hover:border-orange-300/30 hover:bg-orange-400/15 hover:text-orange-200"
                >
                  Doação
                </a>
              ) : null}
            </>
          );

          if (item.href) {
            return (
              <CardShell key={item.title} item={item}>
                {actions}
              </CardShell>
            );
          }

          return (
            <CardShell key={item.title} item={item}>
              {actions}
            </CardShell>
          );
        })}
      </div>
    </InnerPageShell>
  );
}