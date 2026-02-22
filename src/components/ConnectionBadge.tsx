"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLiteMode } from "@/context/LiteModeContext";

/* ─── Signal bars ───────────────────────────────────────────────────────── */
function SignalBars({ filled, total = 4 }: { filled: number; total?: number }) {
  return (
    <svg width="15" height="13" viewBox="0 0 15 13" fill="none" aria-hidden style={{ flexShrink: 0 }}>
      {Array.from({ length: total }).map((_, i) => {
        const h = 3 + i * 3;
        return (
          <rect key={i} x={i * 4} y={13 - h} width="3" height={h} rx="0.8"
            fill={i < filled ? "currentColor" : "rgba(255,255,255,0.13)"} />
        );
      })}
    </svg>
  );
}

/* ─── Slide toggle ──────────────────────────────────────────────────────── */
function SlideToggle({ on, accent }: { on: boolean; accent: string }) {
  return (
    <div aria-hidden style={{
      position: "relative", width: 24, height: 12, borderRadius: 6,
      background: on ? `${accent}22` : "rgba(255,255,255,0.06)",
      border: `1px solid ${on ? `${accent}55` : "rgba(255,255,255,0.1)"}`,
      flexShrink: 0, transition: "background 0.25s, border-color 0.25s",
    }}>
      <div style={{
        position: "absolute", top: 2, left: on ? 12 : 2,
        width: 7, height: 7, borderRadius: "50%", background: accent,
        transition: "left 0.25s cubic-bezier(.4,0,.2,1)",
        boxShadow: `0 0 4px ${accent}88`,
      }} />
    </div>
  );
}

/* ─── Main badge ────────────────────────────────────────────────────────── */
export default function ConnectionBadge({ defaultLite = false }: { defaultLite?: boolean }) {
  const { isLite, enable, disable } = useLiteMode();
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  /* Cancel the timeout redirect from layout.tsx once JS has mounted */
  useEffect(() => {
    if (typeof window !== "undefined" && typeof (window as Window & { __clearLiteTimer?: () => void }).__clearLiteTimer === "function") {
      (window as Window & { __clearLiteTimer?: () => void }).__clearLiteTimer!();
    }
  }, []);

  const resolved = typeof window === "undefined" ? defaultLite : isLite;
  const filled = resolved ? 1 : 4;
  const accent = resolved ? "rgba(255,160,50,0.95)" : "var(--accent)";
  const label = resolved ? "LITE" : "FULL";

  const handleToggle = () => {
    if (!isLite) {
      /* Switching TO lite → navigate to /lite page */
      enable();
      router.push("/lite?from=badge");
    } else {
      /* Switching back to full → stay on current page in full mode */
      disable();
    }
  };

  return (
    <div
      style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9998,
        display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Аварийная версия link — visible on hover */}
      <a
        href="/lite"
        tabIndex={hovered ? 0 : -1}
        style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          padding: "3px 7px",
          background: "rgba(6,6,8,0.82)",
          border: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
          color: "rgba(255,255,255,0.28)",
          fontSize: 7, fontWeight: 700, letterSpacing: "0.2em",
          textTransform: "uppercase", textDecoration: "none",
          fontFamily: "var(--font-geist-mono), monospace",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(4px)",
          transition: "opacity 0.2s, transform 0.2s",
          pointerEvents: hovered ? "auto" : "none",
        }}
      >
        <svg width="7" height="7" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="square">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
        Аварийная версия
      </a>

      {/* Signal badge */}
      <button
        onClick={handleToggle}
        aria-label={resolved ? "Лёгкий режим — нажмите для возврата" : "Включить лёгкий режим"}
        aria-pressed={resolved}
        style={{
          display: "flex", alignItems: "center", gap: 6, padding: "5px 9px",
          background: "rgba(6,6,8,0.72)",
          border: `1px solid ${resolved ? "rgba(255,160,50,0.28)" : "rgba(255,255,255,0.06)"}`,
          backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
          cursor: "pointer",
          opacity: hovered ? 1 : 0.55,
          transition: "opacity 0.2s, border-color 0.25s",
          color: accent,
        }}
      >
        <SignalBars filled={filled} />
        <SlideToggle on={resolved} accent={accent} />
        <span style={{
          fontSize: 7, fontWeight: 700, letterSpacing: "0.2em",
          textTransform: "uppercase", color: accent,
          fontFamily: "var(--font-geist-mono), monospace",
          minWidth: 18, textAlign: "right",
        }}>
          {label}
        </span>
      </button>
    </div>
  );
}
