"use client";

import { useRef, useEffect } from "react";
import { useLiteMode } from "@/context/LiteModeContext";

interface SectionMediaProps {
  src: string;
  mode?: "window" | "panel" | "masked";
  className?: string;
  label?: string;
}

function LitePlaceholder({
  mode,
  className,
  label,
}: Pick<SectionMediaProps, "mode" | "className" | "label">) {
  const clip =
    mode === "panel"
      ? "polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 28px 100%, 0 calc(100% - 28px))"
      : mode === "masked"
      ? "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)"
      : undefined;

  return (
    <div
      className={`relative overflow-hidden flex items-center justify-center ${className}`}
      style={{
        minHeight: "240px",
        background: "var(--bg-3)",
        border: mode === "window" || mode === "masked" ? "1px solid var(--accent-border)" : undefined,
        clipPath: clip,
        boxShadow:
          mode === "window"
            ? "0 0 48px rgba(0,232,124,0.07), 0 0 120px rgba(0,232,124,0.03), inset 0 0 40px rgba(0,0,0,0.5)"
            : undefined,
      }}
    >
      {/* Scan lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 6px)",
        }}
      />

      {/* Center icon + label */}
      <div className="relative z-10 flex flex-col items-center gap-3 select-none">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1"
          strokeLinecap="square"
          style={{ opacity: 0.35 }}
        >
          <rect x="2" y="2" width="20" height="20" />
          <line x1="2" y1="7" x2="22" y2="7" />
          <circle cx="12" cy="14" r="3" />
          <line x1="9.5" y1="11.5" x2="14.5" y2="16.5" strokeDasharray="2 2" />
        </svg>
        <span
          style={{
            fontSize: "8px",
            fontWeight: 700,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "var(--accent)",
            opacity: 0.35,
            fontFamily: "var(--font-geist-mono), monospace",
          }}
        >
          {label ?? "ВИДЕО ОТКЛЮЧЕНО"}
        </span>
      </div>

      {/* Corner brackets (window mode) */}
      {mode === "window" && (
        <>
          <div className="absolute top-0 left-0 w-5 h-5 pointer-events-none" style={{ borderTop: "1px solid var(--accent)", borderLeft: "1px solid var(--accent)", opacity: 0.7 }} />
          <div className="absolute top-0 right-0 w-5 h-5 pointer-events-none" style={{ borderTop: "1px solid var(--accent)", borderRight: "1px solid var(--accent)", opacity: 0.7 }} />
          <div className="absolute bottom-0 left-0 w-5 h-5 pointer-events-none" style={{ borderBottom: "1px solid var(--accent)", borderLeft: "1px solid var(--accent)", opacity: 0.7 }} />
          <div className="absolute bottom-0 right-0 w-5 h-5 pointer-events-none" style={{ borderBottom: "1px solid var(--accent)", borderRight: "1px solid var(--accent)", opacity: 0.7 }} />
        </>
      )}
    </div>
  );
}

export default function SectionMedia({
  src,
  mode = "window",
  className = "",
  label = "LIVE.FEED // CAM-01",
}: SectionMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isLite } = useLiteMode();

  useEffect(() => {
    if (isLite) return;
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [isLite]);

  if (isLite) {
    return <LitePlaceholder mode={mode} className={className} label="ВИДЕО ОТКЛЮЧЕНО // ЛЁГКИЙ РЕЖИМ" />;
  }

  if (mode === "window") {
    return (
      <div
        className={`relative overflow-hidden ${className}`}
        style={{
          border: "1px solid var(--accent-border)",
          boxShadow:
            "0 0 48px rgba(0,232,124,0.07), 0 0 120px rgba(0,232,124,0.03), inset 0 0 40px rgba(0,0,0,0.5)",
        }}
      >

        {/* Video */}
        <div className="relative">
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full object-cover"
            style={{ maxHeight: "480px", display: "block" }}
          >
            <source src={src} type="video/mp4" />
          </video>

          {/* Scan lines overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
            }}
          />

          {/* Color grade */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,232,124,0.02) 0%, transparent 30%, rgba(0,0,0,0.3) 100%)",
            }}
          />
        </div>

        {/* Corner brackets */}
        <div
          className="absolute top-0 left-0 w-5 h-5 pointer-events-none"
          style={{
            borderTop: "1px solid var(--accent)",
            borderLeft: "1px solid var(--accent)",
            opacity: 0.7,
          }}
        />
        <div
          className="absolute top-0 right-0 w-5 h-5 pointer-events-none"
          style={{
            borderTop: "1px solid var(--accent)",
            borderRight: "1px solid var(--accent)",
            opacity: 0.7,
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-5 h-5 pointer-events-none"
          style={{
            borderBottom: "1px solid var(--accent)",
            borderLeft: "1px solid var(--accent)",
            opacity: 0.7,
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-5 h-5 pointer-events-none"
          style={{
            borderBottom: "1px solid var(--accent)",
            borderRight: "1px solid var(--accent)",
            opacity: 0.7,
          }}
        />
      </div>
    );
  }

  if (mode === "panel") {
    return (
      <div
        className={`relative overflow-hidden ${className}`}
        style={{
          clipPath:
            "polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 28px 100%, 0 calc(100% - 28px))",
        }}
      >
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full object-cover"
          style={{ maxHeight: "500px", display: "block" }}
        >
          <source src={src} type="video/mp4" />
        </video>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,232,124,0.06) 0%, transparent 50%, rgba(0,0,0,0.4) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
          }}
        />
      </div>
    );
  }

  // masked mode
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        clipPath:
          "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
        border: "1px solid var(--accent-border)",
      }}
    >
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full object-cover"
        style={{ maxHeight: "480px", display: "block" }}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
