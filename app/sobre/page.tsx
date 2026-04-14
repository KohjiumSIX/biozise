import InnerPageShell from "@/components/layout/InnerPageShell";

export default function SobrePage() {
  return (
    <InnerPageShell
      eyebrow="Sobre"
      title="Quem sou"
      description="Uma visão mais completa sobre meu perfil, foco atual e o que estou construindo."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-lg font-semibold text-white">Perfil</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-300">
Sou um full-stack creator movido por performance, competição e evolução constante.
Focado em construir presença digital, criar conteúdo e desenvolver projetos de alto nível.
Este espaço centraliza meu perfil, jogos, setup, redes e tudo que estou construindo.
          </p>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-lg font-semibold text-white">Informações</h2>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">
              <span className="text-sm text-zinc-400">Nome</span>
              <span className="text-sm font-semibold text-white">
                Matheus Felipe Valério
              </span>
            </div>

            <div className="flex items-center justify-between rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">
              <span className="text-sm text-zinc-400">País</span>
              <span className="text-sm font-semibold text-white">Brasil</span>
            </div>
            <div className="flex items-center justify-between rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">
  <span className="text-sm text-zinc-400">Nascimento</span>
  <span className="text-sm font-semibold text-white">
    04/04/2007
  </span>
</div>

            <div className="flex items-center justify-between rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">
              <span className="text-sm text-zinc-400">Foco</span>
              <span className="text-sm font-semibold text-white">
                Growth • Content • Performance
              </span>
            </div>
          </div>
        </div>
      </div>
    </InnerPageShell>
  );
}