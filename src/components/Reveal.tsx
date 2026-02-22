"use client";

import { useRef, useEffect, useState, CSSProperties, ReactNode } from "react";
import { useLiteMode } from "@/context/LiteModeContext";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  y?: number;
}

export default function Reveal({
  children,
  delay = 0,
  className = "",
  style,
  y = 28,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const { isLite } = useLiteMode();

  useEffect(() => {
    // In lite mode reveal immediately without observer overhead
    if (isLite) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.07 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isLite]);

  if (isLite) {
    return (
      <div ref={ref} className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${y}px)`,
        filter: visible ? "blur(0px)" : "blur(5px)",
        transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms, filter 0.75s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
