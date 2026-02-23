"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import HUDLines from "./HUDLines";
import { openHelpModal } from "./HelpModal";
import { useLiteMode } from "@/context/LiteModeContext";

export default function VideoHero() {
  const contentRef = useRef<HTMLDivElement>(null);
  const { isLite } = useLiteMode();

  useEffect(() => {
    if (isLite) return;

    const handleScroll = () => {
      const el = contentRef.current;
      if (!el) return;
      const scrollY = window.scrollY;
      el.style.transform = `translateY(${scrollY * 0.28}px)`;
      el.style.opacity = String(Math.max(0, 1 - scrollY / 550));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLite]);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden grain hero-mobile-safe"
    >
      {/* ── Background layer ── */}
      <div className="absolute inset-0 z-0">
        {isLite ? (
          /* ── Lite mode: static JPEG, no video download ── */
          <>
            <Image
              src="/hero-bg.jpeg"
              alt=""
              fill
              priority
              quality={60}
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: "center" }}
            />
          </>
        ) : (
          /* ── Full mode: autoplay video ── */
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
            style={{ animation: "slowZoom 28s linear infinite" }}
          >
            <source src="/hero-video.MP4" type="video/mp4" />
          </video>
        )}

        {/* Deep overlay */}
        <div className="absolute inset-0 bg-black/52" />

        {/* Radial vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 15%, rgba(0,0,0,0.65) 80%, rgba(0,0,0,0.9) 100%)",
          }}
        />

        {/* Bottom fade into page bg */}
        <div
          className="absolute bottom-0 left-0 right-0 h-64"
          style={{
            background:
              "linear-gradient(to top, var(--bg) 0%, transparent 100%)",
          }}
        />

        {/* Top fade */}
        <div
          className="absolute top-0 left-0 right-0 h-32"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)",
          }}
        />

        {/* Film grain noise — hidden in lite mode via CSS class */}
        <div
          className="absolute inset-0 opacity-35 mix-blend-overlay pointer-events-none lite-hide"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      {/* ── HUD decoration ── */}
      <HUDLines />

      {/* ── Hero content ── */}
      <div
        ref={contentRef}
        className="relative z-30 mx-auto max-w-5xl px-6 text-center will-change-transform"
      >
        {/* Section tag — top */}
        <div className="mb-6 inline-flex items-center gap-3 animate-fade-up">
          <div
            className="h-px w-10 flex-shrink-0"
            style={{ background: "var(--accent)" }}
          />
          <span className="hud-label tracking-[0.28em]">
            Платформа комплексной поддержки
          </span>
          <div
            className="h-px w-10 flex-shrink-0"
            style={{ background: "var(--accent)" }}
          />
        </div>

        {/* Headline */}
        <h1
          className="hud-title mb-8 animate-fade-up flex flex-col items-center"
          style={{
            gap: "0.35em",
            textShadow: "0 0 80px rgba(0,232,124,0.14), 0 6px 40px rgba(0,0,0,0.9)",
          }}
        >
          <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-[82px] text-white leading-none">
            Е-Спасатель
          </span>
          <span
            className="block text-5xl sm:text-6xl lg:text-7xl xl:text-[82px] leading-none"
            style={{
              color: "var(--accent)",
              textShadow: "0 0 48px rgba(0,232,124,0.45)",
            }}
          >
            единый сервис
          </span>
          <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-[82px] text-white leading-none">
            поддержки
          </span>
          <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-[82px] text-white leading-none">
            автомобилистов
          </span>
        </h1>

        {/* Subtext */}
        <p className="mx-auto mb-12 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg animate-fade-up-delay">
          Цифровая система помощи при ДТП, страховании и дорожных ситуациях.
          Работаем по чёткой структуре — от первого обращения до результата.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center animate-fade-up-delay-2">
          <button
            onClick={openHelpModal}
            className="btn-primary inline-flex items-center justify-center rounded-none px-9 py-4 text-sm font-bold tracking-[0.16em] uppercase w-full sm:w-auto"
          >
            Получить помощь
          </button>
          <a
            href="#support"
            className="btn-neon inline-flex items-center justify-center rounded-none px-9 py-4 text-sm font-bold tracking-[0.16em] uppercase w-full sm:w-auto"
          >
            Консультация 24/7
          </a>
          <a
            href="#capabilities"
            className="inline-flex items-center justify-center rounded-none px-9 py-4 text-sm font-bold tracking-[0.16em] uppercase text-white/35 transition-colors duration-200 w-full sm:w-auto"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color =
                "rgba(255,255,255,0.7)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(255,255,255,0.18)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color =
                "rgba(255,255,255,0.35)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(255,255,255,0.08)";
            }}
          >
            Возможности
          </a>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2">
        <span className="hud-label opacity-40">SCROLL</span>
        <div
          className="h-12 w-px"
          style={{
            background:
              "linear-gradient(to bottom, var(--accent), transparent)",
            opacity: 0.55,
          }}
        />
      </div>

      {/* ── Light track lines left/right ── */}
      <div
        className="absolute left-0 top-1/4 bottom-1/4 w-px opacity-10 hidden lg:block"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--accent), transparent)",
        }}
      />
      <div
        className="absolute right-0 top-1/4 bottom-1/4 w-px opacity-10 hidden lg:block"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--accent), transparent)",
        }}
      />
    </section>
  );
}
