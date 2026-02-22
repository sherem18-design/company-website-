"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

/* ─── Быстрые варианты помощи ─── */
const HELP_OPTIONS = [
  {
    id: "dtp",
    label: "ДТП",
    desc: "Попал в аварию",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <path d="M3 17l1.5-4.5L7 9h10l2.5 3.5L21 17H3z"/>
        <circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/>
        <line x1="12" y1="4" x2="12" y2="9"/>
        <line x1="9" y1="6" x2="15" y2="6"/>
      </svg>
    ),
  },
  {
    id: "evacuation",
    label: "Эвакуатор",
    desc: "Нужна эвакуация",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <rect x="1" y="11" width="15" height="8" rx="0.5"/>
        <path d="M16 13h4l2 3v3h-6v-6z"/>
        <circle cx="5.5" cy="19.5" r="1.5"/><circle cx="18.5" cy="19.5" r="1.5"/>
        <line x1="9" y1="11" x2="9" y2="7"/><line x1="5" y1="7" x2="13" y2="7"/>
      </svg>
    ),
  },
  {
    id: "osago",
    label: "Страховой случай",
    desc: "Оформить по ОСАГО",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <path d="M12 2L4 5v7c0 4.4 3.5 8.5 8 10 4.5-1.5 8-5.6 8-10V5L12 2z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
  },
  {
    id: "europrotocol",
    label: "Европротокол",
    desc: "Оформить без ГИБДД",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/>
      </svg>
    ),
  },
  {
    id: "breakdown",
    label: "Поломка",
    desc: "Заглохла машина",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.07 4.93l-1.41 1.41M5.34 18.66l-1.41 1.41M21 12h-2M5 12H3M19.07 19.07l-1.41-1.41M5.34 5.34L3.93 3.93"/>
        <circle cx="12" cy="12" r="9" strokeOpacity=".25"/>
      </svg>
    ),
  },
  {
    id: "wheel",
    label: "Прокол шины",
    desc: "Нужна помощь с колесом",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <circle cx="12" cy="12" r="9"/>
        <circle cx="12" cy="12" r="3"/>
        <line x1="12" y1="3" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="21"/>
        <line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/>
      </svg>
    ),
  },
  {
    id: "documents",
    label: "Документы",
    desc: "Оформление / консультация",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <rect x="4" y="2" width="16" height="20" rx="0.5"/>
        <line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/>
      </svg>
    ),
  },
  {
    id: "other",
    label: "Другое",
    desc: "Опишу сам",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  },
];

/* ─── Глобальная функция открытия ─── */
export function openHelpModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("openHelpModal"));
  }
}

/* ─── Компонент ─── */
export default function HelpModal() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [form, setForm] = useState({ name: "", phone: "", desc: "", sent: false, sending: false, error: "" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handler = () => { setOpen(true); setSelected([]); setForm({ name: "", phone: "", desc: "", sent: false, sending: false, error: "" }); };
    window.addEventListener("openHelpModal", handler);
    return () => window.removeEventListener("openHelpModal", handler);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  // Закрытие по Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, close]);

  // Блокировка скролла страницы
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const toggleOption = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSend = async () => {
    if (!form.name || !form.phone) return;
    setForm((f) => ({ ...f, sending: true, error: "" }));

    const selectedLabels = HELP_OPTIONS
      .filter((o) => selected.includes(o.id))
      .map((o) => o.label)
      .join(", ");

    try {
      const res = await fetch("/api/send-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          service: selectedLabels || "Срочная помощь",
          desc: form.desc || undefined,
          source: "🆘 Кнопка «Получить помощь»",
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

  if (!mounted || !open) return null;

  const canSubmit = form.name && form.phone && !form.sending;

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        background: "rgba(4,5,8,0.88)",
        backdropFilter: "blur(12px)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 540,
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#060608",
          border: "1px solid rgba(0,232,124,0.25)",
          boxShadow: "0 0 80px rgba(0,232,124,0.12), 0 0 160px rgba(0,232,124,0.06)",
          position: "relative",
        }}
      >
        {/* ── Шапка ── */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, flexShrink: 0, border: "1px solid rgba(0,232,124,0.4)", background: "rgba(0,232,124,0.1)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 2 }}>
                Е-СПАСАТЕЛЬ // СРОЧНАЯ ПОМОЩЬ
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff", letterSpacing: "0.03em" }}>
                Онлайн-заявка
              </div>
            </div>
          </div>
          <button
            onClick={close}
            style={{ width: 32, height: 32, flexShrink: 0, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "rgba(255,255,255,0.35)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div style={{ padding: "24px" }}>
          {form.sent ? (
            /* ── Успех ── */
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ width: 56, height: 56, border: "1px solid rgba(0,232,124,0.4)", background: "rgba(0,232,124,0.08)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", marginBottom: 8, letterSpacing: "0.02em" }}>
                Заявка принята!
              </div>
              <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6, marginBottom: 6 }}>
                Наш специалист перезвонит вам
              </div>
              <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--accent)", marginBottom: 24, letterSpacing: "0.04em" }}>
                в течение нескольких минут
              </div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", marginBottom: 28 }}>
                Горячая линия: <span style={{ color: "rgba(255,255,255,0.5)" }}>8-800-XXX-XX-XX</span>
              </div>
              <button onClick={close} style={{ border: "1px solid rgba(0,232,124,0.35)", color: "var(--accent)", background: "transparent", padding: "10px 32px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer" }}>
                Закрыть
              </button>
            </div>
          ) : (
            <>
              {/* ── Шаг 1: Выбор типа помощи ── */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>
                  ЧТО СЛУЧИЛОСЬ? (выберите одно или несколько)
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 6 }}>
                  {HELP_OPTIONS.map((opt) => {
                    const active = selected.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        onClick={() => toggleOption(opt.id)}
                        style={{
                          background: active ? "rgba(0,232,124,0.1)" : "rgba(255,255,255,0.02)",
                          border: `1px solid ${active ? "rgba(0,232,124,0.5)" : "rgba(255,255,255,0.07)"}`,
                          color: active ? "var(--accent)" : "rgba(255,255,255,0.65)",
                          padding: "12px 10px",
                          textAlign: "center",
                          cursor: "pointer",
                          transition: "all 0.18s",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 8,
                        }}
                        onMouseEnter={(e) => { if (!active) { e.currentTarget.style.borderColor = "rgba(0,232,124,0.3)"; e.currentTarget.style.background = "rgba(0,232,124,0.05)"; } }}
                        onMouseLeave={(e) => { if (!active) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; } }}
                      >
                        <span style={{ color: active ? "var(--accent)" : "rgba(255,255,255,0.5)" }}>{opt.icon}</span>
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.04em" }}>{opt.label}</span>
                        <span style={{ fontSize: "0.58rem", color: active ? "rgba(0,232,124,0.7)" : "rgba(255,255,255,0.3)", letterSpacing: "0.04em" }}>{opt.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Шаг 2: Описание (необязательно) ── */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
                  ОПИСАНИЕ СИТУАЦИИ <span style={{ color: "rgba(255,255,255,0.2)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(необязательно)</span>
                </label>
                <textarea
                  value={form.desc}
                  onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
                  placeholder="Опишите ситуацию подробнее: где находитесь, что произошло..."
                  rows={3}
                  style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: "10px 14px", fontSize: "0.8rem", fontFamily: "var(--font-space-grotesk),sans-serif", outline: "none", resize: "none", borderRadius: 0, boxSizing: "border-box" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(0,232,124,0.4)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                />
              </div>

              {/* ── Шаг 3: Контакты ── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
                    ИМЯ <span style={{ color: "var(--accent)" }}>*</span>
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Иван"
                    style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: "10px 14px", fontSize: "0.8rem", fontFamily: "var(--font-space-grotesk),sans-serif", outline: "none", borderRadius: 0, boxSizing: "border-box" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(0,232,124,0.4)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
                    ТЕЛЕФОН <span style={{ color: "var(--accent)" }}>*</span>
                  </label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="+7 (999) 123-45-67"
                    style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: "10px 14px", fontSize: "0.8rem", fontFamily: "var(--font-space-grotesk),sans-serif", outline: "none", borderRadius: 0, boxSizing: "border-box" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(0,232,124,0.4)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                  />
                </div>
              </div>

              {/* ── Обещание обратного звонка ── */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "rgba(0,232,124,0.04)", border: "1px solid rgba(0,232,124,0.15)", marginBottom: 20 }}>
                <div style={{ color: "var(--accent)", flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
                  Наш специалист перезвонит вам <span style={{ color: "var(--accent)", fontWeight: 700 }}>в течение нескольких минут</span> — мы работаем 24/7
                </div>
              </div>

              {form.error && (
                <div style={{ fontSize: "0.72rem", color: "rgba(255,80,80,0.9)", marginBottom: 12 }}>{form.error}</div>
              )}

              {/* ── Кнопка отправки ── */}
              <button
                onClick={handleSend}
                disabled={!canSubmit}
                style={{
                  width: "100%",
                  padding: "14px 24px",
                  background: canSubmit ? "var(--accent)" : "rgba(255,255,255,0.05)",
                  color: canSubmit ? "#040508" : "rgba(255,255,255,0.2)",
                  border: "none",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  cursor: canSubmit ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                  boxShadow: canSubmit ? "0 0 24px rgba(0,232,124,0.3)" : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  fontFamily: "var(--font-space-grotesk),sans-serif",
                }}
              >
                {form.sending ? (
                  "Отправка..."
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    Отправить заявку — перезвоним сами
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
