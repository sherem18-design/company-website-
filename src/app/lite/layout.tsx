import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Е-Спасатель — Упрощённый режим",
  description:
    "Быстрая версия сайта для медленного соединения. ОСАГО, Эвакуатор, Европротокол, помощь при ДТП — без видео и тяжёлых скриптов.",
};

/*
 * Отдельный root-layout для /lite — своя <html> / <body>.
 * Google Fonts не загружаются, глобальный CSS основного сайта не подключается.
 * Все дизайн-токены задаются inline через <style>.
 */
export default function LiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#060608" />
        <style>{`
          /* ── Design tokens matching the main site ── */
          :root {
            --accent:        #00e87c;
            --accent-dim:    rgba(0,232,124,0.08);
            --accent-border: rgba(0,232,124,0.22);
            --accent-glow:   rgba(0,232,124,0.35);
            --bg:            #060608;
            --bg-2:          #0b0c10;
            --bg-3:          #10111a;
            --border:        rgba(255,255,255,0.055);
            --border-bright: rgba(255,255,255,0.1);
            --mono:          'SF Mono','Fira Code','Cascadia Code',monospace;
          }

          /* ── Base reset ── */
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html { scroll-behavior: smooth; }
          body {
            background: var(--bg);
            color: #fff;
            font-family: system-ui,-apple-system,'Helvetica Neue',sans-serif;
            overflow-x: hidden;
            min-height: 100vh;
          }

          /* ── Scrollbar ── */
          ::-webkit-scrollbar { width: 3px; }
          ::-webkit-scrollbar-track { background: var(--bg); }
          ::-webkit-scrollbar-thumb { background: var(--accent); }

          /* ── Selection ── */
          ::selection { background: rgba(0,232,124,0.22); color: #fff; }

          /* ── Form controls ── */
          input, select, textarea {
            display: block;
            width: 100%;
            background: rgba(255,255,255,0.035);
            border: 1px solid rgba(255,255,255,0.1);
            color: #fff;
            padding: 11px 14px;
            font-size: 15px;
            font-family: inherit;
            outline: none;
            border-radius: 0;
            transition: border-color 0.2s, background 0.2s;
            box-sizing: border-box;
          }
          input:focus, select:focus, textarea:focus {
            border-color: rgba(0,232,124,0.5);
            background: rgba(0,232,124,0.04);
          }
          select { appearance: none; cursor: pointer; }
          textarea { resize: vertical; min-height: 80px; }

          /* ── Checkbox ── */
          input[type="checkbox"] {
            width: 18px; height: 18px;
            accent-color: var(--accent);
            cursor: pointer;
            flex-shrink: 0;
          }

          /* ── Utility classes ── */
          .label {
            display: block;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: rgba(255,255,255,0.45);
            margin-bottom: 5px;
            font-family: var(--mono);
          }
          .label .req { color: var(--accent); margin-left: 3px; }

          .hint {
            font-size: 10px;
            color: rgba(255,255,255,0.28);
            margin-top: 4px;
          }

          .field { margin-bottom: 16px; }

          .card {
            background: var(--bg-2);
            border: 1px solid var(--border);
            padding: 20px;
            margin-bottom: 16px;
          }

          .card-title {
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            color: rgba(0,232,124,0.6);
            margin-bottom: 16px;
            font-family: var(--mono);
          }

          .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
          .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }

          @media (max-width: 600px) {
            .grid2, .grid3 { grid-template-columns: 1fr; }
          }

          /* ── Buttons ── */
          .btn-primary {
            display: block;
            width: 100%;
            background: var(--accent);
            color: #040508;
            border: none;
            padding: 14px 20px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            cursor: pointer;
            font-family: inherit;
            transition: opacity 0.2s;
          }
          .btn-primary:disabled {
            opacity: 0.3;
            cursor: not-allowed;
          }
          .btn-outline {
            display: block;
            width: 100%;
            background: transparent;
            color: var(--accent);
            border: 1px solid var(--accent-border);
            padding: 12px 20px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            cursor: pointer;
            font-family: inherit;
            transition: background 0.2s;
          }
          .btn-outline:hover { background: var(--accent-dim); }

          /* ── Section tag ── */
          .section-tag {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            color: var(--accent);
            font-family: var(--mono);
            margin-bottom: 8px;
          }
          .section-tag::before {
            content: '';
            display: block;
            width: 16px;
            height: 1px;
            background: var(--accent);
          }

          /* ── Chip (selector button) ── */
          .chip {
            display: inline-flex;
            align-items: center;
            padding: 8px 12px;
            margin: 3px;
            background: var(--bg-3);
            border: 1px solid var(--border);
            color: rgba(255,255,255,0.5);
            font-size: 13px;
            font-family: inherit;
            cursor: pointer;
            transition: border-color 0.15s, color 0.15s, background 0.15s;
          }
          .chip.active {
            border-color: var(--accent-border);
            background: var(--accent-dim);
            color: #fff;
          }

          /* ── Info / warn blocks ── */
          .info-block {
            background: rgba(0,232,124,0.04);
            border: 1px solid rgba(0,232,124,0.18);
            padding: 12px 16px;
            font-size: 13px;
            color: rgba(255,255,255,0.55);
            line-height: 1.6;
            margin-bottom: 16px;
          }
          .warn-block {
            background: rgba(255,80,80,0.06);
            border: 1px solid rgba(255,80,80,0.28);
            padding: 12px 16px;
            font-size: 13px;
            line-height: 1.6;
            margin-bottom: 16px;
          }

          /* ── Done/success block ── */
          .done-block {
            background: rgba(0,232,124,0.06);
            border: 1px solid var(--accent-border);
            padding: 28px 20px;
            text-align: center;
            margin-bottom: 16px;
          }

          /* ── Divider ── */
          .divider {
            height: 1px;
            background: var(--border);
            margin: 20px 0;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
