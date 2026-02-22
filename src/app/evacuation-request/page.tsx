"use client";

import { useState } from "react";
import Link from "next/link";

const CITIES = [
  "Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург", "Казань",
  "Нижний Новгород", "Челябинск", "Самара", "Омск", "Ростов-на-Дону",
  "Уфа", "Красноярск", "Воронеж", "Пермь", "Волгоград",
  "Краснодар", "Саратов", "Тюмень", "Тольятти", "Ижевск",
  "Другой город",
];

const REASONS = [
  { id: "breakdown",  label: "Поломка / не заводится",  icon: "⚙️" },
  { id: "accident",   label: "ДТП / авария",             icon: "🚗" },
  { id: "wheel",      label: "Спустило колесо",           icon: "🔧" },
  { id: "flood",      label: "Затопило / сел в грязь",    icon: "🌊" },
  { id: "fuel",       label: "Закончилось топливо",       icon: "⛽" },
  { id: "keys",       label: "Заперты ключи в машине",    icon: "🔑" },
  { id: "other",      label: "Другая причина",            icon: "📋" },
];

const CAR_TYPES = [
  { id: "sedan",    label: "Легковой седан / хэтч" },
  { id: "suv",      label: "Внедорожник / кроссовер" },
  { id: "minivan",  label: "Минивэн / MPV" },
  { id: "truck",    label: "Грузовик / фургон" },
  { id: "moto",     label: "Мотоцикл / скутер" },
];

export default function EvacuationRequestPage() {
  const [form, setForm] = useState({
    city: "",
    customCity: "",
    street: "",
    building: "",
    landmark: "",
    reason: "",
    carType: "",
    carBrand: "",
    name: "",
    phone: "",
    comment: "",
    sent: false,
    sending: false,
    error: "",
  });

  const set = <K extends keyof typeof form>(k: K) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const canSend =
    (form.city || form.customCity) &&
    form.street &&
    form.phone &&
    form.name &&
    !form.sending;

  const handleSend = async () => {
    if (!canSend) return;
    setForm((f) => ({ ...f, sending: true, error: "" }));
    const city = form.city === "Другой город" ? form.customCity : form.city;
    const address = [city, `ул. ${form.street}`, form.building && `д. ${form.building}`, form.landmark && `(${form.landmark})`].filter(Boolean).join(", ");
    const reasonLabel = REASONS.find((r) => r.id === form.reason)?.label ?? form.reason;
    const carTypeLabel = CAR_TYPES.find((c) => c.id === form.carType)?.label ?? "";

    try {
      const res = await fetch("/api/send-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          service: "🚛 Вызов эвакуатора",
          desc: [
            `Адрес: ${address}`,
            reasonLabel && `Причина: ${reasonLabel}`,
            carTypeLabel && `Тип авто: ${carTypeLabel}`,
            form.carBrand && `Марка: ${form.carBrand}`,
            form.comment && `Комментарий: ${form.comment}`,
          ].filter(Boolean).join(" | "),
          source: "Форма вызова эвакуатора",
        }),
      });
      const data = await res.json();
      if (data.ok) setForm((f) => ({ ...f, sent: true, sending: false }));
      else setForm((f) => ({ ...f, sending: false, error: "Ошибка отправки. Позвоните на горячую линию." }));
    } catch {
      setForm((f) => ({ ...f, sending: false, error: "Нет соединения. Позвоните на горячую линию." }));
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", boxSizing: "border-box",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff", padding: "10px 14px", fontSize: "0.875rem",
    fontFamily: "var(--font-space-grotesk),sans-serif",
    outline: "none", borderRadius: 0,
  };
  const focusOn = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "rgba(0,232,124,0.5)";
    e.currentTarget.style.background = "rgba(0,232,124,0.04)";
  };
  const focusOff = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
  };

  const Label = ({ text, required }: { text: string; required?: boolean }) => (
    <label style={{ display: "block", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.4)", marginBottom: 7 }}>
      {text}{required && <span style={{ color: "var(--accent)", marginLeft: 4 }}>*</span>}
    </label>
  );

  const SectionTitle = ({ num, text }: { num: string; text: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, marginTop: 28 }}>
      <div style={{ width: 28, height: 28, flexShrink: 0, border: "1px solid rgba(0,232,124,0.4)", background: "rgba(0,232,124,0.08)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, fontFamily: "var(--font-geist-mono),monospace" }}>{num}</div>
      <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.5)" }}>{text}</span>
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
    </div>
  );

  if (form.sent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: "var(--bg)" }}>
        <div style={{ width: 64, height: 64, border: "1px solid rgba(0,232,124,0.4)", background: "rgba(0,232,124,0.08)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <div className="mb-3 inline-flex items-center gap-2">
          <div className="h-px w-6" style={{ background: "var(--accent)" }} />
          <span className="hud-label text-[9px]">ЭВАКУАТОР // ЗАЯВКА ПРИНЯТА</span>
          <div className="h-px w-6" style={{ background: "var(--accent)" }} />
        </div>
        <h1 className="hud-title text-3xl sm:text-4xl text-white mb-4">Заявка отправлена!</h1>
        <p className="text-sm mb-2 max-w-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
          Наш диспетчер перезвонит вам
        </p>
        <p className="text-xl font-bold mb-8" style={{ color: "var(--accent)" }}>в течение 3 минут</p>
        <p className="text-xs mb-10" style={{ color: "rgba(255,255,255,0.25)" }}>
          Если не перезвонили — звоните сами: <span style={{ color: "rgba(255,255,255,0.5)" }}>8-800-XXX-XX-XX</span>
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/" className="btn-primary px-8 py-3 text-sm font-bold tracking-widest uppercase" style={{ display: "inline-flex", alignItems: "center" }}>
            На главную
          </Link>
          <button onClick={() => setForm((f) => ({ ...f, sent: false, city: "", street: "", building: "", phone: "", name: "" }))}
            className="btn-neon px-8 py-3 text-sm font-bold tracking-widest uppercase">
            Новая заявка
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Фон */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 15% 20%, rgba(0,232,124,0.04) 0%, transparent 50%), radial-gradient(ellipse at 85% 80%, rgba(0,232,124,0.03) 0%, transparent 50%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,232,124,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,232,124,0.025) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      {/* Хедер */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 sticky top-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(6,6,8,0.92)", backdropFilter: "blur(12px)" }}>
        <Link href="/" className="flex items-center gap-3" style={{ textDecoration: "none" }}>
          <div className="flex items-center justify-center w-8 h-8" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
          </div>
          <span className="text-[9px] font-bold tracking-widest uppercase hidden sm:block" style={{ color: "rgba(255,255,255,0.3)" }}>Назад</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="h-px w-4 hidden sm:block" style={{ background: "var(--accent)", opacity: 0.5 }} />
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>ЭВАКУАЦИЯ // СРОЧНЫЙ ВЫЕЗД</span>
        </div>
        <a href="tel:88001234567" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{ width: 32, height: 32, border: "1px solid rgba(0,232,124,0.35)", background: "rgba(0,232,124,0.08)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
            </svg>
          </div>
          <span className="hidden sm:block text-[10px] font-bold tracking-wide" style={{ color: "rgba(255,255,255,0.5)" }}>8-800-XXX-XX-XX</span>
        </a>
      </header>

      <div className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6 py-10 pb-24">

        {/* Заголовок */}
        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-3">
            <div className="h-px w-6" style={{ background: "var(--accent)" }} />
            <span className="hud-label text-[9px]">ЛОГИСТИКА // ВЫЗОВ ЭВАКУАТОРА</span>
          </div>
          <div className="flex items-center gap-5 mb-4">
            <div style={{ width: 56, height: 56, flexShrink: 0, border: "1px solid rgba(0,232,124,0.35)", background: "rgba(0,232,124,0.08)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                <rect x="1" y="11" width="15" height="8" rx="0.5"/>
                <path d="M16 13h4l2 3v3h-6v-6z"/>
                <circle cx="5.5" cy="19.5" r="1.5"/><circle cx="18.5" cy="19.5" r="1.5"/>
                <line x1="9" y1="11" x2="9" y2="7"/><line x1="5" y1="7" x2="13" y2="7"/>
              </svg>
            </div>
            <div>
              <h1 className="hud-title text-3xl sm:text-4xl text-white">
                Вызов<br /><span style={{ color: "var(--accent)" }}>эвакуатора</span>
              </h1>
            </div>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)", maxWidth: 480 }}>
            Заполните форму — диспетчер перезвонит вам в течение 3 минут и согласует время прибытия.
          </p>
        </div>

        {/* Блок срочного звонка */}
        <a href="tel:88001234567" style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", background: "rgba(0,232,124,0.05)", border: "1px solid rgba(0,232,124,0.25)", textDecoration: "none", marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, flexShrink: 0, border: "1px solid rgba(0,232,124,0.4)", background: "rgba(0,232,124,0.1)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 2 }}>ГОРЯЧАЯ ЛИНИЯ · 24/7 · БЕСПЛАТНО</div>
            <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#fff", letterSpacing: "0.04em" }}>8-800-XXX-XX-XX</div>
          </div>
          <div style={{ marginLeft: "auto", fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", textAlign: "right", lineHeight: 1.5 }}>
            Или заполните<br />форму ниже
          </div>
        </a>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, opacity: 0.4 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>или онлайн-заявка</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
        </div>

        {/* ═══ ФОРМА ═══ */}
        <div style={{ background: "rgba(6,6,8,0.95)", border: "1px solid rgba(255,255,255,0.06)", padding: "28px 24px" }}>

          {/* 01 · Место нахождения */}
          <SectionTitle num="01" text="Где находится автомобиль" />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <Label text="Город" required />
              <select value={form.city} onChange={(e) => set("city")(e.target.value)}
                style={{ ...inputStyle, cursor: "pointer", appearance: "none" }}
                onFocus={focusOn} onBlur={focusOff}>
                <option value="">— Выберите город —</option>
                {CITIES.map((c) => <option key={c} value={c} style={{ background: "#0b0c10" }}>{c}</option>)}
              </select>
            </div>

            {form.city === "Другой город" && (
              <div style={{ gridColumn: "1 / -1" }}>
                <Label text="Укажите город" required />
                <input value={form.customCity} onChange={(e) => set("customCity")(e.target.value)}
                  placeholder="Название вашего города" style={inputStyle} onFocus={focusOn} onBlur={focusOff} />
              </div>
            )}

            <div style={{ gridColumn: "1 / -1" }}>
              <Label text="Улица" required />
              <input value={form.street} onChange={(e) => set("street")(e.target.value)}
                placeholder="Название улицы / проспекта / шоссе" style={inputStyle} onFocus={focusOn} onBlur={focusOff} />
            </div>

            <div>
              <Label text="Дом / корпус" />
              <input value={form.building} onChange={(e) => set("building")(e.target.value)}
                placeholder="1А / 3к2" style={inputStyle} onFocus={focusOn} onBlur={focusOff} />
            </div>

            <div>
              <Label text="Ориентир" />
              <input value={form.landmark} onChange={(e) => set("landmark")(e.target.value)}
                placeholder="Рядом с ТЦ, метро..." style={inputStyle} onFocus={focusOn} onBlur={focusOff} />
            </div>
          </div>

          {/* 02 · Причина */}
          <SectionTitle num="02" text="Причина вызова" />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 6, marginBottom: 4 }}>
            {REASONS.map((r) => {
              const active = form.reason === r.id;
              return (
                <button key={r.id} onClick={() => set("reason")(active ? "" : r.id)}
                  style={{ background: active ? "rgba(0,232,124,0.1)" : "rgba(255,255,255,0.02)", border: `1px solid ${active ? "rgba(0,232,124,0.45)" : "rgba(255,255,255,0.07)"}`, color: active ? "var(--accent)" : "rgba(255,255,255,0.65)", padding: "10px 12px", textAlign: "left", cursor: "pointer", transition: "all 0.18s", fontSize: "0.78rem", display: "flex", alignItems: "center", gap: 8 }}
                  onMouseEnter={(e) => { if (!active) { e.currentTarget.style.borderColor = "rgba(0,232,124,0.3)"; e.currentTarget.style.background = "rgba(0,232,124,0.04)"; } }}
                  onMouseLeave={(e) => { if (!active) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; } }}>
                  <span style={{ fontSize: "1rem" }}>{r.icon}</span>
                  {r.label}
                </button>
              );
            })}
          </div>

          {/* 03 · Автомобиль */}
          <SectionTitle num="03" text="Автомобиль" />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 4 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <Label text="Тип автомобиля" />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {CAR_TYPES.map((c) => {
                  const active = form.carType === c.id;
                  return (
                    <button key={c.id} onClick={() => set("carType")(active ? "" : c.id)}
                      style={{ background: active ? "rgba(0,232,124,0.1)" : "rgba(255,255,255,0.02)", border: `1px solid ${active ? "rgba(0,232,124,0.45)" : "rgba(255,255,255,0.07)"}`, color: active ? "var(--accent)" : "rgba(255,255,255,0.6)", padding: "7px 14px", cursor: "pointer", transition: "all 0.18s", fontSize: "0.72rem", fontWeight: 600 }}
                      onMouseEnter={(e) => { if (!active) { e.currentTarget.style.borderColor = "rgba(0,232,124,0.3)"; e.currentTarget.style.background = "rgba(0,232,124,0.04)"; } }}
                      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; } }}>
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ gridColumn: "1 / -1", marginTop: 10 }}>
              <Label text="Марка и модель" />
              <input value={form.carBrand} onChange={(e) => set("carBrand")(e.target.value)}
                placeholder="Toyota Camry 2020, белый" style={inputStyle} onFocus={focusOn} onBlur={focusOff} />
            </div>
          </div>

          {/* 04 · Контакты */}
          <SectionTitle num="04" text="Ваши контакты" />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <div>
              <Label text="Имя" required />
              <input value={form.name} onChange={(e) => set("name")(e.target.value)}
                placeholder="Иван" style={inputStyle} onFocus={focusOn} onBlur={focusOff} />
            </div>
            <div>
              <Label text="Телефон" required />
              <input value={form.phone} onChange={(e) => set("phone")(e.target.value)}
                placeholder="+7 (999) 123-45-67" style={inputStyle} onFocus={focusOn} onBlur={focusOff} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <Label text="Дополнительно" />
              <textarea value={form.comment} onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                placeholder="Любые детали: шлагбаум, код домофона, условия доступа к машине..."
                rows={2} style={{ ...inputStyle, resize: "vertical" }}
                onFocus={focusOn} onBlur={focusOff} />
            </div>
          </div>

          {/* Подсказка по полноте */}
          {!(form.city || form.customCity) || !form.street || !form.phone || !form.name ? (
            <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.25)", marginBottom: 16 }}>
              Обязательные поля: <span style={{ color: "rgba(0,232,124,0.6)" }}>Город · Улица · Имя · Телефон</span>
            </div>
          ) : null}

          {form.error && (
            <div style={{ fontSize: "0.72rem", color: "rgba(255,80,80,0.9)", marginBottom: 14 }}>{form.error}</div>
          )}

          {/* Кнопка отправки */}
          <button onClick={handleSend} disabled={!canSend}
            style={{ width: "100%", padding: "15px 24px", background: canSend ? "var(--accent)" : "rgba(255,255,255,0.05)", color: canSend ? "#040508" : "rgba(255,255,255,0.2)", border: "none", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", cursor: canSend ? "pointer" : "not-allowed", transition: "all 0.2s", boxShadow: canSend ? "0 0 28px rgba(0,232,124,0.3)" : "none", fontFamily: "var(--font-space-grotesk),sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
              <rect x="1" y="11" width="15" height="8" rx="0.5"/>
              <path d="M16 13h4l2 3v3h-6v-6z"/>
              <circle cx="5.5" cy="19.5" r="1.5"/><circle cx="18.5" cy="19.5" r="1.5"/>
              <line x1="9" y1="11" x2="9" y2="7"/><line x1="5" y1="7" x2="13" y2="7"/>
            </svg>
            {form.sending ? "Отправка заявки..." : "Вызвать эвакуатор — перезвоним за 3 минуты"}
          </button>
        </div>
      </div>
    </div>
  );
}
