import type { Metadata } from "next";
import { Space_Grotesk, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import { LiteModeProvider } from "@/context/LiteModeContext";
import LiteModeToggle from "@/components/LiteModeToggle";
import ConnectionBadge from "@/components/ConnectionBadge";
import HelpModal from "@/components/HelpModal";

/* ─── Google Fonts ──────────────────────────────────────────────────────────
   Both font objects are initialised unconditionally at module level because
   Next.js requires static font calls. However we apply their CSS-variable
   classes to <body> only in full mode. When the classes are absent the
   browser will not download the font files (Next.js self-hosts and the
   @font-face rules use `font-display: swap/optional`).
───────────────────────────────────────────────────────────────────────────── */
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "optional", // 'optional' avoids FOIT and skips download when not needed
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "optional",
});

export const metadata: Metadata = {
  title: "Е-Спасатель — Технологическая платформа поддержки автомобилистов",
  description:
    "Цифровая система помощи при ДТП, страховании и дорожных ситуациях. Федеральный охват. Работаем 24/7.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /* ── Read lite-mode state on the server ─────────────────────────────────
     Priority:
       1. lite_mode_pref cookie  — explicit user choice (client-set)
       2. lite_mode cookie       — auto-detected by middleware
  ────────────────────────────────────────────────────────────────────────── */
  const cookieStore = await cookies();
  const userPref = cookieStore.get("lite_mode_pref")?.value;   // "on" | "off" | undefined
  const autoMode = cookieStore.get("lite_mode")?.value;         // "true" | undefined

  const isLite =
    userPref === "on" ||
    (userPref === undefined && autoMode === "true");

  /* ─── Class names ────────────────────────────────────────────────────────
     In lite mode: no font variable classes → browser skips font downloads.
     In full mode: normal font variables applied to body.
  ─────────────────────────────────────────────────────────────────────────── */
  const fontClasses = isLite
    ? ""
    : `${spaceGrotesk.variable} ${geistMono.variable}`;

  const bodyStyle = isLite
    ? { fontFamily: "system-ui, -apple-system, sans-serif" }
    : { fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" };

  return (
    <html
      lang="ru"
      className={`scroll-smooth${isLite ? " lite-mode" : ""}`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Inline timeout redirect — executes synchronously on first HTML parse,
          before ANY external JS is downloaded. If the page doesn't become
          interactive within 90 seconds, the user is sent to /lite automatically.
          window.__clearLiteTimer is called by ConnectionBadge on mount.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  if(window.location.pathname.startsWith('/lite'))return;
  var t=setTimeout(function(){
    window.location.replace('/lite?from=timeout');
  },270000);
  window.__clearLiteTimer=function(){clearTimeout(t);};
  window.addEventListener('load',function(){clearTimeout(t);},{once:true});
})();`,
          }}
        />
      </head>
      <body
        className={`${fontClasses} antialiased`}
        style={bodyStyle}
        suppressHydrationWarning
      >
        <LiteModeProvider defaultLite={isLite}>
          {children}
          <LiteModeToggle />
          <ConnectionBadge defaultLite={isLite} />
          <CookieBanner />
          <HelpModal />
        </LiteModeProvider>
      </body>
    </html>
  );
}
