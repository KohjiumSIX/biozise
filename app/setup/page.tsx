import InnerPageShell from "@/components/layout/InnerPageShell";

const pcSpecs = [
  "MSI A620M-E",
  "AMD Ryzen 7 7800X3D",
  "RTX 4070 Super ",
  "2x16GB XPG 5200MHz CL16",
  "Watercooler Rise Mode 360mm",
  "SSD XPG Gammix S70 Blade",
  "SSD Kingston Fury 1TB",
];

const peripheralSpecs = [
  "MCHOSE ACE 68",
  "Switch Uranus Esport",
  "Corepad Pro Feets",
  "Logitech X2 Superstrike",
  "Artisan FX Zero Soft (Orange)",
  "Pulsar ES branca",
  "HyperX Cloud III",
  "HyperX QuadCast S",
  "Logitech C922",
];

const displaySpecs = [
  "Monitor principal: AOC Hero 310Hz",
  "Monitor secundário: AOC Hero 4K 165Hz",
];

function SpecList({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
      <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-zinc-200">
        {title}
      </h3>

      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-[18px] border border-white/8 bg-black/30 px-4 py-4 text-[15px] text-zinc-200 transition-all duration-300 hover:border-white/12 hover:bg-black/40"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SetupPage() {
  return (
    <InnerPageShell
      eyebrow="Setup"
      title="Meu setup"
      description="Minha base principal de hardware, periféricos e displays."
    >
      <section className="grid gap-4 lg:grid-cols-3">
        <SpecList title="PC" items={pcSpecs} />
        <SpecList title="Periféricos" items={peripheralSpecs} />
        <SpecList title="Displays" items={displaySpecs} />
      </section>
    </InnerPageShell>
  );
}