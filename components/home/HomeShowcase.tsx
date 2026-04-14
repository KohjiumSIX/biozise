"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Disc3,
  Radio,
  Eye,
  BarChart3,
  PlayCircle,
  Gamepad2,
  MessageCircle,
  FolderKanban,
} from "lucide-react";

const livePlatforms = [
  { name: "Twitch", status: "offline" },
  { name: "YouTube", status: "offline" },
  { name: "Discord", status: "online" },
];

const socialLinks = [
  {
    name: "YouTube",
    href: "#",
    icon: PlayCircle,
    description: "Vídeos e highlights",
  },
  {
    name: "Twitch",
    href: "#",
    icon: Gamepad2,
    description: "Lives e gameplay",
  },
  {
    name: "Discord",
    href: "#",
    icon: MessageCircle,
    description: "Comunidade e contato",
  },
  {
    name: "Projetos",
    href: "#",
    icon: FolderKanban,
    description: "Portfólio e projetos",
  },
];

export default function HomeShowcase() {
  return (
    <section className="relative pb-24">
      <div className="container-custom">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
            className="glass rounded-[28px] p-6 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-rose-500/15 p-3 text-rose-300">
                <Radio size={18} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
                  Live Status
                </p>
                <h2 className="mt-1 text-xl font-bold text-white">
                  Presença em tempo real
                </h2>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {livePlatforms.map((platform) => {
                const online = platform.status === "online";

                return (
                  <div
                    key={platform.name}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          online ? "bg-emerald-400" : "bg-zinc-500"
                        }`}
                      />
                      <span className="font-medium text-white">
                        {platform.name}
                      </span>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                        online
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-zinc-500/15 text-zinc-300"
                      }`}
                    >
                      {platform.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="glass rounded-[28px] p-6 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-amber-400/15 p-3 text-amber-300">
                <Disc3 size={18} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
                  Spotify
                </p>
                <h2 className="mt-1 text-xl font-bold text-white">
                  Now Playing
                </h2>
              </div>
            </div>

            <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-2xl bg-[linear-gradient(135deg,rgba(225,29,72,0.35),rgba(212,175,55,0.18))]" />

                <div className="min-w-0 flex-1">
                  <p className="text-sm text-zinc-400">Tocando agora</p>
                  <h3 className="truncate text-lg font-bold text-white">
                    Song Name Placeholder
                  </h3>
                  <p className="truncate text-sm text-zinc-300">
                    Artist Name Placeholder
                  </p>

                  <div className="mt-4">
                    <div className="h-2 w-full rounded-full bg-white/10">
                      <div className="h-2 w-[38%] rounded-full bg-rose-500" />
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-zinc-400">
                      <span>1:08</span>
                      <span>3:21</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-zinc-400">
              Depois vamos conectar isso com a API do Spotify para mostrar a
              música atual ou a última música ouvida de verdade.
            </p>
          </motion.div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
            className="glass rounded-[28px] p-6 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white/10 p-3 text-white">
                <BarChart3 size={18} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
                  Stats
                </p>
                <h2 className="mt-1 text-xl font-bold text-white">
                  Visão geral da presença
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Eye size={16} />
                  <span className="text-sm">Views do perfil</span>
                </div>
                <p className="mt-3 text-3xl font-black text-white">12,481</p>
              </div>

              <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-zinc-400">
                  <BarChart3 size={16} />
                  <span className="text-sm">Plataformas totais</span>
                </div>
                <p className="mt-3 text-3xl font-black text-white">48,290</p>
              </div>

              <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Radio size={16} />
                  <span className="text-sm">Vendo agora</span>
                </div>
                <p className="mt-3 text-3xl font-black text-white">14</p>
              </div>

              <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Disc3 size={16} />
                  <span className="text-sm">Sessão atual</span>
                </div>
                <p className="mt-3 text-3xl font-black text-white">Focus</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="glass rounded-[28px] p-6 shadow-xl"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
              Main Links
            </p>
            <h2 className="mt-1 text-xl font-bold text-white">
              Seus acessos principais
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {socialLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group rounded-[24px] border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-rose-500/30 hover:bg-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <div className="rounded-2xl bg-white/10 p-3 text-white transition group-hover:bg-rose-500/15 group-hover:text-rose-300">
                        <Icon size={18} />
                      </div>

                      <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 transition group-hover:text-zinc-300">
                        Open
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-white">
                      {item.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      {item.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}