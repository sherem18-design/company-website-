"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import InsuranceCalculator from "@/components/InsuranceCalculator";

/* ─── Insurance types ─── */
const INSURANCE_TYPES = [
  {
    id: "kasko",
    title: "КАСКО",
    subtitle: "Полное страхование",
    desc: "Ущерб, угон, стихия, ДТП по вашей вине",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <path d="M12 2L4 5v7c0 4.4 3.5 8.5 8 10 4.5-1.5 8-5.6 8-10V5L12 2z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
    color: "#00e87c",
  },
  {
    id: "kasko-lite",
    title: "КАСКО-лайт",
    subtitle: "Минимальное покрытие",
    desc: "Только угон + полная гибель автомобиля",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <path d="M12 2L4 5v7c0 4.4 3.5 8.5 8 10 4.5-1.5 8-5.6 8-10V5L12 2z"/>
        <line x1="12" y1="8" x2="12" y2="13"/>
      </svg>
    ),
    color: "#00e87c",
  },
  {
    id: "osago",
    title: "ОСАГО",
    subtitle: "Обязательное страхование",
    desc: "Гражданская ответственность водителя",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <rect x="4" y="2" width="16" height="20" rx="0.5"/>
        <line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/>
      </svg>
    ),
    color: "#00e87c",
  },
  {
    id: "dsago",
    title: "ДСАГО",
    subtitle: "Доп. ответственность",
    desc: "Расширение лимита ОСАГО до 3–30 млн ₽",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <path d="M12 2L4 5v7c0 4.4 3.5 8.5 8 10 4.5-1.5 8-5.6 8-10V5L12 2z"/>
        <line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    ),
    color: "#00e87c",
  },
  {
    id: "gap",
    title: "GAP",
    subtitle: "Защита инвестиции",
    desc: "Возмещает разницу между ценой и выплатой",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <rect x="2" y="3" width="20" height="15" rx="0.5"/>
        <polyline points="8 21 12 17 16 21"/>
        <polyline points="6 12 9 9 12 11 15 8 18 10" strokeWidth="1.2"/>
      </svg>
    ),
    color: "#00e87c",
  },
  {
    id: "green",
    title: "Зелёная карта",
    subtitle: "Въезд за рубеж",
    desc: "ОСАГО для поездок в страны ЕС и СНГ",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
      </svg>
    ),
    color: "#00e87c",
  },
  {
    id: "accident",
    title: "НС водителя",
    subtitle: "Несчастный случай",
    desc: "Выплата при травме, инвалидности, гибели",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    ),
    color: "#00e87c",
  },
  {
    id: "other",
    title: "Другое",
    subtitle: "Свой запрос",
    desc: "Специальные условия или комбинация продуктов",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
    color: "#00e87c",
  },
];

const STEPS = [
  { num: "01", title: "Тип страхования", tag: "ВЫБОР ПРОДУКТА" },
  { num: "02", title: "Автомобиль", tag: "ДАННЫЕ ТС" },
  { num: "03", title: "Владелец", tag: "КОНТАКТНЫЕ ДАННЫЕ" },
  { num: "04", title: "Параметры", tag: "НАСТРОЙКИ ПОЛИСА" },
  { num: "05", title: "Отправка", tag: "ИТОГ" },
];

function Field({ label, name, value, onChange, placeholder, type = "text", hint, required }: {
  label: string; name: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; hint?: string; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>
        {label}{required && <span style={{ color: "var(--accent)", marginLeft: 4 }}>*</span>}
      </label>
      <input id={name} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoComplete="off"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "10px 14px", fontSize: "0.875rem", fontFamily: "var(--font-space-grotesk),sans-serif", outline: "none", transition: "border-color 0.2s, background 0.2s", borderRadius: 0, width: "100%" }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(0,232,124,0.5)"; e.currentTarget.style.background = "rgba(0,232,124,0.04)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
      />
      {hint && <span className="text-[9px] tracking-wide" style={{ color: "rgba(255,255,255,0.28)" }}>{hint}</span>}
    </div>
  );
}

function Sub({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="h-px w-4 flex-shrink-0" style={{ background: "var(--accent)", opacity: 0.6 }} />
      <span className="text-[9px] font-bold tracking-[0.22em] uppercase" style={{ color: "var(--accent)", opacity: 0.7 }}>{title}</span>
      <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <span className="text-[9px] font-bold tracking-widest uppercase w-36 flex-shrink-0" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</span>
      <span className="text-sm text-white">{value}</span>
    </div>
  );
}

export default function InsurancePage() {
  const [step, setStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const handleSubmitForm = async () => {
    if (!form.consent) return;
    setSending(true);
    try {
      await fetch("/api/send-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`.trim() || "Не указано",
          phone: form.phone || "Не указан",
          service: form.insuranceType || "Страхование",
          desc: [
            form.brand && `Авто: ${form.brand} ${form.model} ${form.year}`,
            form.plate && `Гос. номер: ${form.plate}`,
            form.email && `Email: ${form.email}`,
            form.comment && `Комментарий: ${form.comment}`,
          ].filter(Boolean).join(", "),
          source: "Форма страхования",
        }),
      });
    } catch { /* продолжаем в любом случае */ }
    setSending(false);
    setSubmitted(true);
  };

  const [form, setForm] = useState({
    insuranceType: "",
    brand: "", model: "", year: "", plate: "", vin: "", price: "",
    firstName: "", lastName: "", phone: "", email: "",
    startDate: "", period: "12",
    franchise: "", coverage: "", comment: "",
    consent: false,
  });

  useEffect(() => { setMounted(true); }, []);

  const set = (k: keyof typeof form) => (v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const goTo = (s: number) => {
    setStep(s);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const selectedType = INSURANCE_TYPES.find((t) => t.id === form.insuranceType);

  if (!mounted) return null;

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: "var(--bg)" }}>
        <div className="relative mb-8">
          <div className="absolute inset-0 blur-3xl" style={{ background: "radial-gradient(ellipse, rgba(0,232,124,0.25) 0%, transparent 70%)" }} />
          <Image src="/emblema.png" alt="" width={100} height={100} style={{ position: "relative", filter: "drop-shadow(0 0 24px rgba(0,232,124,0.5))" }} />
        </div>
        <div className="mb-3 inline-flex items-center gap-2">
          <div className="h-px w-6" style={{ background: "var(--accent)" }} />
          <span className="hud-label text-[9px]">СТРАХОВАНИЕ // ЗАЯВКА ПРИНЯТА</span>
          <div className="h-px w-6" style={{ background: "var(--accent)" }} />
        </div>
        <h1 className="hud-title text-3xl sm:text-4xl text-white mb-4">Заявка принята!</h1>
        <p className="text-sm mb-8 max-w-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
          Наш специалист рассчитает стоимость {selectedType?.title} и свяжется с вами в течение 15 минут для оформления полиса.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/" className="btn-primary px-8 py-3 text-sm font-bold tracking-widest uppercase" style={{ display: "inline-flex", alignItems: "center" }}>На главную</Link>
          <button onClick={() => { setSubmitted(false); setStep(0); setForm((f) => ({ ...f, insuranceType: "" })); }} className="btn-neon px-8 py-3 text-sm font-bold tracking-widest uppercase">
            Новая заявка
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="fixed inset-0 pointer-events-none z-0">
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 20% 30%, rgba(0,232,124,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(0,232,124,0.03) 0%, transparent 50%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,232,124,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,232,124,0.025) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 sticky top-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(6,6,8,0.92)", backdropFilter: "blur(12px)" }}>
        <Link href="/" className="flex items-center gap-3" style={{ textDecoration: "none" }}>
          <div className="flex items-center justify-center w-8 h-8" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
          </div>
          <span className="text-[9px] font-bold tracking-widest uppercase hidden sm:block" style={{ color: "rgba(255,255,255,0.3)" }}>Назад</span>
        </Link>
        <div className="flex items-center gap-3">
          <Image src="/emblema.png" alt="Е-Спасатель" width={32} height={32} style={{ opacity: 0.85 }} />
          <div>
            <div className="text-[9px] font-bold tracking-widest uppercase" style={{ color: "var(--accent)" }}>Е-Спасатель</div>
            <div className="text-[8px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>Страхование</div>
          </div>
        </div>
        <div className="text-[8px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.2)" }}>РФ · 2025</div>
      </header>

      <div ref={topRef} className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 py-10 pb-24">
        {/* Title */}
        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-3">
            <div className="h-px w-6" style={{ background: "var(--accent)" }} />
            <span className="hud-label text-[9px]">ФИНАНСЫ // СТРАХОВОЙ МОДУЛЬ</span>
          </div>
          <h1 className="hud-title text-3xl sm:text-5xl text-white mb-3">
            Страхование<br /><span style={{ color: "var(--accent)" }}>автомобиля</span>
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)", maxWidth: "480px" }}>
            Выберите нужный продукт — рассчитаем стоимость и оформим полис в лучших страховых компаниях России.
          </p>
        </div>

        {/* ── Калькулятор с подбором цен ── */}
        <div className="mb-12">
          <InsuranceCalculator />
        </div>

        {/* Разделитель */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.2)" }}>
            или заполните детальную заявку
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
        </div>

        {/* Step nav */}
        <div className="mb-8">
          <div className="flex gap-1 overflow-x-auto pb-2">
            {STEPS.map((s, i) => (
              <button key={s.num} onClick={() => goTo(i)} className="flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 transition-all duration-300"
                style={{ background: step === i ? "rgba(0,232,124,0.08)" : "rgba(255,255,255,0.02)", border: step === i ? "1px solid rgba(0,232,124,0.35)" : "1px solid rgba(255,255,255,0.06)", color: step === i ? "var(--accent)" : "rgba(255,255,255,0.3)", minWidth: 80 }}>
                <span className="font-bold text-base" style={{ fontFamily: "var(--font-geist-mono)", color: step === i ? "var(--accent)" : i < step ? "rgba(0,232,124,0.5)" : "rgba(255,255,255,0.2)" }}>{i < step ? "✓" : s.num}</span>
                <span className="text-[8px] font-bold tracking-[0.14em] uppercase text-center leading-tight">{s.title}</span>
              </button>
            ))}
          </div>
          <div className="h-px w-full mt-2" style={{ background: "rgba(255,255,255,0.04)" }}>
            <div className="h-full transition-all duration-500" style={{ width: `${(step / (STEPS.length - 1)) * 100}%`, background: "linear-gradient(90deg, var(--accent), rgba(0,232,124,0.5))", boxShadow: "0 0 8px var(--accent-glow)" }} />
          </div>
        </div>

        {/* Content */}
        <div key={step} style={{ animation: "fadeInUp 0.35s ease forwards" }}>
          <div className="mb-6 flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ border: "1px solid rgba(0,232,124,0.35)", background: "rgba(0,232,124,0.07)", color: "var(--accent)", fontFamily: "var(--font-geist-mono)" }}>{STEPS[step].num}</div>
            <div>
              <div className="text-[8px] font-bold tracking-[0.22em] uppercase" style={{ color: "rgba(0,232,124,0.6)" }}>{STEPS[step].tag}</div>
              <div className="text-lg font-bold text-white uppercase tracking-wide">{STEPS[step].title}</div>
            </div>
          </div>

          {/* ── STEP 0: Insurance type ── */}
          {step === 0 && (
            <div className="space-y-4">
              <p className="text-xs leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
                Выберите тип страхования. Если не знаете какой нужен — выберите «Другое» и опишите ситуацию, специалист подберёт оптимальный вариант.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {INSURANCE_TYPES.map((t) => (
                  <button key={t.id} onClick={() => set("insuranceType")(t.id)}
                    className="text-left flex items-start gap-4 p-4 transition-all duration-200"
                    style={{ border: form.insuranceType === t.id ? "1px solid rgba(0,232,124,0.5)" : "1px solid rgba(255,255,255,0.07)", background: form.insuranceType === t.id ? "rgba(0,232,124,0.07)" : "rgba(255,255,255,0.02)" }}
                  >
                    <div className="neuro-icon flex-shrink-0 flex items-center justify-center w-10 h-10" style={{ color: "var(--accent)", position: "relative", zIndex: 1 }}>
                      {t.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-bold text-white">{t.title}</span>
                        <span className="text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5" style={{ background: "rgba(0,232,124,0.1)", color: "var(--accent)", border: "1px solid rgba(0,232,124,0.2)" }}>{t.subtitle}</span>
                      </div>
                      <p className="text-[11px] leading-snug" style={{ color: "rgba(255,255,255,0.4)" }}>{t.desc}</p>
                    </div>
                    {form.insuranceType === t.id && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" className="flex-shrink-0 mt-1" style={{ color: "var(--accent)" }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 1: Vehicle ── */}
          {step === 1 && (
            <div className="space-y-5">
              {selectedType && (
                <div className="flex items-center gap-3 p-3 mb-2" style={{ background: "rgba(0,232,124,0.06)", border: "1px solid rgba(0,232,124,0.2)" }}>
                  <div style={{ color: "var(--accent)" }}>{selectedType.icon}</div>
                  <div>
                    <span className="text-xs font-bold text-white">{selectedType.title}</span>
                    <span className="text-[10px] ml-2" style={{ color: "rgba(255,255,255,0.4)" }}>{selectedType.subtitle}</span>
                  </div>
                </div>
              )}
              <Sub title="Марка и модель" />
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Марка" name="brand" value={form.brand} onChange={set("brand")} placeholder="Toyota" required />
                <Field label="Модель" name="model" value={form.model} onChange={set("model")} placeholder="Camry" required />
                <Field label="Год выпуска" name="year" value={form.year} onChange={set("year")} placeholder="2021" type="number" required />
              </div>
              <Sub title="Идентификация" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Гос. номер" name="plate" value={form.plate} onChange={set("plate")} placeholder="А 123 ВС 77" />
                <Field label="VIN / № кузова" name="vin" value={form.vin} onChange={set("vin")} placeholder="WVWZZZ3BZ..." hint="17 символов" />
              </div>
              {(form.insuranceType === "kasko" || form.insuranceType === "kasko-lite" || form.insuranceType === "gap") && (
                <>
                  <Sub title="Стоимость автомобиля" />
                  <Field label="Рыночная стоимость ТС (₽)" name="price" value={form.price} onChange={set("price")} placeholder="2 500 000" type="number" hint="Влияет на стоимость КАСКО и GAP" required />
                </>
              )}
            </div>
          )}

          {/* ── STEP 2: Owner ── */}
          {step === 2 && (
            <div className="space-y-5">
              <Sub title="ФИО" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Фамилия" name="lastName" value={form.lastName} onChange={set("lastName")} placeholder="Иванов" required />
                <Field label="Имя" name="firstName" value={form.firstName} onChange={set("firstName")} placeholder="Иван" required />
              </div>
              <Sub title="Контакты" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Телефон" name="phone" value={form.phone} onChange={set("phone")} placeholder="+7 (___) ___-__-__" type="tel" required />
                <Field label="Email" name="email" value={form.email} onChange={set("email")} placeholder="ivan@mail.ru" type="email" />
              </div>
            </div>
          )}

          {/* ── STEP 3: Policy params ── */}
          {step === 3 && (
            <div className="space-y-5">
              <Sub title="Период страхования" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Дата начала" name="startDate" value={form.startDate} onChange={set("startDate")} type="date" required />
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>Срок<span style={{ color: "var(--accent)", marginLeft: 4 }}>*</span></label>
                  <div className="flex gap-2">
                    {["3", "6", "12"].map((m) => (
                      <button key={m} onClick={() => set("period")(m)} className="flex-1 py-2.5 text-sm font-bold tracking-wide uppercase transition-all duration-200"
                        style={{ border: form.period === m ? "1px solid rgba(0,232,124,0.5)" : "1px solid rgba(255,255,255,0.1)", background: form.period === m ? "rgba(0,232,124,0.1)" : "transparent", color: form.period === m ? "var(--accent)" : "rgba(255,255,255,0.4)" }}>
                        {m} мес.
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {(form.insuranceType === "kasko" || form.insuranceType === "kasko-lite") && (
                <>
                  <Sub title="Параметры КАСКО" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>Франшиза</label>
                      <div className="flex gap-2 flex-wrap">
                        {["0", "15 000", "30 000", "50 000"].map((f) => (
                          <button key={f} onClick={() => set("franchise")(f)} className="px-3 py-2 text-xs font-bold tracking-wide uppercase transition-all duration-200"
                            style={{ border: form.franchise === f ? "1px solid rgba(0,232,124,0.5)" : "1px solid rgba(255,255,255,0.1)", background: form.franchise === f ? "rgba(0,232,124,0.1)" : "transparent", color: form.franchise === f ? "var(--accent)" : "rgba(255,255,255,0.4)" }}>
                            {f === "0" ? "Без франшизы" : `${f} ₽`}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>Покрытие</label>
                      <div className="flex gap-2 flex-wrap">
                        {["Ущерб + Угон", "Только ущерб", "Только угон"].map((c) => (
                          <button key={c} onClick={() => set("coverage")(c)} className="px-3 py-2 text-xs font-bold tracking-wide uppercase transition-all duration-200"
                            style={{ border: form.coverage === c ? "1px solid rgba(0,232,124,0.5)" : "1px solid rgba(255,255,255,0.1)", background: form.coverage === c ? "rgba(0,232,124,0.1)" : "transparent", color: form.coverage === c ? "var(--accent)" : "rgba(255,255,255,0.4)" }}>
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              <Sub title="Комментарий к заявке" />
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>Дополнительные пожелания</label>
                <textarea value={form.comment} onChange={(e) => set("comment")(e.target.value)} placeholder="Укажите особые требования к полису, желаемые страховые компании, вопросы по стоимости..." rows={3}
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "10px 14px", fontSize: "0.875rem", fontFamily: "var(--font-space-grotesk),sans-serif", outline: "none", resize: "vertical", borderRadius: 0, width: "100%" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(0,232,124,0.5)"; e.currentTarget.style.background = "rgba(0,232,124,0.04)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                />
              </div>
            </div>
          )}

          {/* ── STEP 4: Review ── */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <Sub title="Тип страхования" />
                <div className="mt-2">
                  <ReviewRow label="Продукт" value={`${selectedType?.title || ""} — ${selectedType?.subtitle || ""}`} />
                </div>
              </div>
              <div className="p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <Sub title="Автомобиль" />
                <div className="mt-2">
                  <ReviewRow label="Марка/Модель" value={`${form.brand} ${form.model}`} />
                  <ReviewRow label="Год" value={form.year} />
                  <ReviewRow label="Гос. номер" value={form.plate} />
                  <ReviewRow label="VIN" value={form.vin} />
                  {form.price && <ReviewRow label="Стоимость" value={`${Number(form.price).toLocaleString("ru-RU")} ₽`} />}
                </div>
              </div>
              <div className="p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <Sub title="Контакт" />
                <div className="mt-2">
                  <ReviewRow label="Имя" value={`${form.lastName} ${form.firstName}`} />
                  <ReviewRow label="Телефон" value={form.phone} />
                  <ReviewRow label="Email" value={form.email} />
                </div>
              </div>
              <div className="p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <Sub title="Полис" />
                <div className="mt-2">
                  <ReviewRow label="Дата начала" value={form.startDate} />
                  <ReviewRow label="Срок" value={`${form.period} месяцев`} />
                  {form.franchise && <ReviewRow label="Франшиза" value={form.franchise === "0" ? "Без франшизы" : `${form.franchise} ₽`} />}
                  {form.coverage && <ReviewRow label="Покрытие" value={form.coverage} />}
                  {form.comment && <ReviewRow label="Пожелания" value={form.comment} />}
                </div>
              </div>

              {/* Consent */}
              <label className="flex items-start gap-3 cursor-pointer p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex-shrink-0 w-5 h-5 border flex items-center justify-center transition-all duration-200 mt-0.5"
                  style={{ borderColor: form.consent ? "var(--accent)" : "rgba(255,255,255,0.2)", background: form.consent ? "rgba(0,232,124,0.15)" : "transparent" }}
                  onClick={() => set("consent")(!form.consent)}>
                  {form.consent && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" style={{ color: "var(--accent)" }}><polyline points="20 6 9 17 4 12" /></svg>}
                </div>
                <span className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Согласен на обработку персональных данных в соответствии с{" "}
                  <Link href="/privacy" className="underline" style={{ color: "rgba(0,232,124,0.7)" }}>Политикой конфиденциальности</Link>
                </span>
              </label>
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex gap-3 mt-10 flex-wrap">
            {step > 0 && (
              <button onClick={() => goTo(step - 1)} className="btn-neon flex items-center gap-2 px-6 py-3 text-sm font-bold tracking-[0.14em] uppercase">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                Назад
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button onClick={() => goTo(step + 1)} disabled={step === 0 && !form.insuranceType}
                className="flex items-center gap-2 px-8 py-3 text-sm font-bold tracking-[0.14em] uppercase ml-auto transition-all duration-300"
                style={{ background: (step === 0 && !form.insuranceType) ? "rgba(255,255,255,0.05)" : "var(--accent)", color: (step === 0 && !form.insuranceType) ? "rgba(255,255,255,0.2)" : "#040508", cursor: (step === 0 && !form.insuranceType) ? "not-allowed" : "pointer" }}>
                Далее
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            ) : (
              <button onClick={handleSubmitForm} disabled={!form.consent || sending}
                className="flex items-center gap-2 px-8 py-3 text-sm font-bold tracking-[0.14em] uppercase ml-auto transition-all duration-300"
                style={{ background: form.consent && !sending ? "var(--accent)" : "rgba(255,255,255,0.05)", color: form.consent && !sending ? "#040508" : "rgba(255,255,255,0.2)", cursor: form.consent && !sending ? "pointer" : "not-allowed", boxShadow: form.consent && !sending ? "0 0 32px rgba(0,232,124,0.3)" : "none" }}>
                {sending ? "Отправка..." : "Оформить заявку"}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><polyline points="20 6 9 17 4 12"/></svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  );
}
