import type { ReactNode } from "react";
import Link from "next/link";

type InnerPageShellProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  backHref?: string;
  backLabel?: string;
};

export default function InnerPageShell({
  eyebrow,
  title,
  description,
  children,
  backHref,
  backLabel = "Voltar",
}: InnerPageShellProps) {
  return (
    <section className="relative min-h-screen pt-28 pb-10">
      <div className="ambient-orb ambient-orb-1" />
      <div className="ambient-orb ambient-orb-2" />

      <div className="container-custom relative z-10">
        <div className="rounded-[32px] border border-white/10 bg-black/35 p-6 shadow-2xl backdrop-blur-xl md:p-8">
          <div className="mb-6 rounded-[26px] border border-white/10 bg-white/[0.04] p-6">
            {backHref ? (
              <Link
                href={backHref}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
              >
                <span aria-hidden="true">←</span>
                {backLabel}
              </Link>
            ) : null}

            <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-400">
              {eyebrow}
            </p>

            <h1 className="mt-3 text-3xl font-black text-white md:text-4xl">
              {title}
            </h1>

            {description ? (
              <p className="mt-3 max-w-[720px] text-sm leading-7 text-zinc-300 md:text-[15px]">
                {description}
              </p>
            ) : null}
          </div>

          {children}
        </div>
      </div>
    </section>
  );
}