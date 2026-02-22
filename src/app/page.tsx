import Image from "next/image";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import VideoHero from "@/components/VideoHero";
import Reveal from "@/components/Reveal";

/*
 * Heavy client components loaded lazily:
 *  - ConsultChat   : chat widget, not needed on first paint
 *  - SectionMedia  : video player (Three.js-free but still heavy media)
 * In lite mode these are replaced with lightweight placeholders inside
 * the components themselves, so the full chunk is never evaluated.
 */
/*
 * Lazy-loaded components: Next.js will code-split them into separate chunks
 * that are only downloaded when the component actually mounts in the viewport.
 * ssr: true (default) keeps server-rendering for SEO / first paint.
 */
const ConsultChat = dynamic(() => import("@/components/ConsultChat"), {
  loading: () => null,
});

const InsuranceCalculator = dynamic(() => import("@/components/InsuranceCalculator"), {
  loading: () => null,
});

const HelpModalTrigger = dynamic(() => import("@/components/HelpModalTrigger"), {
  loading: () => null,
});

const SectionMedia = dynamic(() => import("@/components/SectionMedia"), {
  loading: () => (
    <div
      style={{
        width: "100%",
        minHeight: 240,
        background: "var(--bg-3)",
        border: "1px solid var(--accent-border)",
      }}
    />
  ),
});

/* ─── Data ─── */
const serviceCards = [
  {
    id: "svc-1",
    title: "ОСАГО онлайн",
    subtitle: "Оформление полиса без офиса",
    href: "/osago",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <path d="M12 2L4 5v7c0 4.4 3.5 8.5 8 10 4.5-1.5 8-5.6 8-10V5L12 2z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
  },
  {
    id: "svc-2",
    title: "Европротокол онлайн",
    subtitle: "Оформление ДТП без ГИБДД",
    href: "/europrotocol",
    image: "/europrotocol.png",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="8" y1="13" x2="16" y2="13"/>
        <line x1="8" y1="17" x2="12" y2="17"/>
      </svg>
    ),
  },
  {
    id: "svc-3",
    title: "Эвакуация",
    subtitle: "Организация выезда эвакуатора",
    href: "/evacuation",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <rect x="1" y="11" width="9" height="7" rx="0.5"/>
        <path d="M10 14h3l5-5h3v8h-3"/>
        <circle cx="5" cy="19" r="2"/>
        <circle cx="17.5" cy="19" r="2"/>
      </svg>
    ),
  },
];

const capabilities = [
  {
    id: "cap-1",
    num: "01",
    title: "Помощь при ДТП",
    description:
      "Алгоритм действий с первой секунды. Пошаговое сопровождение до завершения.",
    tag: "АВАРИЙНЫЙ ПРОТОКОЛ",
    href: "/dtp",
    cta: "Инструкции",
  },
  {
    id: "cap-2",
    num: "02",
    title: "Европротокол онлайн",
    description:
      "Цифровое оформление без вызова ГИБДД. Проверка условий и подготовка документов.",
    tag: "ЦИФРОВОЙ ФОРМАТ",
    href: "/europrotocol",
    cta: "Заполнить",
  },
  {
    id: "cap-3",
    num: "03",
    title: "Страхование",
    description:
      "Проверка полиса, сопровождение при страховом случае, контроль выплат.",
    tag: "ФИНАНСОВЫЙ МОДУЛЬ",
    href: "/insurance",
    cta: "Рассчитать",
  },
  {
    id: "cap-4",
    num: "04",
    title: "Консультации 24/7",
    description:
      "Специалисты круглосуточно. Юридические, страховые и технические вопросы.",
    tag: "ПОДДЕРЖКА",
    href: "/#support",
    cta: "Написать",
  },
  {
    id: "cap-5",
    num: "05",
    title: "Автомобильный ремонт",
    description: "Любая сложность. Диагностика, советы и запись к специалисту.",
    tag: "ТЕХНИЧЕСКАЯ ПОМОЩЬ",
    href: "/repair",
    cta: "Описать проблему",
  },
  {
    id: "cap-6",
    num: "06",
    title: "Эвакуатор",
    description: "Быстрый выезд по вашему адресу. Работаем круглосуточно по всей России.",
    tag: "ЭВАКУАЦИЯ",
    href: "/evacuation-request",
    cta: "Вызвать эвакуатор",
  },
];

const roadServices = [
  {
    id: "rs-1",
    title: "Подвоз бензина",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <path d="M3 22V8l6-6h6l2 2v1h2l2 3v4h1v9H3z"/>
        <path d="M9 22v-6h6v6"/>
        <path d="M17 8h2v5"/>
        <circle cx="19" cy="14" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    id: "rs-2",
    title: "Оживление аккумулятора",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <rect x="2" y="8" width="16" height="12" rx="0.5"/>
        <path d="M18 11h2a1 1 0 011 1v4a1 1 0 01-1 1h-2"/>
        <path d="M7 2v3M11 2v3"/>
        <path d="M13 14l-4 4V14H7l4-4v4h2z" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    id: "rs-3",
    title: "Подкачка колёс",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <circle cx="12" cy="12" r="9"/>
        <circle cx="12" cy="12" r="3"/>
        <line x1="12" y1="3" x2="12" y2="9"/>
        <line x1="12" y1="15" x2="12" y2="21"/>
        <line x1="3" y1="12" x2="9" y2="12"/>
        <line x1="15" y1="12" x2="21" y2="12"/>
      </svg>
    ),
  },
  {
    id: "rs-4",
    title: "Замена запасного колеса",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <circle cx="9" cy="14" r="6"/>
        <circle cx="9" cy="14" r="2"/>
        <path d="M19 6l-2 8"/>
        <circle cx="19" cy="6" r="2"/>
        <path d="M15 8h4"/>
      </svg>
    ),
  },
  {
    id: "rs-5",
    title: "И другая помощь",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="16"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    ),
  },
];

const dtpTools = [
  { label: "Пошаговая инструкция при ДТП",        href: "/dtp" },
  { label: "Онлайн-оформление европротокола",      href: "/europrotocol" },
  { label: "Фотофиксация происшествия",            href: null },
  { label: "Проверка корректности документов",     href: null },
  { label: "Консультация специалиста",             href: null },
  { label: "Организация выезда",                   href: "/evacuation" },
];

const eProtocolFeatures = [
  {
    id: "ep-1",
    title: "Проверка условий применения",
    description: "Анализ соответствия ситуации требованиям европротокола.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <circle cx="11" cy="11" r="7"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
  },
  {
    id: "ep-2",
    title: "Пошаговая инструкция",
    description: "Структурированный алгоритм оформления.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <line x1="8" y1="6" x2="21" y2="6"/>
        <line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/>
        <circle cx="3" cy="6" r="1" fill="currentColor" stroke="none"/>
        <circle cx="3" cy="12" r="1" fill="currentColor" stroke="none"/>
        <circle cx="3" cy="18" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    id: "ep-3",
    title: "Контрольная консультация",
    description: "Проверка правильности действий на каждом шаге.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
  },
  {
    id: "ep-4",
    title: "Анализ ситуации",
    description: "Оценка обстоятельств и выбор оптимального решения.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    id: "ep-5",
    title: "Рекомендации после оформления",
    description: "Чёткий план дальнейших действий.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 8 12 12 14 14"/>
      </svg>
    ),
  },
  {
    id: "ep-6",
    title: "Подготовка перечня документов",
    description: "Полный список необходимых материалов.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="8" y1="13" x2="16" y2="13"/>
        <line x1="8" y1="17" x2="12" y2="17"/>
      </svg>
    ),
  },
  {
    id: "ep-7",
    title: "Информационное сопровождение",
    description: "Поддержка на всём протяжении процесса.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <path d="M12 2L4 5v7c0 4.4 3.5 8.5 8 10 4.5-1.5 8-5.6 8-10V5L12 2z"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  },
];

const insuranceFeatures = [
  {
    id: "ins-1",
    title: "Проверка полиса",
    description: "Анализ действующего страхового полиса и условий покрытия.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <path d="M12 2L4 5v7c0 4.4 3.5 8.5 8 10 4.5-1.5 8-5.6 8-10V5L12 2z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
  },
  {
    id: "ins-2",
    title: "Расчёт страхования",
    description: "Подбор оптимальных условий для вашего автомобиля.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <rect x="4" y="2" width="16" height="20" rx="0.5"/>
        <line x1="8" y1="8" x2="16" y2="8"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
        <line x1="8" y1="16" x2="12" y2="16"/>
      </svg>
    ),
  },
  {
    id: "ins-3",
    title: "Контроль страховых выплат",
    description: "",
    iconOnly: true,
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <rect x="2" y="3" width="20" height="15" rx="0.5"/>
        <polyline points="8 21 12 17 16 21"/>
        <line x1="12" y1="17" x2="12" y2="18"/>
        <polyline points="6 12 9 9 12 11 15 8 18 10" strokeWidth="1.2"/>
      </svg>
    ),
  },
];

const supportFeatures = [
  {
    id: "sup-1",
    icon: "!",
    title: "Экстренная консультация",
    description: "Мгновенное подключение специалиста в критической ситуации.",
  },
  {
    id: "sup-2",
    icon: "§",
    title: "Страховые вопросы",
    description: "Профессиональная поддержка по вопросам страхования.",
  },
  {
    id: "sup-3",
    icon: "⚖",
    title: "Правовая поддержка",
    description: "Консультации по правовым аспектам дорожных ситуаций.",
  },
  {
    id: "sup-4",
    icon: "⚙",
    title: "Техническая помощь",
    description: "Координация технической помощи на дороге.",
  },
];

const howSteps = [
  {
    num: "01",
    text: "Обращение через сайт или по телефону.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498A1 1 0 0121 16.72V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
      </svg>
    ),
  },
  {
    num: "02",
    text: "Подключение специалиста.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <circle cx="12" cy="7" r="4"/>
        <path d="M4 21v-2a8 8 0 0116 0v2"/>
        <path d="M15 10a5 5 0 010 8"/>
      </svg>
    ),
  },
  {
    num: "05",
    text: "Организация необходимых мероприятий.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
      </svg>
    ),
  },
];

const aboutServices = [
  {
    id: "abs-1",
    title: "Оформление ОСАГО",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <path d="M12 2L4 5v7c0 4.4 3.5 8.5 8 10 4.5-1.5 8-5.6 8-10V5L12 2z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
  },
  {
    id: "abs-2",
    title: "Аварийный комиссар",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20v-1a8 8 0 0116 0v1"/>
        <path d="M12 12v2"/>
        <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    id: "abs-3",
    title: "Заполнение европротокола по фото и данным автоматически",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <rect x="3" y="5" width="13" height="10" rx="0.5"/>
        <path d="M16 9l5-3v10l-5-3"/>
        <path d="M7 15l2 4h6"/>
      </svg>
    ),
  },
  {
    id: "abs-4",
    title: "Эвакуация",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <rect x="1" y="11" width="9" height="7" rx="0.5"/>
        <path d="M10 14h3l5-5h3v8h-3"/>
        <circle cx="5" cy="19" r="2"/>
        <circle cx="17.5" cy="19" r="2"/>
      </svg>
    ),
  },
  {
    id: "abs-5",
    title: "Расчёт повреждений",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <rect x="4" y="2" width="16" height="20" rx="0.5"/>
        <line x1="8" y1="8" x2="16" y2="8"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
        <polyline points="8 16 11 14 13 16 16 13" strokeWidth="1.2"/>
      </svg>
    ),
  },
];

const guarantees = [
  {
    id: "gar-1",
    title: "Доступность 24/7",
    description: "Платформа работает круглосуточно без выходных.",
  },
  {
    id: "gar-2",
    title: "Чёткая структура",
    description: "Каждый процесс формализован по единому стандарту.",
  },
  {
    id: "gar-3",
    title: "Цифровой формат",
    description: "Все инструменты онлайн без личного визита.",
  },
  {
    id: "gar-4",
    title: "До результата",
    description: "Сопровождение от обращения до полного завершения.",
  },
];

/* ─── Section wrapper ─── */
function SectionTag({ children }: { children: string }) {
  return (
    <div className="mb-5 inline-flex items-center gap-3">
      <div
        className="h-px w-6 flex-shrink-0"
        style={{ background: "var(--accent)" }}
      />
      <span className="hud-label">{children}</span>
    </div>
  );
}

/* ─── Divider ─── */
function Divider() {
  return <div className="section-divider" />;
}

/* ─── Page ─── */
export default function Home() {
  return (
    <div
      className="min-h-screen text-white"
      style={{ background: "var(--bg)" }}
    >
      <Header />

      <main>
        {/* ═══════════════ 1. HERO ═══════════════ */}
        <VideoHero />

        {/* ═══════════════ 2. SERVICE CARDS ═══════════════ */}
        <section
          id="trust"
          style={{
            background: "var(--bg-2)",
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3">
              {serviceCards.map((card, i) => (
                <Reveal key={card.id} delay={i * 80}>
                  <a
                    href={card.href}
                    className="relative flex flex-col items-center gap-5 px-8 py-10 text-center group cursor-pointer"
                    style={{
                      borderRight:
                        i < serviceCards.length - 1
                          ? "1px solid var(--border)"
                          : "none",
                      textDecoration: "none",
                      display: "flex",
                    }}
                  >
                    {/* Accent top line */}
                    <div
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-px transition-all duration-300 group-hover:w-14"
                      style={{ background: "var(--accent)", opacity: 0.6 }}
                    />
                    {/* Neuro icon container */}
                    <div
                      className="neuro-icon flex items-center justify-center w-16 h-16 flex-shrink-0 overflow-hidden"
                      style={{ color: "var(--accent)", position: "relative", zIndex: 1 }}
                    >
                      {"image" in card && card.image ? (
                        <Image
                          src={card.image as string}
                          alt={card.title}
                          width={64}
                          height={64}
                          style={{ objectFit: "cover", width: "100%", height: "100%" }}
                        />
                      ) : (
                        card.icon
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold uppercase tracking-wider text-white mb-1 transition-colors duration-200 group-hover:text-[var(--accent)]">
                        {card.title}
                      </div>
                      <div
                        className="text-xs tracking-wide"
                        style={{ color: "rgba(255,255,255,0.35)" }}
                      >
                        {card.subtitle}
                      </div>
                    </div>
                    {/* Arrow indicator */}
                    <div
                      className="absolute bottom-3 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0"
                      style={{ color: "var(--accent)" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ═══════════════ 3. CAPABILITIES ═══════════════ */}
        <section id="capabilities" className="py-28 px-6 neuro-section">
          <div className="neuro-bg-layer" aria-hidden="true">
            <div className="nb-orb-a" />
            <div className="nb-orb-b" />
            <div className="nb-grid" />
            <div className="nb-streak" />
            <div className="nb-streak-2" />
            {/* Emblema watermark — SVG filter removes black bg */}
            <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
              <defs>
                <filter id="rmblack_bg" colorInterpolationFilters="sRGB">
                  <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  4 4 4 0 -0.15" />
                </filter>
              </defs>
            </svg>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <Image
                src="/emblema.png"
                alt=""
                width={800}
                height={440}
                style={{
                  objectFit: "contain",
                  opacity: 0.07,
                  userSelect: "none",
                  filter: "url(#rmblack_bg) blur(2px)",
                }}
              />
            </div>
          </div>
          <div className="mx-auto max-w-7xl" style={{ position: "relative", zIndex: 1 }}>
            <Reveal>
              <SectionTag>СИСТЕМА // ВОЗМОЖНОСТИ</SectionTag>
              <h2
                className="hud-title section-heading mb-16 text-4xl sm:text-5xl lg:text-6xl text-white"
              >
                Возможности
                <br />
                <span style={{ color: "var(--accent)" }}>платформы</span>
              </h2>
            </Reveal>

            <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((item, i) => {
                const inner = (
                  <>
                    <span className="hud-label text-[8px] mb-4" style={{ opacity: 0.5 }}>
                      {item.tag}
                    </span>
                    <h3 className="text-base font-bold uppercase tracking-wider text-white transition-colors duration-200 group-hover:text-[var(--accent)]">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                        {item.description}
                      </p>
                    )}
                    {item.cta && (
                      <div className="mt-4 inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.16em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ color: "var(--accent)" }}>
                        {item.cta}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
                          <line x1="5" y1="12" x2="19" y2="12"/>
                          <polyline points="12 5 19 12 12 19"/>
                        </svg>
                      </div>
                    )}
                  </>
                );

                return (
                  <Reveal key={item.id} delay={i * 60}>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="hud-card group h-full p-7 flex flex-col items-center justify-center text-center cursor-pointer"
                        style={{ borderRadius: 0, textDecoration: "none", minHeight: 180, display: "flex" }}
                      >
                        {inner}
                      </a>
                    ) : (
                      <div
                        className="hud-card group h-full p-7 flex flex-col items-center justify-center text-center cursor-default"
                        style={{ borderRadius: 0, minHeight: 180 }}
                      >
                        {inner}
                      </div>
                    )}
                  </Reveal>
                );
              })}
            </div>

            {/* Road services — additional cards with neuro icons */}
            <div className="mt-px grid gap-px sm:grid-cols-2 lg:grid-cols-5">
              {roadServices.map((item, i) => (
                <Reveal key={item.id} delay={i * 55}>
                  <div
                    className="hud-card card-3d group h-full p-6 cursor-default flex flex-col items-center text-center gap-4"
                    style={{ borderRadius: 0 }}
                  >
                    {/* Neuro icon */}
                    <div
                      className="neuro-icon flex items-center justify-center w-14 h-14 flex-shrink-0"
                      style={{ color: "var(--accent)", position: "relative", zIndex: 1 }}
                    >
                      {item.icon}
                    </div>
                    <h3
                      className="text-xs font-bold uppercase tracking-wider text-white leading-tight"
                    >
                      {item.title}
                    </h3>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ═══════════════ 4. DTP — VIDEO BACKGROUND ═══════════════ */}
        <section
          id="road"
          className="relative overflow-hidden"
          style={{ minHeight: "100vh" }}
        >
          {/* ── Full-section video background ── */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            >
              <source src="/section-1.mp4" type="video/mp4" />
            </video>
            {/* Primary dark overlay */}
            <div className="absolute inset-0 bg-black/62" />
            {/* Green tint overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 60% 40%, rgba(0,232,124,0.06) 0%, transparent 55%)",
              }}
            />
            {/* Bottom fade into next section */}
            <div
              className="absolute bottom-0 left-0 right-0 h-40"
              style={{
                background:
                  "linear-gradient(to top, var(--bg-2) 0%, transparent 100%)",
              }}
            />
            {/* Top fade */}
            <div
              className="absolute top-0 left-0 right-0 h-28"
              style={{
                background:
                  "linear-gradient(to bottom, var(--bg) 0%, transparent 100%)",
              }}
            />
            {/* Scan lines texture */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 6px)",
              }}
            />
          </div>

          {/* ── HUD corner brackets ── */}
          <div className="absolute top-8 left-8 w-16 h-16 pointer-events-none z-20" style={{ borderTop: "1px solid rgba(0,232,124,0.4)", borderLeft: "1px solid rgba(0,232,124,0.4)" }} />
          <div className="absolute top-8 right-8 w-16 h-16 pointer-events-none z-20" style={{ borderTop: "1px solid rgba(0,232,124,0.4)", borderRight: "1px solid rgba(0,232,124,0.4)" }} />
          <div className="absolute bottom-8 left-8 w-16 h-16 pointer-events-none z-20" style={{ borderBottom: "1px solid rgba(0,232,124,0.4)", borderLeft: "1px solid rgba(0,232,124,0.4)" }} />
          <div className="absolute bottom-8 right-8 w-16 h-16 pointer-events-none z-20" style={{ borderBottom: "1px solid rgba(0,232,124,0.4)", borderRight: "1px solid rgba(0,232,124,0.4)" }} />

          {/* ── Content over video ── */}
          <div className="relative z-10 flex flex-col justify-center min-h-screen py-28 px-6">
            <div className="mx-auto max-w-7xl w-full">
              <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 items-center">
                {/* Left: content */}
                <div>
                  <Reveal>
                    <SectionTag>МОДУЛЬ // ДТП И ДОРОЖНЫЕ СИТУАЦИИ</SectionTag>
                    <h2 className="hud-title section-heading mb-10 text-4xl sm:text-5xl text-white">
                      ДТП и дорожные
                      <br />
                      <span style={{ color: "var(--accent)" }}>ситуации</span>
                    </h2>
                    <p
                      className="mb-10 text-base leading-relaxed"
                      style={{ color: "rgba(255,255,255,0.55)" }}
                    >
                      Платформа формирует корректный алгоритм действий с момента
                      обращения. Цифровая структура — без хаоса.
                    </p>
                  </Reveal>

                  <div className="space-y-1">
                    {dtpTools.map((tool, i) => (
                      <Reveal key={tool.label} delay={i * 55}>
                        {tool.href ? (
                          <a
                            href={tool.href}
                            className="hover-border flex items-center gap-4 px-5 py-4 group"
                            style={{
                              background: "rgba(16,17,26,0.75)",
                              backdropFilter: "blur(8px)",
                              textDecoration: "none",
                              display: "flex",
                            }}
                          >
                            <div
                              className="w-1 h-1 flex-shrink-0 rounded-full transition-all duration-200 group-hover:shadow-[0_0_8px_var(--accent-glow)]"
                              style={{ background: "var(--accent)" }}
                            />
                            <span
                              className="text-sm font-medium tracking-wide transition-colors duration-200 group-hover:text-white"
                              style={{ color: "rgba(255,255,255,0.75)" }}
                            >
                              {tool.label}
                            </span>
                            <div
                              className="ml-auto flex items-center gap-1 text-xs font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0"
                              style={{ color: "var(--accent)" }}
                            >
                              Открыть
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
                                <line x1="5" y1="12" x2="19" y2="12"/>
                                <polyline points="12 5 19 12 12 19"/>
                              </svg>
                            </div>
                          </a>
                        ) : (
                          <div
                            className="hover-border flex items-center gap-4 px-5 py-4 group cursor-default"
                            style={{ background: "rgba(16,17,26,0.75)", backdropFilter: "blur(8px)" }}
                          >
                            <div
                              className="w-1 h-1 flex-shrink-0 rounded-full transition-all duration-200 group-hover:shadow-[0_0_8px_var(--accent-glow)]"
                              style={{ background: "var(--accent)" }}
                            />
                            <span
                              className="text-sm font-medium tracking-wide"
                              style={{ color: "rgba(255,255,255,0.75)" }}
                            >
                              {tool.label}
                            </span>
                            <div
                              className="ml-auto text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ color: "var(--accent)" }}
                            >
                              →
                            </div>
                          </div>
                        )}
                      </Reveal>
                    ))}
                  </div>
                </div>

                {/* Right: stats over video */}
                <Reveal delay={150} y={40}>
                  <div className="hidden lg:grid grid-cols-2 gap-4">
                    {[
                      { v: "24/7", l: "Поддержка" },
                      { v: "100%", l: "Цифровой формат" },
                      { v: "RU", l: "Федеральный охват" },
                      { v: "0", l: "Очередей и офисов" },
                    ].map((s, i) => (
                      <div
                        key={i}
                        className="p-6 text-center"
                        style={{
                          background: "rgba(6,6,8,0.65)",
                          backdropFilter: "blur(12px)",
                          border: "1px solid rgba(0,232,124,0.15)",
                        }}
                      >
                        <div className="stat-number mb-1" style={{ fontFamily: "var(--font-geist-mono)", fontSize: "2rem" }}>{s.v}</div>
                        <div className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* ═══════════════ 5. EUROPROTOCOL ═══════════════ */}
        <section id="e-protocol" className="py-28 px-6 overflow-hidden neuro-section">
          <div className="neuro-bg-layer" aria-hidden="true">
            <div className="nb-orb-a" style={{ top: "10%", left: "40%" }} />
            <div className="nb-orb-b" />
            <div className="nb-grid" />
            <div className="nb-streak" style={{ animationDelay: "4s" }} />
          </div>
          <div className="mx-auto max-w-7xl" style={{ position: "relative", zIndex: 1 }}>
            <div className="grid gap-16 lg:grid-cols-[1fr_1.4fr] lg:gap-24 items-start">
              {/* Left: heading */}
              <Reveal>
                <SectionTag>ПРОТОКОЛ // ЦИФРОВОЙ ФОРМАТ</SectionTag>
                <h2 className="hud-title section-heading mb-8 text-4xl sm:text-5xl text-white">
                  Европротокол
                  <br />
                  <span style={{ color: "var(--accent)" }}>онлайн</span>
                </h2>
                <p
                  className="text-base leading-relaxed mb-10"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  Цифровой инструмент оформления ДТП без вызова сотрудников
                  ГИБДД. Все шаги структурированы.
                </p>
              </Reveal>

              {/* Right: feature list with neuro icons */}
              <div className="space-y-2">
                {eProtocolFeatures.map((item, i) => (
                  <Reveal key={item.id} delay={i * 50}>
                    <div
                      className="hover-left-accent flex gap-5 items-center px-6 py-4 group cursor-default"
                    >
                      {/* Neuro icon instead of number */}
                      <div
                        className="neuro-icon flex items-center justify-center w-9 h-9 flex-shrink-0"
                        style={{ color: "var(--accent)", position: "relative", zIndex: 1 }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <div
                          className="text-sm font-semibold tracking-wide text-white mb-0.5"
                        >
                          {item.title}
                        </div>
                        <div
                          className="text-xs leading-relaxed"
                          style={{ color: "rgba(255,255,255,0.38)" }}
                        >
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* ═══════════════ 6. INSURANCE ═══════════════ */}
        <section
          id="insurance"
          className="py-28 px-6"
          style={{ background: "var(--bg-2)" }}
        >
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <SectionTag>ФИНАНСЫ // СТРАХОВОЙ МОДУЛЬ</SectionTag>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16">
                <h2 className="hud-title section-heading text-4xl sm:text-5xl lg:text-6xl text-white">
                  Страхование
                </h2>
                <a
                  href="/insurance"
                  className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm font-bold tracking-[0.14em] uppercase flex-shrink-0"
                  style={{ alignSelf: "flex-start" }}
                >
                  Оформить полис
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </a>
              </div>
            </Reveal>

            {/* Калькулятор страхования */}
            <Reveal>
              <div className="mb-12">
                <InsuranceCalculator />
              </div>
            </Reveal>

            <div className="grid gap-px sm:grid-cols-3">
              {insuranceFeatures.map((item, i) => (
                <Reveal key={item.id} delay={i * 70}>
                  <div
                    className="hud-card h-full cursor-default"
                    style={{ borderRadius: 0, padding: item.iconOnly ? "2rem" : "1.75rem" }}
                  >
                    {item.iconOnly ? (
                      /* Icon-only card — centered, large icon */
                      <div className="flex flex-col items-center justify-center h-full gap-5 min-h-[140px]">
                        <div
                          className="neuro-icon flex items-center justify-center w-20 h-20"
                          style={{ color: "var(--accent)", position: "relative", zIndex: 1 }}
                        >
                          {item.icon}
                        </div>
                        <div
                          className="text-[10px] font-bold uppercase tracking-widest text-center"
                          style={{ color: "rgba(255,255,255,0.3)" }}
                        >
                          {item.title}
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Gradient accent top */}
                        <div
                          className="mb-5 h-px w-full"
                          style={{
                            background:
                              "linear-gradient(90deg, var(--accent) 0%, transparent 100%)",
                            opacity: 0.6,
                          }}
                        />
                        {/* Icon */}
                        <div
                          className="neuro-icon flex items-center justify-center w-10 h-10 mb-4"
                          style={{ color: "var(--accent)", position: "relative", zIndex: 1 }}
                        >
                          {item.icon}
                        </div>
                        <h3
                          className="mb-3 text-sm font-bold uppercase tracking-wider text-white"
                        >
                          {item.title}
                        </h3>
                        <p
                          className="text-xs leading-relaxed"
                          style={{ color: "rgba(255,255,255,0.38)" }}
                        >
                          {item.description}
                        </p>
                      </>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ═══════════════ 7. CONSULTATIONS ═══════════════ */}
        <section className="py-28 px-6 neuro-section">
          <div className="neuro-bg-layer" aria-hidden="true">
            <div className="nb-orb-a" style={{ top: "20%", left: "60%" }} />
            <div className="nb-orb-b" style={{ bottom: "10%", right: "30%" }} />
            <div className="nb-grid" />
            <div className="nb-streak" style={{ animationDelay: "7s" }} />
          </div>
          <div className="mx-auto max-w-7xl" style={{ position: "relative", zIndex: 1 }}>
            <Reveal>
              <SectionTag>ПОДДЕРЖКА // 24/7</SectionTag>
              <h2 id="support" className="hud-title section-heading mb-16 text-4xl sm:text-5xl lg:text-6xl text-white" style={{ scrollMarginTop: "1rem" }}>
                Консультации
                <br />
                <span style={{ color: "var(--accent)" }}>и поддержка</span>
              </h2>
            </Reveal>

            <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-12 items-start">
              {/* Left: hotline + feature cards */}
              <div className="space-y-4">
                {/* Hotline */}
                <Reveal>
                  <div
                    className="p-6"
                    style={{
                      border: "1px solid rgba(0,232,124,0.3)",
                      background: "rgba(0,232,124,0.05)",
                      borderLeft: "3px solid var(--accent)",
                    }}
                  >
                    <div className="text-[9px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color: "rgba(0,232,124,0.7)" }}>
                      ГОРЯЧАЯ ЛИНИЯ · 24/7
                    </div>
                    <a
                      href="tel:+78001234567"
                      className="block text-2xl font-bold text-white mb-1 hover:text-[var(--accent)] transition-colors duration-200"
                      style={{ fontFamily: "var(--font-geist-mono)", textDecoration: "none" }}
                    >
                      8-800-XXX-XX-XX
                    </a>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                      Бесплатно по России · Среднее время ответа 30 секунд
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)", animation: "pulse-dot 1.5s ease-in-out infinite" }} />
                      <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "var(--accent)", opacity: 0.7 }}>Операторы онлайн</span>
                    </div>
                  </div>
                </Reveal>

                {/* Feature cards */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {supportFeatures.map((item, i) => (
                    <Reveal key={item.id} delay={i * 65}>
                      <div
                        className="hud-card hud-card-cut h-full p-5 cursor-default bracket-tl"
                        style={{ position: "relative" }}
                      >
                        <div
                          className="mb-4 flex items-center justify-center w-8 h-8 text-sm font-bold"
                          style={{
                            border: "1px solid var(--accent-border)",
                            color: "var(--accent)",
                            clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                          }}
                        >
                          {item.icon}
                        </div>
                        <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-white">{item.title}</h3>
                        <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.38)" }}>{item.description}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>

              {/* Right: embedded chat */}
              <Reveal delay={120}>
                <ConsultChat />
              </Reveal>
            </div>
          </div>
        </section>

        <Divider />

        {/* ═══════════════ 8. HOW IT WORKS ═══════════════ */}
        <section
          id="how"
          className="py-28 px-6"
          style={{ background: "var(--bg-2)" }}
        >
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <SectionTag>АЛГОРИТМ // ПОСЛЕДОВАТЕЛЬНОСТЬ</SectionTag>
              <h2 className="hud-title section-heading mb-16 text-4xl sm:text-5xl lg:text-6xl text-white">
                Как это
                <br />
                <span style={{ color: "var(--accent)" }}>работает</span>
              </h2>
            </Reveal>

            {/* Steps — 3 items with arrows */}
            <div className="flex flex-col lg:flex-row items-stretch gap-0">
              {howSteps.map((step, i) => (
                <div key={step.num} className="flex items-center flex-1">
                  <Reveal delay={i * 90} className="flex-1">
                    <div
                      className="hover-step relative flex flex-col gap-5 p-7 group cursor-default h-full"
                    >
                      {/* Neuro icon */}
                      <div
                        className="neuro-icon flex items-center justify-center w-12 h-12 flex-shrink-0"
                        style={{ color: "var(--accent)", position: "relative", zIndex: 1 }}
                      >
                        {step.icon}
                      </div>

                      {/* Step number */}
                      <span
                        className="step-num-dim text-3xl font-bold leading-none select-none"
                        style={{
                          color: "var(--accent)",
                          fontFamily: "var(--font-geist-mono)",
                        }}
                      >
                        {step.num}
                      </span>

                      <p
                        className="text-sm leading-relaxed font-medium"
                        style={{ color: "rgba(255,255,255,0.65)" }}
                      >
                        {step.text}
                      </p>

                      {/* Top-left corner accent */}
                      <div
                        className="absolute top-0 left-0 w-3 h-3"
                        style={{
                          borderTop: "1px solid var(--accent-border)",
                          borderLeft: "1px solid var(--accent-border)",
                        }}
                      />
                    </div>
                  </Reveal>

                  {/* Arrow between steps */}
                  {i < howSteps.length - 1 && (
                    <div
                      className="hidden lg:flex flex-shrink-0 items-center px-2"
                      aria-hidden="true"
                    >
                      <svg width="32" height="16" viewBox="0 0 32 16" fill="none">
                        <line x1="0" y1="8" x2="24" y2="8" stroke="rgba(0,232,124,0.3)" strokeWidth="1" strokeDasharray="3 3" />
                        <polyline points="20,4 28,8 20,12" stroke="rgba(0,232,124,0.45)" strokeWidth="1" fill="none" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ═══════════════ 9. ABOUT ═══════════════ */}
        <section id="about" className="py-28 px-6 neuro-section">
          <div className="neuro-bg-layer" aria-hidden="true">
            <div className="nb-orb-a" style={{ top: "30%", left: "50%" }} />
            <div className="nb-orb-b" style={{ top: "0%", right: "20%" }} />
            <div className="nb-grid" />
            <div className="nb-streak-2" />
          </div>
          <div className="mx-auto max-w-7xl" style={{ position: "relative", zIndex: 1 }}>
            <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
              {/* Left: heading + description */}
              <Reveal>
                <SectionTag>КОМПАНИЯ // О НАС</SectionTag>
                <h2 className="hud-title section-heading mb-8 text-4xl sm:text-5xl text-white">
                  О нас
                </h2>
                <p
                  className="text-lg leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  Е-Спасатель — единый сервис поддержки автомобилистов.
                </p>
              </Reveal>

              {/* Right: service cards */}
              <div className="space-y-2">
                {aboutServices.map((svc, i) => (
                  <Reveal key={svc.id} delay={i * 65 + 80}>
                    <div
                      className="about-svc-item group flex items-center gap-4 px-5 py-4 cursor-default"
                      style={{
                        background: "linear-gradient(135deg, rgba(0,18,8,0.92) 0%, rgba(0,28,14,0.85) 100%)",
                        border: "1px solid rgba(0,232,124,0.12)",
                      }}
                    >
                      {/* Neuro icon */}
                      <div
                        className="neuro-icon flex-shrink-0 flex items-center justify-center w-10 h-10"
                        style={{ color: "var(--accent)", position: "relative", zIndex: 1 }}
                      >
                        {svc.icon}
                      </div>
                      {/* Service name */}
                      <span
                        className="text-sm font-medium leading-snug"
                        style={{ color: "rgba(255,255,255,0.72)" }}
                      >
                        {svc.title}
                      </span>
                      {/* Arrow hint on hover */}
                      <div
                        className="ml-auto text-xs opacity-0 group-hover:opacity-100 flex-shrink-0"
                        style={{
                          color: "var(--accent)",
                          transition: "opacity 0.2s ease",
                        }}
                      >
                        →
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* ═══════════════ 10. GUARANTEES ═══════════════ */}
        <section
          id="guarantees"
          className="py-28 px-6"
          style={{ background: "var(--bg-2)" }}
        >
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <SectionTag>СТАНДАРТЫ // ГАРАНТИИ ПЛАТФОРМЫ</SectionTag>
              <h2 className="hud-title section-heading mb-16 text-4xl sm:text-5xl lg:text-6xl text-white">
                Гарантии
              </h2>
            </Reveal>

            <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
              {guarantees.map((item, i) => (
                <Reveal key={item.id} delay={i * 65}>
                  <div
                    className="hud-card h-full p-8 cursor-default"
                    style={{ borderRadius: 0 }}
                  >
                    {/* Checkmark accent */}
                    <div
                      className="mb-6 flex items-center justify-center w-9 h-9"
                      style={{
                        border: "1px solid var(--accent-border)",
                        clipPath:
                          "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        strokeLinecap="square"
                        style={{ color: "var(--accent)" }}
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-white">
                      {item.title}
                    </h3>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: "rgba(255,255,255,0.38)" }}
                    >
                      {item.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ═══════════════ 11. CONTACTS ═══════════════ */}
        <section id="contacts" className="py-28 px-6 neuro-section">
          <div className="neuro-bg-layer" aria-hidden="true">
            <div className="nb-orb-a" />
            <div className="nb-orb-b" />
            <div className="nb-grid" />
            <div className="nb-streak" />
          </div>
          <div className="mx-auto max-w-7xl" style={{ position: "relative", zIndex: 1 }}>
            {/* CTA headline */}
            <Reveal>
              <div className="mb-16 max-w-2xl">
                <SectionTag>СВЯЗЬ // КОНТАКТНЫЙ МОДУЛЬ</SectionTag>
                <h2 className="hud-title mb-5 text-4xl sm:text-5xl lg:text-6xl text-white">
                  Начните сейчас
                </h2>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.38)" }}
                >
                  Выберите удобный способ связи — ответим в течение нескольких
                  минут.
                </p>
              </div>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-3">
              {/* Phone */}
              <Reveal delay={0}>
                <a
                  href="tel:+78001234567"
                  className="hud-card flex flex-col p-8 cursor-pointer group"
                  style={{ borderRadius: 0 }}
                >
                  <div
                    className="mb-5 flex items-center justify-center w-12 h-12 transition-all duration-300"
                    style={{
                      border: "1px solid var(--border-bright)",
                      clipPath:
                        "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                    }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      <path
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                        strokeWidth={1.5}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-white">
                    Телефон
                  </h3>
                  <p
                    className="text-xs tracking-wide"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    Звонок по России
                  </p>
                </a>
              </Reveal>

              {/* Online application — highlighted */}
              <Reveal delay={80}>
                <HelpModalTrigger
                  className="hover-contact-primary relative flex flex-col p-8 cursor-pointer group overflow-hidden w-full text-left"
                  style={{ borderRadius: 0, background: "none", border: "none" }}
                >
                  {/* Glow corner */}
                  <div
                    className="absolute top-0 right-0 w-16 h-16 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle at top right, rgba(0,232,124,0.2) 0%, transparent 70%)",
                    }}
                  />
                  <div
                    className="mb-5 flex items-center justify-center w-12 h-12 animate-glow-pulse"
                    style={{
                      border: "1px solid var(--accent-border)",
                      background: "rgba(0,232,124,0.1)",
                      clipPath:
                        "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                    }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: "var(--accent)" }}
                    >
                      <path
                        strokeLinecap="square"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-white">
                    Онлайн-заявка
                  </h3>
                  <p
                    className="text-xs tracking-wide"
                    style={{ color: "var(--accent)", opacity: 0.7 }}
                  >
                    Быстро и удобно
                  </p>
                </HelpModalTrigger>
              </Reveal>

              {/* Callback */}
              <Reveal delay={160}>
                <a
                  href="#"
                  className="hud-card flex flex-col p-8 cursor-pointer group"
                  style={{ borderRadius: 0 }}
                >
                  <div
                    className="mb-5 flex items-center justify-center w-12 h-12"
                    style={{
                      border: "1px solid var(--border-bright)",
                      clipPath:
                        "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                    }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      <path
                        strokeLinecap="square"
                        strokeWidth={1.5}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-white">
                    Обратный звонок
                  </h3>
                  <p
                    className="text-xs tracking-wide"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    Мы перезвоним вам
                  </p>
                </a>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer
        className="px-6 pt-12 pb-8"
        style={{
          borderTop: "1px solid var(--border)",
          background: "var(--bg-2)",
        }}
      >
        <div className="mx-auto max-w-7xl">
          {/* Top row */}
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-5 h-5 flex items-center justify-center" style={{ border: "1px solid var(--accent)" }}>
                  <div className="w-2 h-2" style={{ background: "var(--accent)" }} />
                </div>
                <span className="text-sm font-bold tracking-[0.12em] uppercase text-white">
                  Е<span style={{ color: "var(--accent)" }}>-</span>Спасатель
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.3)" }}>
                Цифровая платформа помощи автомобилистам. Работаем 24/7 по всей России.
              </p>
              <div className="flex items-center gap-2 mt-4">
                <div className="w-1 h-1 rounded-full animate-pulse-dot" style={{ background: "var(--accent)" }} />
                <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: "var(--accent)", opacity: 0.5, fontFamily: "var(--font-geist-mono)" }}>
                  ALL SYSTEMS OPERATIONAL
                </span>
              </div>
            </div>

            {/* Services */}
            <div>
              <div className="text-[9px] font-bold tracking-[0.22em] uppercase mb-4" style={{ color: "rgba(0,232,124,0.6)" }}>Услуги</div>
              <ul className="space-y-2.5">
                {[
                  { label: "ОСАГО онлайн", href: "/osago" },
                  { label: "Европротокол онлайн", href: "/europrotocol" },
                  { label: "Вызов эвакуатора", href: "/evacuation" },
                  { label: "Помощь при ДТП", href: "/dtp" },
                ].map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="footer-link text-xs">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <div className="text-[9px] font-bold tracking-[0.22em] uppercase mb-4" style={{ color: "rgba(0,232,124,0.6)" }}>Документы</div>
              <ul className="space-y-2.5">
                {[
                  { label: "Политика конфиденциальности", href: "/privacy" },
                  { label: "Политика Cookie", href: "/cookies" },
                ].map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="footer-link text-xs">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacts */}
            <div>
              <div className="text-[9px] font-bold tracking-[0.22em] uppercase mb-4" style={{ color: "rgba(0,232,124,0.6)" }}>Контакты</div>
              <ul className="space-y-2.5">
                <li>
                  <a href="tel:+78001234567" className="footer-link text-xs">8-800-XXX-XX-XX</a>
                </li>
                <li className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Бесплатно · 24/7</li>
                <li>
                  <a href="mailto:info@e-saver.ru" className="footer-link text-xs">info@e-saver.ru</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full mb-6" style={{ background: "rgba(255,255,255,0.05)" }} />

          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-geist-mono)" }}>
              © 2026 Е-Спасатель · ООО «Е-Спасатель» · ИНН 7700000000
            </div>
            <div className="flex items-center gap-4">
              <a href="/privacy" className="footer-link-sm text-[10px] tracking-wide">Конфиденциальность</a>
              <span style={{ color: "rgba(255,255,255,0.1)" }}>·</span>
              <a href="/cookies" className="footer-link-sm text-[10px] tracking-wide">Cookie</a>
              <span style={{ color: "rgba(255,255,255,0.1)" }}>·</span>
              <div className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.15)", fontFamily: "var(--font-geist-mono)" }}>
                RU-FED · v2.4.7
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
