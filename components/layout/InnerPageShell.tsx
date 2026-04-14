import type { ReactNode } from "react";

type InnerPageShellProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export default function InnerPageShell({
  eyebrow,
  title,
  description,
  children,
}: InnerPageShellProps) {
  return (
    <section className="relative min-h-screen pt-28 pb-10">
      <div className="ambient-orb ambient-orb-1" />
      <div className="ambient-orb ambient-orb-2" />

      <div className="container-custom relative z-10">
        <div className="rounded-[32px] border border-white/10 bg-black/35 p-6 shadow-2xl backdrop-blur-xl md:p-8">
          <div className="mb-6 rounded-[26px] border border-white/10 bg-white/[0.04] p-6">
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