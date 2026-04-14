"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Sobre", href: "/sobre" },
  { label: "Setup", href: "/setup" },
  { label: "Portfólio", href: "/portfolio" },
  { label: "Conquistas", href: "/conquistas" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100] px-4 pt-3 md:px-6">
        <div className="mx-auto max-w-[1240px]">
          <div className="navbar-shell soft-float rounded-[28px] border border-white/10 bg-black/55 px-5 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            <div className="grid grid-cols-[auto_1fr] items-center gap-6">
              <Link href="/" className="group flex items-center">
                <span className="need-logo text-[22px] font-black leading-none tracking-[0.34em]">
                  NEED
                </span>
              </Link>

              <nav className="hidden items-center justify-center gap-8 lg:flex xl:gap-10">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={[
                        "nav-link-smooth text-sm transition",
                        isActive
                          ? "text-white"
                          : "text-zinc-200 hover:text-white",
                      ].join(" ")}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </header>

      <div className="h-[96px] md:h-[104px]" />

      <style jsx>{`
        .need-logo {
          position: relative;
          display: inline-block;
          color: #ffffff;
          background-image: linear-gradient(
            135deg,
            #ffffff 0%,
            #ffffff 30%,
            #ff2a55 42%,
            #ff3b66 50%,
            #ff5c7d 58%,
            #ffffff 70%,
            #ffffff 100%
          );
          background-size: 240% 240%;
          background-position: 160% 160%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: needDiagonalSweep 3.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          text-shadow:
            0 0 0 rgba(255, 255, 255, 0),
            0 0 10px rgba(255, 42, 85, 0),
            0 0 22px rgba(255, 42, 85, 0);
          transition: transform 220ms ease;
        }

        .group:hover .need-logo {
          transform: translateY(-1px);
        }

        @keyframes needDiagonalSweep {
          0% {
            background-position: 160% 160%;
            text-shadow:
              0 0 0 rgba(255, 255, 255, 0),
              0 0 10px rgba(255, 42, 85, 0),
              0 0 22px rgba(255, 42, 85, 0);
          }

          18% {
            background-position: 160% 160%;
            text-shadow:
              0 0 0 rgba(255, 255, 255, 0),
              0 0 10px rgba(255, 42, 85, 0),
              0 0 22px rgba(255, 42, 85, 0);
          }

          45% {
            background-position: 52% 52%;
            text-shadow:
              0 0 6px rgba(255, 72, 112, 0.35),
              0 0 14px rgba(255, 42, 85, 0.35),
              0 0 28px rgba(255, 42, 85, 0.18);
          }

          58% {
            background-position: 28% 28%;
            text-shadow:
              0 0 8px rgba(255, 72, 112, 0.45),
              0 0 18px rgba(255, 42, 85, 0.4),
              0 0 34px rgba(255, 42, 85, 0.22);
          }

          76% {
            background-position: -20% -20%;
            text-shadow:
              0 0 3px rgba(255, 72, 112, 0.18),
              0 0 10px rgba(255, 42, 85, 0.18),
              0 0 18px rgba(255, 42, 85, 0.08);
          }

          100% {
            background-position: -40% -40%;
            text-shadow:
              0 0 0 rgba(255, 255, 255, 0),
              0 0 10px rgba(255, 42, 85, 0),
              0 0 22px rgba(255, 42, 85, 0);
          }
        }
      `}</style>
    </>
  );
}