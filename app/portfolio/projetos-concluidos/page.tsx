import InnerPageShell from "@/components/layout/InnerPageShell";

const completedProjects = [
  {
    name: "Valério Veículos",
    description:
      "Site institucional e catálogo digital para revendedora, com foco em credibilidade, apresentação premium e presença online.",
    href: "https://valerioveiculos.com.br",
    image: "/vv.png",
    tag: "Publicado",
  },
];

export default function ProjetosConcluidosPage() {
  return (
    <InnerPageShell
      eyebrow="Portfolio"
      title="Projetos concluídos"
      description="Projetos finalizados e publicados."
      backHref="/portfolio"
      backLabel="Voltar"
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {completedProjects.map((project) => (
          <a
            key={project.name}
            href={project.href}
            target="_blank"
            rel="noreferrer"
            className="ambient-card group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.045] transition hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.07]"
          >
            <div className="aspect-[16/10] w-full overflow-hidden border-b border-white/10 bg-black/40">
              <img
                src={project.image}
                alt={project.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
              />
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-white">
                  {project.name}
                </h2>

                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-emerald-300">
                  {project.tag}
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                {project.description}
              </p>

              <div className="mt-4">
                <span className="text-xs uppercase tracking-[0.18em] text-zinc-500 transition group-hover:text-zinc-300">
                  Abrir projeto
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </InnerPageShell>
  );
}