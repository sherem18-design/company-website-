import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Политика Cookie — Е-Спасатель",
  icons: { icon: "/emblema.png" },
};

const UPDATED = "01 января 2026 г.";

const COOKIE_TYPES = [
  {
    type: "Строго необходимые",
    tag: "ОБЯЗАТЕЛЬНЫЕ",
    required: true,
    desc: "Необходимы для работы основных функций сайта. Без них сайт не может корректно функционировать. Согласие не требуется.",
    examples: [
      { name: "e-saver-session", purpose: "Идентификатор пользовательской сессии", period: "до закрытия браузера" },
      { name: "e-saver-cookie-consent", purpose: "Хранение настроек согласия на cookie", period: "1 год" },
      { name: "NEXT_LOCALE", purpose: "Сохранение языковых предпочтений", period: "1 год" },
    ],
  },
  {
    type: "Аналитические",
    tag: "СТАТИСТИКА",
    required: false,
    desc: "Помогают понять, как посетители взаимодействуют с сайтом. Все данные анонимизированы и не позволяют идентифицировать пользователя.",
    examples: [
      { name: "_ga", purpose: "Отличает пользователей (Google Analytics)", period: "2 года" },
      { name: "_ga_*", purpose: "Хранит состояние сессии (Google Analytics)", period: "2 года" },
      { name: "ymuid", purpose: "Идентификатор посетителя (Яндекс.Метрика)", period: "1 год" },
    ],
  },
  {
    type: "Функциональные",
    tag: "ПРЕДПОЧТЕНИЯ",
    required: false,
    desc: "Запоминают ваши предпочтения и настройки для более удобного использования сайта при повторных посещениях.",
    examples: [
      { name: "e-saver-theme", purpose: "Настройки отображения интерфейса", period: "6 месяцев" },
      { name: "e-saver-form-draft", purpose: "Черновик незавершённой формы", period: "7 дней" },
    ],
  },
];

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-bold text-white uppercase tracking-wide mb-4 mt-10 flex items-center gap-3">
      <div className="h-px w-4 flex-shrink-0" style={{ background: "var(--accent)" }} />
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.55)" }}>{children}</p>;
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: "linear-gradient(rgba(0,232,124,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,232,124,0.02) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 sticky top-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(6,6,8,0.92)", backdropFilter: "blur(12px)" }}>
        <Link href="/" className="flex items-center gap-3" style={{ textDecoration: "none" }}>
          <div className="flex items-center justify-center w-8 h-8" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
          </div>
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase hidden sm:block" style={{ color: "rgba(255,255,255,0.3)" }}>Назад</span>
        </Link>
        <div className="flex items-center gap-3">
          <Image src="/emblema.png" alt="Е-Спасатель" width={28} height={28} style={{ opacity: 0.8 }} />
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: "var(--accent)" }}>Е-Спасатель</span>
        </div>
        <div className="text-[8px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.2)" }}>Cookie</div>
      </header>

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 py-12 pb-24">
        {/* Title */}
        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-3">
            <div className="h-px w-6" style={{ background: "var(--accent)" }} />
            <span className="hud-label text-[9px]">ПРАВОВОЙ ДОКУМЕНТ</span>
          </div>
          <h1 className="hud-title text-3xl sm:text-4xl text-white mb-3">Политика<br /><span style={{ color: "var(--accent)" }}>использования Cookie</span></h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>Редакция от {UPDATED}</p>
        </div>

        <H2>1. Что такое файлы Cookie</H2>
        <P>
          Файлы cookie — это небольшие текстовые файлы, которые сохраняются в браузере при посещении веб-сайта. Они позволяют сайту запомнить ваши действия и предпочтения (авторизация, язык, настройки отображения) на определённый период времени.
        </P>

        <H2>2. Для чего мы используем Cookie</H2>
        <P>Мы используем файлы cookie для следующих целей:</P>
        <ul className="mb-4 ml-2 space-y-1">
          {["Обеспечение корректной работы функций сайта", "Запоминание ваших настроек и предпочтений", "Анализ посещаемости и улучшение качества сервиса", "Безопасность и предотвращение мошенничества"].map((t) => (
            <li key={t} className="flex items-start gap-2 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: "var(--accent)" }} />
              {t}
            </li>
          ))}
        </ul>

        <H2>3. Типы используемых Cookie</H2>

        {COOKIE_TYPES.map((ct) => (
          <div key={ct.type} className="mb-6" style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex items-center gap-3">
                <div className="text-[8px] font-bold tracking-[0.22em] uppercase" style={{ color: ct.required ? "var(--accent)" : "rgba(255,255,255,0.4)" }}>
                  {ct.tag}
                </div>
                <h3 className="text-sm font-bold text-white">{ct.type}</h3>
              </div>
              {ct.required ? (
                <span className="text-[9px] px-2 py-1 font-bold tracking-widest uppercase" style={{ background: "rgba(0,232,124,0.12)", border: "1px solid rgba(0,232,124,0.25)", color: "var(--accent)" }}>
                  Обязательные
                </span>
              ) : (
                <span className="text-[9px] px-2 py-1 font-bold tracking-widest uppercase" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)" }}>
                  По выбору
                </span>
              )}
            </div>

            <div className="px-5 py-4">
              <p className="text-xs leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.45)" }}>{ct.desc}</p>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      {["Название", "Назначение", "Срок хранения"].map((h) => (
                        <th key={h} className="text-left py-2 pr-4 font-bold tracking-widest uppercase" style={{ color: "rgba(0,232,124,0.6)", fontSize: "9px" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ct.examples.map((ex) => (
                      <tr key={ex.name} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                        <td className="py-2 pr-4 font-mono text-white" style={{ fontFamily: "var(--font-geist-mono)" }}>{ex.name}</td>
                        <td className="py-2 pr-4" style={{ color: "rgba(255,255,255,0.5)" }}>{ex.purpose}</td>
                        <td className="py-2" style={{ color: "rgba(255,255,255,0.4)" }}>{ex.period}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}

        <H2>4. Управление файлами Cookie</H2>
        <P>
          Вы можете настроить параметры cookie при первом посещении сайта через баннер согласия. В любой момент настройки можно изменить в браузере:
        </P>
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          {[
            { browser: "Google Chrome", path: "Настройки → Конфиденциальность → Файлы cookie" },
            { browser: "Mozilla Firefox", path: "Настройки → Приватность и защита → Куки" },
            { browser: "Safari", path: "Настройки → Конфиденциальность → Управление данными" },
            { browser: "Microsoft Edge", path: "Настройки → Конфиденциальность → Файлы cookie" },
          ].map((b) => (
            <div key={b.browser} className="p-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-xs font-bold text-white mb-1">{b.browser}</div>
              <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{b.path}</div>
            </div>
          ))}
        </div>
        <P>Отключение cookie может привести к некорректной работе некоторых функций сайта.</P>

        <H2>5. Сторонние сервисы</H2>
        <P>
          На нашем сайте могут использоваться сервисы третьих сторон, размещающие собственные файлы cookie: Google Analytics (политика: policies.google.com/privacy), Яндекс.Метрика (yandex.ru/legal/privacy). Мы не контролируем cookies этих сервисов.
        </P>

        <H2>6. Контакты</H2>
        <P>По вопросам использования файлов cookie: <span style={{ color: "var(--accent)" }}>privacy@e-saver.ru</span></P>

        <div className="mt-8 flex gap-4 flex-wrap">
          <Link href="/privacy" className="btn-neon px-6 py-3 text-xs font-bold tracking-widest uppercase" style={{ display: "inline-flex", alignItems: "center" }}>
            Политика конфиденциальности
          </Link>
          <Link href="/" className="btn-neon px-6 py-3 text-xs font-bold tracking-widest uppercase" style={{ display: "inline-flex", alignItems: "center" }}>
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}
