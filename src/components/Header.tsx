"use client";

import { useState, useEffect } from "react";
import Logo from "./Logo";
import { openHelpModal } from "./HelpModal";

const navItems = [
  { label: "Возможности", href: "#capabilities" },
  { label: "ДТП", href: "#road" },
  { label: "Европротокол", href: "#e-protocol" },
  { label: "Страхование", href: "#insurance" },
  { label: "Консультации", href: "#support" },
  { label: "О нас", href: "#about" },
  { label: "Контакты", href: "#contacts" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(scrollY > 80);
      setProgress(maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = navItems.map((i) => i.href.slice(1));
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-35% 0px -55% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-400"
      style={{
        background: scrolled ? "rgba(6,6,8,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.05)"
          : "1px solid transparent",
      }}
    >
      {/* ── Scroll progress bar ── */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: "rgba(0,0,0,0.3)" }}
      >
        <div
          className="h-full transition-all duration-75"
          style={{
            width: `${progress}%`,
            background: "var(--accent)",
            boxShadow: "0 0 10px var(--accent-glow)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* ── Logo ── */}
          <a
            href="#hero"
            className="group flex items-center"
            aria-label="Е-Спасатель — главная"
          >
            <Logo />
          </a>

          {/* ── Desktop nav ── */}
          <nav className="hidden lg:flex items-center gap-7">
            {navItems.map((item) => {
              const id = item.href.slice(1);
              const isActive = activeSection === id;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="relative text-[10px] font-bold tracking-[0.18em] uppercase transition-colors duration-200"
                  style={{
                    color: isActive
                      ? "var(--accent)"
                      : "rgba(255,255,255,0.45)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLElement).style.color =
                        "rgba(255,255,255,0.85)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLElement).style.color =
                        "rgba(255,255,255,0.45)";
                  }}
                >
                  {item.label}
                  {isActive && (
                    <span
                      className="absolute -bottom-1 left-0 right-0 h-px"
                      style={{
                        background: "var(--accent)",
                        boxShadow: "0 0 8px var(--accent-glow)",
                      }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* ── CTA + Hamburger ── */}
          <div className="flex items-center gap-4">
            <button
              onClick={openHelpModal}
              className="hidden sm:inline-flex btn-primary items-center rounded-none px-5 py-2.5 text-[10px] font-bold tracking-[0.18em] uppercase"
            >
              Получить помощь
            </button>
            <button
              className="lg:hidden flex flex-col gap-1.5 p-1"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Меню"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              <span
                className="block w-5 h-px bg-current transition-all duration-300 origin-center"
                style={{
                  transform: menuOpen
                    ? "rotate(45deg) translateY(5px)"
                    : "none",
                }}
              />
              <span
                className="block w-5 h-px bg-current transition-all duration-200"
                style={{ opacity: menuOpen ? 0 : 1 }}
              />
              <span
                className="block w-5 h-px bg-current transition-all duration-300 origin-center"
                style={{
                  transform: menuOpen
                    ? "rotate(-45deg) translateY(-5px)"
                    : "none",
                }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <div
        className="lg:hidden overflow-hidden transition-all duration-300"
        style={{ maxHeight: menuOpen ? "500px" : "0" }}
      >
        <div
          className="px-6 py-4"
          style={{
            background: "rgba(6,6,8,0.97)",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-[11px] font-bold tracking-[0.18em] uppercase transition-colors duration-200"
              style={{
                color: "rgba(255,255,255,0.5)",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              {item.label}
            </a>
          ))}
          <button
            onClick={() => { setMenuOpen(false); openHelpModal(); }}
            className="btn-primary mt-4 block w-full text-center rounded-none py-3 text-[10px] font-bold tracking-[0.18em] uppercase"
          >
            Получить помощь
          </button>
        </div>
      </div>
    </header>
  );
}
