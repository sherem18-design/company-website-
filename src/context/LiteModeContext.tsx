"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

export type LiteReason = "auto" | "manual" | null;

interface LiteModeCtx {
  isLite: boolean;
  reason: LiteReason;
  /** True when auto-detected and the user hasn't dismissed the banner yet */
  showBanner: boolean;
  connectionLabel: string;
  enable: () => void;
  disable: () => void;
  toggle: () => void;
  dismissBanner: () => void;
}

const LiteModeContext = createContext<LiteModeCtx>({
  isLite: false,
  reason: null,
  showBanner: false,
  connectionLabel: "",
  enable: () => {},
  disable: () => {},
  toggle: () => {},
  dismissBanner: () => {},
});

export function useLiteMode() {
  return useContext(LiteModeContext);
}

/* ─── Network Information API (client-side supplement) ──────────────────── */
function getConnectionInfo(): { slow: boolean; label: string } {
  if (typeof navigator === "undefined") return { slow: false, label: "" };

  const conn =
    (navigator as unknown as Record<string, unknown>).connection ??
    (navigator as unknown as Record<string, unknown>).mozConnection ??
    (navigator as unknown as Record<string, unknown>).webkitConnection;

  if (!conn || typeof conn !== "object") return { slow: false, label: "" };

  const c = conn as {
    effectiveType?: string;
    downlink?: number;
    saveData?: boolean;
  };

  if (c.saveData) return { slow: true, label: "Data Saver" };
  if (c.effectiveType === "slow-2g") return { slow: true, label: "slow-2G" };
  if (c.effectiveType === "2g") return { slow: true, label: "2G" };
  if (typeof c.downlink === "number" && c.downlink < 1.5)
    return { slow: true, label: `${c.downlink.toFixed(1)} Mbps` };

  return { slow: false, label: c.effectiveType ?? "" };
}

/* Cookie names — must match middleware.ts */
const COOKIE_AUTO = "lite_mode";
const COOKIE_PREF = "lite_mode_pref";

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((r) => r.startsWith(`${name}=`))
    ?.split("=")[1];
}

function setCookieClient(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${value}; path=/; max-age=${maxAgeSeconds}; samesite=lax`;
}

export interface LiteModeProviderProps {
  children: ReactNode;
  /**
   * Initial lite state resolved server-side from the `lite_mode` cookie.
   * When true the provider skips its own auto-detection so the UI is
   * already in lite mode on first paint (no hydration flicker).
   */
  defaultLite?: boolean;
}

export function LiteModeProvider({
  children,
  defaultLite = false,
}: LiteModeProviderProps) {
  const [isLite, setIsLite] = useState(defaultLite);
  const [reason, setReason] = useState<LiteReason>(defaultLite ? "auto" : null);
  const [showBanner, setShowBanner] = useState(false);
  const [connectionLabel, setConnectionLabel] = useState("");

  useEffect(() => {
    /*
     * Resolution order:
     * 1. User's explicit preference cookie (lite_mode_pref) → always wins
     * 2. Server-set cookie (lite_mode / defaultLite prop)   → already applied
     * 3. Client-side Network Information API check          → last resort
     */
    const userPref = getCookie(COOKIE_PREF);

    if (userPref === "on") {
      setIsLite(true);
      setReason("manual");
      setShowBanner(false);
      return;
    }

    if (userPref === "off") {
      setIsLite(false);
      setReason(null);
      setShowBanner(false);
      return;
    }

    /* No explicit pref — if server already detected slow, keep it */
    if (defaultLite) {
      setShowBanner(true); // show banner explaining auto-activation
      return;
    }

    /* Try client-side detection as a fallback */
    const { slow, label } = getConnectionInfo();
    setConnectionLabel(label);
    if (slow) {
      setIsLite(true);
      setReason("auto");
      setShowBanner(true);
    }
  }, [defaultLite]);

  /* Sync CSS class on <html> on every change */
  useEffect(() => {
    document.documentElement.classList.toggle("lite-mode", isLite);
  }, [isLite]);

  const enable = useCallback(() => {
    setIsLite(true);
    setReason("manual");
    setShowBanner(false);
    setCookieClient(COOKIE_PREF, "on", 30 * 24 * 3600);
    /* Also clear the auto cookie so middleware knows user prefers lite */
    setCookieClient(COOKIE_AUTO, "true", 30 * 24 * 3600);
  }, []);

  const disable = useCallback(() => {
    setIsLite(false);
    setReason(null);
    setShowBanner(false);
    setCookieClient(COOKIE_PREF, "off", 30 * 24 * 3600);
    setCookieClient(COOKIE_AUTO, "", 0);
  }, []);

  const toggle = useCallback(() => {
    setIsLite((prev) => {
      const next = !prev;
      setReason(next ? "manual" : null);
      setShowBanner(false);
      setCookieClient(COOKIE_PREF, next ? "on" : "off", 30 * 24 * 3600);
      if (!next) setCookieClient(COOKIE_AUTO, "", 0);
      return next;
    });
  }, []);

  const dismissBanner = useCallback(() => {
    setShowBanner(false);
    /* Keep lite mode ON, just hide the banner and persist preference */
    setCookieClient(COOKIE_PREF, "on", 30 * 24 * 3600);
  }, []);

  return (
    <LiteModeContext.Provider
      value={{
        isLite,
        reason,
        showBanner,
        connectionLabel,
        enable,
        disable,
        toggle,
        dismissBanner,
      }}
    >
      {children}
    </LiteModeContext.Provider>
  );
}
