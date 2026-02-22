"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("e-saver-cookie-consent");
    if (!consent) {
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = (all: boolean) => {
    localStorage.setItem(
      "e-saver-cookie-consent",
      JSON.stringify({ all, date: new Date().toISOString() })
    );
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[999]"
      style={{
        background: "rgba(6,6,8,0.97)",
        borderTop: "1px solid rgba(0,232,124,0.2)",
        backdropFilter: "blur(16px)",
        animation: "slideUpBanner 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
      }}
    >
      {/* Accent line */}
      <div
        className="h-px w-full"
        style={{
          background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
          opacity: 0.7,
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Icon */}
          <div
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center"
            style={{
              border: "1px solid rgba(0,232,124,0.3)",
              background: "rgba(0,232,124,0.07)",
              color: "var(--accent)",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"/>
              <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/>
            </svg>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-white tracking-wide">Мы используем файлы cookie</span>
              <span className="hud-label text-[8px]" style={{ opacity: 0.5 }}>152-ФЗ</span>
            </div>
            <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
              Для корректной работы сайта и персонализации сервисов мы используем файлы cookie.{" "}
              <Link href="/cookies" className="underline" style={{ color: "rgba(0,232,124,0.7)" }}>
                Политика cookies
              </Link>
              {" · "}
              <Link href="/privacy" className="underline" style={{ color: "rgba(0,232,124,0.7)" }}>
                Политика конфиденциальности
              </Link>
            </p>

            {expanded && (
              <div className="mt-3 grid sm:grid-cols-3 gap-2">
                {[
                  { name: "Необходимые", desc: "Обеспечивают базовую функциональность сайта", locked: true },
                  { name: "Аналитические", desc: "Помогают понять как посетители используют сайт", locked: false },
                  { name: "Функциональные", desc: "Запоминают ваши предпочтения и настройки", locked: false },
                ].map((cat) => (
                  <div
                    key={cat.name}
                    className="flex items-start gap-2 p-2"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div
                      className="flex-shrink-0 w-4 h-4 mt-0.5 flex items-center justify-center"
                      style={{
                        border: `1px solid ${cat.locked ? "rgba(0,232,124,0.4)" : "rgba(255,255,255,0.2)"}`,
                        background: cat.locked ? "rgba(0,232,124,0.15)" : "transparent",
                      }}
                    >
                      {cat.locked && (
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" style={{ color: "var(--accent)" }}>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-white">{cat.name}</div>
                      <div className="text-[9px] leading-tight" style={{ color: "rgba(255,255,255,0.35)" }}>{cat.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setExpanded(!expanded)}
              className="px-3 py-2 text-[10px] font-bold tracking-[0.14em] uppercase transition-all duration-200"
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.4)",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)";
                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)";
              }}
            >
              {expanded ? "Скрыть" : "Настройки"}
            </button>
            <button
              onClick={() => accept(false)}
              className="btn-neon px-4 py-2 text-[10px] font-bold tracking-[0.14em] uppercase"
            >
              Только необходимые
            </button>
            <button
              onClick={() => accept(true)}
              className="btn-primary px-5 py-2 text-[10px] font-bold tracking-[0.14em] uppercase"
            >
              Принять все
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUpBanner {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
