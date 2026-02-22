"use client";

import { useLiteMode } from "@/context/LiteModeContext";

/* ─────────────────────────────────────────────────────────────────────────
   LiteModeToggle — only the auto-detection banner.
   The interactive badge / toggle is rendered by ConnectionBadge.
───────────────────────────────────────────────────────────────────────── */
export default function LiteModeToggle() {
  const { showBanner, connectionLabel, dismissBanner, disable } = useLiteMode();

  if (!showBanner) return null;

  return (
    <div
      role="alert"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "rgba(6,6,8,0.97)",
        borderBottom: "1px solid var(--accent-border)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div
        className="mx-auto max-w-7xl px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6"
      >
        {/* Icon + text */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="flex-shrink-0 flex items-center justify-center w-8 h-8"
            style={{ border: "1px solid var(--accent-border)" }}
          >
            {/* Signal bars */}
            <svg
              width="16"
              height="13"
              viewBox="0 0 16 13"
              fill="none"
              aria-hidden
            >
              {[3, 6, 9, 12].map((h, i) => (
                <rect
                  key={i}
                  x={i * 4}
                  y={13 - h}
                  width="3"
                  height={h}
                  rx="0.8"
                  fill={i < 2 ? "var(--accent)" : "rgba(255,255,255,0.12)"}
                />
              ))}
            </svg>
          </div>

          <div className="min-w-0">
            <div
              className="text-[9px] font-bold tracking-[0.22em] uppercase mb-0.5"
              style={{ color: "var(--accent)" }}
            >
              Обнаружено медленное соединение
              {connectionLabel && (
                <span className="ml-2 opacity-60">// {connectionLabel}</span>
              )}
            </div>
            <p className="text-xs text-white/60 leading-snug">
              Активирован облегчённый режим — видео и тяжёлые скрипты отключены.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={dismissBanner}
            className="text-[10px] font-bold tracking-[0.16em] uppercase px-4 py-2 transition-colors duration-150"
            style={{
              border: "1px solid var(--accent)",
              color: "var(--accent)",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--accent-dim)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            Понятно
          </button>
          <button
            onClick={disable}
            className="text-[10px] font-bold tracking-[0.16em] uppercase px-4 py-2 transition-colors duration-150"
            style={{
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.4)",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
            }}
          >
            Полная версия
          </button>
        </div>
      </div>

      {/* Decorative accent line */}
      <div
        className="absolute bottom-0 left-0 h-px"
        style={{
          width: "100%",
          background: "linear-gradient(to right, transparent, var(--accent), transparent)",
          opacity: 0.4,
        }}
      />
    </div>
  );
}
