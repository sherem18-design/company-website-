"use client";

import { useState } from "react";
import {
  COMPANIES,
  POWER_COEFFICIENTS,
  getOffers,
  ASSISTANT_FLOW,
  isAssistantResult,
  type InsuranceType,
  type CompanyOffer,
  type AssistantStep,
} from "@/data/insurance-prices";

/* ─── Типы страхования для выбора ─── */
const TYPES: { id: InsuranceType; label: string; desc: string }[] = [
  { id: "osago",      label: "ОСАГО",        desc: "Обязательное" },
  { id: "kasko",      label: "КАСКО",        desc: "Полное" },
  { id: "kasko-lite", label: "КАСКО-лайт",   desc: "Угон + гибель" },
  { id: "dsago",      label: "ДСАГО",        desc: "Доп. лимит" },
  { id: "gap",        label: "GAP",          desc: "Защита инвестиции" },
  { id: "green",      label: "Зелёная карта", desc: "За рубеж" },
  { id: "accident",   label: "НС водителя",  desc: "Несчастный случай" },
];

/* ─── Stars ─── */
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="9" height="9" viewBox="0 0 24 24" fill={s <= Math.round(rating) ? "var(--accent)" : "none"} stroke="var(--accent)" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

/* ─── Карточка предложения ─── */
function OfferCard({
  rank,
  company,
  price,
  onChoose,
}: {
  rank: number;
  company: CompanyOffer;
  price: number;
  onChoose: (c: CompanyOffer, price: number) => void;
}) {
  const isTop = rank === 0;

  return (
    <div
      style={{
        background: isTop ? "rgba(0,232,124,0.05)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${isTop ? "rgba(0,232,124,0.35)" : "rgba(255,255,255,0.06)"}`,
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        transition: "border-color 0.2s",
      }}
    >
      {/* Rank */}
      <div
        style={{
          width: 28,
          height: 28,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1px solid ${isTop ? "var(--accent)" : "rgba(255,255,255,0.1)"}`,
          background: isTop ? "rgba(0,232,124,0.12)" : "transparent",
          fontSize: "0.65rem",
          fontWeight: 700,
          color: isTop ? "var(--accent)" : "rgba(255,255,255,0.3)",
          letterSpacing: "0.1em",
          fontFamily: "var(--font-geist-mono),monospace",
        }}
      >
        {String(rank + 1).padStart(2, "0")}
      </div>

      {/* Logo */}
      <div
        style={{
          width: 44,
          height: 44,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          fontSize: "0.55rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          color: "rgba(255,255,255,0.6)",
        }}
      >
        {company.logo}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#fff", letterSpacing: "0.03em" }}>
            {company.company}
          </span>
          {company.badge && (
            <span
              style={{
                fontSize: "0.55rem",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: isTop ? "#040508" : "var(--accent)",
                background: isTop ? "var(--accent)" : "rgba(0,232,124,0.12)",
                border: isTop ? "none" : "1px solid rgba(0,232,124,0.3)",
                padding: "2px 6px",
              }}
            >
              {company.badge}
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
          <Stars rating={company.rating} />
          <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em" }}>
            {company.rating.toFixed(1)} · выплаты {company.payoutRate}%
          </span>
        </div>
      </div>

      {/* Price + Button */}
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontSize: "1.1rem", fontWeight: 700, color: isTop ? "var(--accent)" : "#fff", letterSpacing: "0.02em", fontFamily: "var(--font-geist-mono),monospace" }}>
          {price.toLocaleString("ru-RU")} ₽
        </div>
        <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginBottom: 8 }}>/ ГОД</div>
        <button
          onClick={() => onChoose(company, price)}
          style={{
            background: isTop ? "var(--accent)" : "transparent",
            border: `1px solid ${isTop ? "var(--accent)" : "rgba(0,232,124,0.35)"}`,
            color: isTop ? "#040508" : "var(--accent)",
            padding: "6px 14px",
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "all 0.2s",
            boxShadow: isTop ? "0 0 16px rgba(0,232,124,0.3)" : "none",
          }}
          onMouseEnter={(e) => {
            if (!isTop) {
              e.currentTarget.style.background = "rgba(0,232,124,0.08)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isTop) {
              e.currentTarget.style.background = "transparent";
            }
          }}
        >
          Выбрать
        </button>
      </div>
    </div>
  );
}

/* ─── Ассистент ─── */
function Assistant({ onResult }: { onResult: (type: InsuranceType) => void }) {
  const [stepId, setStepId] = useState("start");
  const [history, setHistory] = useState<{ question: string; answer: string }[]>([]);

  const current = ASSISTANT_FLOW[stepId];

  const handleOption = (label: string, next: string) => {
    if (!isAssistantResult(current)) {
      setHistory((h) => [...h, { question: current.question, answer: label }]);
    }
    const nextStep = ASSISTANT_FLOW[next];
    if (isAssistantResult(nextStep)) {
      onResult(nextStep.type);
    } else {
      setStepId(next);
    }
  };

  if (isAssistantResult(current)) return null;

  const step = current as AssistantStep;

  return (
    <div>
      {/* История */}
      {history.map((h, i) => (
        <div key={i} style={{ marginBottom: 8, opacity: 0.45 }}>
          <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em", marginBottom: 2 }}>
            {h.question}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--accent)", display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {h.answer}
          </div>
        </div>
      ))}

      {/* Текущий вопрос */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          padding: "14px 16px",
          background: "rgba(0,232,124,0.05)",
          border: "1px solid rgba(0,232,124,0.2)",
          marginBottom: 12,
        }}
      >
        <div style={{ width: 28, height: 28, flexShrink: 0, border: "1px solid rgba(0,232,124,0.4)", background: "rgba(0,232,124,0.1)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
            <rect x="3" y="11" width="18" height="10" rx="0.5" />
            <path d="M12 3v4M8 11V7h8v4" />
            <circle cx="9" cy="16" r="1" fill="currentColor" stroke="none" />
            <circle cx="15" cy="16" r="1" fill="currentColor" stroke="none" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 4 }}>
            Е-СПАСАТЕЛЬ
          </div>
          <div style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>
            {step.question}
          </div>
        </div>
      </div>

      {/* Варианты ответа */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {step.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleOption(opt.label, opt.next)}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.8)",
              padding: "10px 16px",
              textAlign: "left",
              fontSize: "0.8rem",
              cursor: "pointer",
              transition: "all 0.2s",
              letterSpacing: "0.02em",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(0,232,124,0.4)";
              e.currentTarget.style.background = "rgba(0,232,124,0.06)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              e.currentTarget.style.color = "rgba(255,255,255,0.8)";
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" style={{ flexShrink: 0, color: "var(--accent)" }}>
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Форма заявки после выбора ─── */
function OrderForm({
  company,
  price,
  insuranceType,
  onBack,
}: {
  company: CompanyOffer;
  price: number;
  insuranceType: InsuranceType;
  onBack: () => void;
}) {
  const [form, setForm] = useState({ name: "", phone: "", sent: false, sending: false, error: "" });

  const typeLabel = TYPES.find((t) => t.id === insuranceType)?.label ?? insuranceType;

  const handleSend = async () => {
    if (!form.name || !form.phone) return;
    setForm((f) => ({ ...f, sending: true, error: "" }));
    try {
      const res = await fetch("/api/send-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          service: `${typeLabel} — ${company.company}`,
          desc: `Выбранная цена: ${price.toLocaleString("ru-RU")} ₽/год`,
          source: "Калькулятор страхования",
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setForm((f) => ({ ...f, sent: true, sending: false }));
      } else {
        setForm((f) => ({ ...f, sending: false, error: "Ошибка отправки. Попробуйте позже." }));
      }
    } catch {
      setForm((f) => ({ ...f, sending: false, error: "Нет соединения. Попробуйте позже." }));
    }
  };

  if (form.sent) {
    return (
      <div style={{ textAlign: "center", padding: "32px 0" }}>
        <div style={{ width: 48, height: 48, border: "1px solid rgba(0,232,124,0.4)", background: "rgba(0,232,124,0.08)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: 6 }}>Заявка отправлена!</div>
        <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>
          Наш специалист свяжется с вами в течение 15 минут
        </div>
        <button onClick={onBack} style={{ border: "1px solid rgba(0,232,124,0.35)", color: "var(--accent)", background: "transparent", padding: "8px 24px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer" }}>
          Вернуться к списку
        </button>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
    padding: "10px 14px",
    fontSize: "0.875rem",
    fontFamily: "var(--font-space-grotesk),sans-serif",
    outline: "none",
    borderRadius: 0,
  };

  return (
    <div>
      {/* Выбранное предложение */}
      <div style={{ background: "rgba(0,232,124,0.05)", border: "1px solid rgba(0,232,124,0.25)", padding: "14px 18px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 4 }}>ВЫБРАНО</div>
          <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#fff" }}>{company.company} — {typeLabel}</div>
        </div>
        <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-geist-mono),monospace" }}>
          {price.toLocaleString("ru-RU")} ₽/год
        </div>
      </div>

      {/* Поля */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
        <div>
          <label style={{ display: "block", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 6 }}>Ваше имя *</label>
          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Иван Петров" style={inputStyle}
            onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(0,232,124,0.5)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 6 }}>Телефон *</label>
          <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+7 (999) 123-45-67" style={inputStyle}
            onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(0,232,124,0.5)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
          />
        </div>
      </div>

      {form.error && <div style={{ fontSize: "0.75rem", color: "rgba(255,80,80,0.9)", marginBottom: 12 }}>{form.error}</div>}

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onBack} style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)", background: "transparent", padding: "10px 16px", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer" }}>
          ← Назад
        </button>
        <button
          onClick={handleSend}
          disabled={!form.name || !form.phone || form.sending}
          style={{
            flex: 1,
            background: form.name && form.phone && !form.sending ? "var(--accent)" : "rgba(255,255,255,0.05)",
            color: form.name && form.phone && !form.sending ? "#040508" : "rgba(255,255,255,0.2)",
            border: "none",
            padding: "10px 20px",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            cursor: form.name && form.phone && !form.sending ? "pointer" : "not-allowed",
            transition: "all 0.2s",
            boxShadow: form.name && form.phone ? "0 0 20px rgba(0,232,124,0.25)" : "none",
          }}
        >
          {form.sending ? "Отправка..." : "Оформить заявку"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ГЛАВНЫЙ КОМПОНЕНТ
   ═══════════════════════════════════════════════════════════════════════════ */
export default function InsuranceCalculator({ defaultType }: { defaultType?: InsuranceType }) {
  const [mode, setMode] = useState<"select" | "assistant" | "results" | "order">(
    defaultType ? "results" : "select"
  );
  const [selectedType, setSelectedType] = useState<InsuranceType | null>(defaultType ?? null);
  const [selectedPower, setSelectedPower] = useState<string>("");
  const [selectedOffer, setSelectedOffer] = useState<{ company: CompanyOffer; price: number } | null>(null);

  const handleTypeSelect = (type: InsuranceType) => {
    setSelectedType(type);
    setMode("results");
  };

  const handleAssistantResult = (type: InsuranceType) => {
    setSelectedType(type);
    setMode("results");
  };

  const handleChoose = (company: CompanyOffer, price: number) => {
    setSelectedOffer({ company, price });
    setMode("order");
  };

  const offers = selectedType ? getOffers(selectedType, selectedPower || undefined) : [];
  const currentTypeLabel = TYPES.find((t) => t.id === selectedType)?.label;

  return (
    <div style={{ background: "rgba(6,6,8,0.95)", border: "1px solid rgba(0,232,124,0.15)", padding: 0 }}>
      {/* ── Заголовок ── */}
      <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, border: "1px solid rgba(0,232,124,0.4)", background: "rgba(0,232,124,0.08)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
              <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 2 }}>
              КАЛЬКУЛЯТОР СТРАХОВАНИЯ
            </div>
            <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>
              {mode === "select" && "Выберите тип страхования или получите рекомендацию"}
              {mode === "assistant" && "Е-Спасатель поможет подобрать страховку"}
              {mode === "results" && `${offers.length} предложений · ${currentTypeLabel}`}
              {mode === "order" && "Оформление заявки"}
            </div>
          </div>
        </div>
        {mode !== "select" && (
          <button
            onClick={() => { setMode("select"); setSelectedType(null); setSelectedOffer(null); }}
            style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            ← К выбору типа
          </button>
        )}
      </div>

      <div style={{ padding: "24px" }}>

        {/* ── Режим выбора типа ── */}
        {mode === "select" && (
          <div>
            {/* Кнопка ассистента */}
            <button
              onClick={() => setMode("assistant")}
              style={{
                width: "100%",
                background: "rgba(0,232,124,0.06)",
                border: "1px solid rgba(0,232,124,0.3)",
                color: "#fff",
                padding: "14px 20px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                cursor: "pointer",
                marginBottom: 20,
                textAlign: "left",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,232,124,0.1)"; e.currentTarget.style.borderColor = "rgba(0,232,124,0.5)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,232,124,0.06)"; e.currentTarget.style.borderColor = "rgba(0,232,124,0.3)"; }}
            >
              <div style={{ width: 36, height: 36, flexShrink: 0, border: "1px solid rgba(0,232,124,0.4)", background: "rgba(0,232,124,0.1)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                  <rect x="3" y="11" width="18" height="10" rx="0.5" /><path d="M12 3v4M8 11V7h8v4" />
                  <circle cx="9" cy="16" r="1" fill="currentColor" stroke="none" /><circle cx="15" cy="16" r="1" fill="currentColor" stroke="none" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent)", letterSpacing: "0.06em", marginBottom: 2 }}>
                  Помогите мне выбрать
                </div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)" }}>
                  Е-Спасатель задаст несколько вопросов и подберёт оптимальную страховку
                </div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" style={{ marginLeft: "auto", flexShrink: 0, color: "var(--accent)" }}>
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>

            {/* Разделитель */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
              <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
                или выберите сами
              </span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
            </div>

            {/* Сетка типов */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8 }}>
              {TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleTypeSelect(t.id)}
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "#fff",
                    padding: "14px 16px",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,232,124,0.4)"; e.currentTarget.style.background = "rgba(0,232,124,0.05)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                >
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.04em", marginBottom: 4 }}>{t.label}</div>
                  <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em" }}>{t.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Режим ассистента ── */}
        {mode === "assistant" && (
          <Assistant onResult={handleAssistantResult} />
        )}

        {/* ── Режим результатов ── */}
        {mode === "results" && selectedType && (
          <div>
            {/* Фильтр мощности для ОСАГО */}
            {selectedType === "osago" && (
              <div style={{ marginBottom: 20, padding: "14px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 10 }}>
                  Мощность двигателя (л.с.)
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {Object.keys(POWER_COEFFICIENTS).map((p) => (
                    <button
                      key={p}
                      onClick={() => setSelectedPower(p === selectedPower ? "" : p)}
                      style={{
                        background: selectedPower === p ? "var(--accent)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${selectedPower === p ? "var(--accent)" : "rgba(255,255,255,0.1)"}`,
                        color: selectedPower === p ? "#040508" : "rgba(255,255,255,0.6)",
                        padding: "5px 12px",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Список предложений */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {offers.map((o, i) => (
                <OfferCard
                  key={o.company.company}
                  rank={i}
                  company={o.company}
                  price={o.price}
                  onChoose={handleChoose}
                />
              ))}
            </div>

            {/* Дисклеймер */}
            <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(255,255,255,0.02)", borderLeft: "2px solid rgba(0,232,124,0.3)" }}>
              <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", lineHeight: 1.6, letterSpacing: "0.04em" }}>
                Цены носят ориентировочный характер и могут отличаться в зависимости от данных автомобиля, стажа и региона. Точная стоимость рассчитывается при оформлении заявки.
              </div>
            </div>
          </div>
        )}

        {/* ── Режим заявки ── */}
        {mode === "order" && selectedOffer && selectedType && (
          <OrderForm
            company={selectedOffer.company}
            price={selectedOffer.price}
            insuranceType={selectedType}
            onBack={() => setMode("results")}
          />
        )}
      </div>
    </div>
  );
}
