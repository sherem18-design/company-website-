"use client";

import Image from "next/image";
import { useId } from "react";

interface LogoProps {
  /** "full" — полная эмблема; "icon" — компактная версия */
  variant?: "full" | "icon";
  className?: string;
}

export default function Logo({ variant = "full", className = "" }: LogoProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const filterId = `rmblack_${uid}`;

  const w = variant === "icon" ? 72 : 210;
  const h = variant === "icon" ? 40 : 58;

  return (
    <span className={`inline-flex items-center relative ${className}`}>
      {/*
       * SVG-фильтр удаляет чёрный фон:
       * alpha_out = 4*(R+G+B) − 0.15
       * Чёрные пиксели → alpha 0 (прозрачные)
       * Яркий неон → alpha 1 (полностью видны)
       */}
      <svg
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
        aria-hidden="true"
      >
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      4 4 4 0 -0.15"
            />
          </filter>
        </defs>
      </svg>

      {/* 360° вращающееся свечение */}
      <div className="logo-glow-border" aria-hidden="true" />

      <Image
        src="/emblema.png"
        alt="Е-Спасатель"
        width={w}
        height={h}
        priority
        style={{
          objectFit: "contain",
          display: "block",
          filter: `url(#${filterId}) drop-shadow(0 0 10px rgba(0,200,80,0.45))`,
        }}
      />
    </span>
  );
}
