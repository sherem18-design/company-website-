"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const PROBLEM_TYPES = [
  { id: "dtp", label: "ДТП", icon: "💥", desc: "Транспортное средство повреждено в аварии" },
  { id: "breakdown", label: "Поломка", icon: "⚙️", desc: "Автомобиль не заводится или не едет" },
  { id: "stuck", label: "Застрял", icon: "🚧", desc: "Застрял в грязи, снегу, яме" },
  { id: "flat", label: "Колёса", icon: "🔧", desc: "Спущено колесо, нет запаски" },
  { id: "parking", label: "Нарушение", icon: "🚔", desc: "Эвакуация с штрафстоянки" },
  { id: "other", label: "Другое", icon: "❓", desc: "Иная причина" },
];

function Field({
  label, name, value, onChange, placeholder, type = "text", hint, required, large,
}: {
  label: string; name: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; hint?: string; required?: boolean; large?: boolean;
}) {
  const sharedStyle = {
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff", padding: "10px 14px", fontSize: "0.875rem",
    fontFamily: "var(--font-space-grotesk), sans-serif", outline: "none",
    transition: "border-color 0.2s, background 0.2s", borderRadius: 0, width: "100%",
  };
  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "rgba(0,232,124,0.5)";
    e.currentTarget.style.background = "rgba(0,232,124,0.04)";
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>
        {label}{required && <span style={{ color: "var(--accent)", marginLeft: 4 }}>*</span>}
      </label>
      {large ? (
        <textarea id={name} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3}
          style={{ ...sharedStyle, resize: "vertical" }} onFocus={onFocus} onBlur={onBlur} />
      ) : (
        <input id={name} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoComplete="off"
          style={sharedStyle} onFocus={onFocus} onBlur={onBlur} />
      )}
      {hint && <span className="text-[9px] tracking-wide" style={{ color: "rgba(255,255,255,0.28)" }}>{hint}</span>}
    </div>
  );
}

/* ─── Timer countdown ─── */
function ResponseTimer() {
  const [seconds, setSeconds] = useState(180);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const pct = ((180 - seconds) / 180) * 100;
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-20 h-20">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(0,232,124,0.1)" strokeWidth="4" />
          <circle cx="40" cy="40" r="34" fill="none" stroke="var(--accent)" strokeWidth="4"
            strokeDasharray={`${2 * Math.PI * 34}`}
            strokeDashoffset={`${2 * Math.PI * 34 * (pct / 100)}`}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold" style={{ color: "var(--accent)", fontFamily: "var(--font-geist-mono)", lineHeight: 1 }}>
            {m}:{String(s).padStart(2, "0")}
          </span>
          <span className="text-[7px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>мин</span>
        </div>
      </div>
      <span className="text-[10px] tracking-widest uppercase text-center" style={{ color: "rgba(255,255,255,0.4)" }}>
        {seconds > 0 ? "Среднее время ответа" : "Соединяем с оператором..."}
      </span>
    </div>
  );
}

export default function EvacuationPage() {
  const [mounted, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    problemType: "",
    city: "",
    address: "",
    landmark: "",
    brand: "",
    model: "",
    plate: "",
    color: "",
    name: "",
    phone: "",
    notes: "",
    consent: false,
  });

  useEffect(() => { setMounted(true); }, []);

  const set = (k: keyof typeof form) => (v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const canSubmit = form.problemType && form.city && form.address && form.phone && form.consent;

  if (!mounted) return null;

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: "var(--bg)" }}>
        <div className="relative mb-8">
          <div className="absolute inset-0 blur-3xl" style={{ background: "radial-gradient(ellipse, rgba(0,232,124,0.3) 0%, transparent 70%)" }} />
          <Image src="/emblema.png" alt="" width={100} height={100} style={{ position: "relative", filter: "drop-shadow(0 0 28px rgba(0,232,124,0.6))" }} />
        </div>
        <div className="mb-4 flex items-center gap-2 justify-center">
          <div className="w-2 h-2 rounded-full" style={{ background: "var(--accent)", animation: "pulse 1s ease-in-out infinite" }} />
          <span className="hud-label text-[9px]">ЗАЯВКА ПРИНЯТА · ДИСПЕТЧЕР ПОДКЛЮЧАЕТСЯ</span>
        </div>
        <h1 className="hud-title text-3xl sm:text-4xl text-white mb-4">Эвакуатор вызван!</h1>
        <p className="text-sm mb-8 max-w-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
          Оставайтесь рядом с автомобилем. Диспетчер свяжется с вами в течение 3 минут для подтверждения адреса и времени прибытия.
        </p>
        <div className="mb-8"><ResponseTimer /></div>
        <div className="flex gap-4 flex-wrap justify-center">
          <a href="tel:+78001234567" className="btn-primary px-8 py-3 text-sm font-bold tracking-[0.14em] uppercase" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498A1 1 0 0121 16.72V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            Позвонить напрямую
          </a>
          <Link href="/" className="btn-neon px-8 py-3 text-sm font-bold tracking-[0.14em] uppercase" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            На главную
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(0,232,124,0.06) 0%, transparent 50%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,232,124,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,232,124,0.025) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(6,6,8,0.92)", backdropFilter: "blur(12px)", position: "sticky", top: 0 }}>
        <Link href="/" className="flex items-center gap-3" style={{ textDecoration: "none" }}>
          <div className="flex items-center justify-center w-8 h-8" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
          </div>
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase hidden sm:block" style={{ color: "rgba(255,255,255,0.3)" }}>Назад</span>
        </Link>
        <div className="flex items-center gap-3">
          <Image src="/emblema.png" alt="Е-Спасатель" width={32} height={32} style={{ opacity: 0.85 }} />
          <div>
            <div className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: "var(--accent)" }}>Е-Спасатель</div>
            <div className="text-[8px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>Вызов эвакуатора</div>
          </div>
        </div>
        <a href="tel:+78001234567" className="flex items-center gap-2 px-4 py-2 transition-all duration-200" style={{ border: "1px solid rgba(0,232,124,0.3)", color: "var(--accent)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(0,232,124,0.08)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
            <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498A1 1 0 0121 16.72V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
          </svg>
          <span className="text-[10px] font-bold tracking-widest uppercase hidden sm:block">Звонок</span>
        </a>
      </header>

      <div ref={topRef} className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6 py-10 pb-24">
        {/* Title */}
        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-3">
            <div className="h-px w-6 flex-shrink-0" style={{ background: "var(--accent)" }} />
            <span className="hud-label text-[9px]">ЭКСТРЕННЫЙ МОДУЛЬ // ЭВАКУАЦИЯ</span>
          </div>
          <h1 className="hud-title text-3xl sm:text-5xl text-white mb-3">
            Вызов<br /><span style={{ color: "var(--accent)" }}>эвакуатора</span>
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)", maxWidth: "440px" }}>
            Заполните форму — диспетчер свяжется с вами в течение 3 минут. Работаем 24/7 по всей России.
          </p>
        </div>

        {/* Emergency strip */}
        <div
          className="mb-8 flex items-center justify-between gap-4 px-5 py-4"
          style={{ background: "rgba(0,232,124,0.06)", border: "1px solid rgba(0,232,124,0.25)", borderLeft: "3px solid var(--accent)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full" style={{ background: "var(--accent)", animation: "pulse 1.5s ease-in-out infinite" }} />
            <div>
              <div className="text-xs font-bold text-white tracking-wide">Экстренная линия</div>
              <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>8-800-XXX-XX-XX · Бесплатно · 24/7</div>
            </div>
          </div>
          <a href="tel:+78001234567" className="btn-primary px-5 py-2.5 text-xs font-bold tracking-widest uppercase flex-shrink-0"
            style={{ display: "inline-block" }}>
            Позвонить
          </a>
        </div>

        {/* ── Problem type ── */}
        <div className="mb-8">
          <div className="mb-3 text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>
            Тип ситуации <span style={{ color: "var(--accent)" }}>*</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PROBLEM_TYPES.map((pt) => (
              <button key={pt.id} onClick={() => set("problemType")(pt.id)}
                className="text-left flex flex-col gap-1.5 p-4 transition-all duration-200"
                style={{ border: form.problemType === pt.id ? "1px solid rgba(0,232,124,0.5)" : "1px solid rgba(255,255,255,0.07)", background: form.problemType === pt.id ? "rgba(0,232,124,0.08)" : "rgba(255,255,255,0.02)" }}
              >
                <span className="text-xl">{pt.icon}</span>
                <span className="text-xs font-bold text-white tracking-wide">{pt.label}</span>
                <span className="text-[10px] leading-tight" style={{ color: "rgba(255,255,255,0.35)" }}>{pt.desc}</span>
                {form.problemType === pt.id && (
                  <div className="h-0.5 w-full mt-1" style={{ background: "linear-gradient(90deg, var(--accent), transparent)" }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Location ── */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-3 py-1">
            <div className="h-px w-4 flex-shrink-0" style={{ background: "var(--accent)", opacity: 0.6 }} />
            <span className="text-[9px] font-bold tracking-[0.22em] uppercase" style={{ color: "var(--accent)", opacity: 0.7 }}>Местонахождение</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Город / населённый пункт" name="city" value={form.city} onChange={set("city")} placeholder="Москва" required />
            <Field label="Адрес (улица, дом)" name="address" value={form.address} onChange={set("address")} placeholder="ул. Ленина, д. 15" required hint="Укажите как можно точнее" />
          </div>
          <Field label="Ориентир / описание" name="landmark" value={form.landmark} onChange={set("landmark")} placeholder="Рядом с торговым центром «Мега», у 2-го подъезда" hint="Помогает водителю быстрее найти вас" />
        </div>

        {/* ── Vehicle ── */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-3 py-1">
            <div className="h-px w-4 flex-shrink-0" style={{ background: "var(--accent)", opacity: 0.6 }} />
            <span className="text-[9px] font-bold tracking-[0.22em] uppercase" style={{ color: "var(--accent)", opacity: 0.7 }}>Автомобиль</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Марка" name="brand" value={form.brand} onChange={set("brand")} placeholder="Toyota" />
            <Field label="Модель" name="model" value={form.model} onChange={set("model")} placeholder="Camry" />
            <Field label="Гос. номер" name="plate" value={form.plate} onChange={set("plate")} placeholder="А 123 ВС 77" />
            <Field label="Цвет" name="color" value={form.color} onChange={set("color")} placeholder="Белый" />
          </div>
        </div>

        {/* ── Contacts ── */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-3 py-1">
            <div className="h-px w-4 flex-shrink-0" style={{ background: "var(--accent)", opacity: 0.6 }} />
            <span className="text-[9px] font-bold tracking-[0.22em] uppercase" style={{ color: "var(--accent)", opacity: 0.7 }}>Контактные данные</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Ваше имя" name="name" value={form.name} onChange={set("name")} placeholder="Иван" />
            <Field label="Телефон для связи" name="phone" value={form.phone} onChange={set("phone")} placeholder="+7 (___) ___-__-__" type="tel" required />
          </div>
          <Field label="Дополнительная информация" name="notes" value={form.notes} onChange={set("notes")} placeholder="Опишите ситуацию подробнее, если нужно..." large />
        </div>

        {/* Consent */}
        <label className="flex items-start gap-3 cursor-pointer mb-8 p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div
            className="flex-shrink-0 w-5 h-5 border flex items-center justify-center transition-all duration-200 mt-0.5"
            style={{ borderColor: form.consent ? "var(--accent)" : "rgba(255,255,255,0.2)", background: form.consent ? "rgba(0,232,124,0.15)" : "transparent" }}
            onClick={() => set("consent")(!form.consent)}
          >
            {form.consent && (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" style={{ color: "var(--accent)" }}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <span className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
            Я согласен на обработку персональных данных в соответствии с{" "}
            <Link href="/privacy" className="underline" style={{ color: "rgba(0,232,124,0.7)" }}>Политикой конфиденциальности</Link>
          </span>
        </label>

        {/* Submit */}
        <button
          onClick={() => canSubmit && setSubmitted(true)}
          className="w-full py-4 flex items-center justify-center gap-3 text-sm font-bold tracking-[0.18em] uppercase transition-all duration-300"
          style={{
            background: canSubmit ? "var(--accent)" : "rgba(255,255,255,0.05)",
            color: canSubmit ? "#040508" : "rgba(255,255,255,0.2)",
            border: canSubmit ? "none" : "1px solid rgba(255,255,255,0.08)",
            cursor: canSubmit ? "pointer" : "not-allowed",
            boxShadow: canSubmit ? "0 0 40px rgba(0,232,124,0.4), 0 4px 20px rgba(0,232,124,0.2)" : "none",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
            <rect x="1" y="11" width="9" height="7" rx="0.5"/>
            <path d="M10 14h3l5-5h3v8h-3"/>
            <circle cx="5" cy="19" r="2"/>
            <circle cx="17.5" cy="19" r="2"/>
          </svg>
          Вызвать эвакуатор
        </button>
        {!canSubmit && (
          <p className="mt-2 text-center text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
            Заполните обязательные поля и дайте согласие на обработку данных
          </p>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
