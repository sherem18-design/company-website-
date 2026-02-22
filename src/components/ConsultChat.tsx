"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

type Msg = { from: "bot" | "user"; text: string; time: string };

const QUICK = [
  "Как оформить ОСАГО?",
  "Нужен эвакуатор",
  "Вопрос по ДТП",
  "Помощь с европротоколом",
  "Консультация по КАСКО",
];

const BOT_REPLIES: Record<string, string> = {
  "Как оформить ОСАГО?": "Для оформления ОСАГО перейдите в раздел «ОСАГО онлайн» — заполните форму, и специалист свяжется в течение 15 минут. Нужны: паспорт, ПТС/СТС, данные водителей.",
  "Нужен эвакуатор": "Переходите на страницу «Эвакуация» — укажите адрес и данные авто. Диспетчер перезвонит в течение 3 минут. Либо звоните напрямую: 8-800-XXX-XX-XX.",
  "Вопрос по ДТП": "Открывайте раздел «Помощь при ДТП» — там пошаговая инструкция по каждой ситуации. Если нужна живая помощь — звоните на горячую линию прямо сейчас.",
  "Помощь с европротоколом": "Заполнить европротокол онлайн можно в разделе «Европротокол онлайн». Работает с функцией сканирования документов. Применимо если: 2 ТС, нет пострадавших, у всех есть ОСАГО.",
  "Консультация по КАСКО": "Рассчитаем КАСКО для вашего авто — перейдите в раздел «Страхование» и выберите КАСКО. Специалист подберёт условия и стоимость под ваш запрос.",
};

const DEFAULT_REPLY = "Понял вас! Сейчас соединяю со специалистом. Вы также можете позвонить на горячую линию: 8-800-XXX-XX-XX — ответим немедленно.";

function now() {
  return new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

const INIT_TEXT = "Здравствуйте! Я — Е-Спасатель. Выберите тему обращения или напишите свой вопрос.";

/* ─── Request form ─── */
function RequestForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", phone: "", service: "", desc: "", sent: false, sending: false, error: "" });
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name || !form.phone) return;
    setForm((f) => ({ ...f, sending: true, error: "" }));
    try {
      const res = await fetch("/api/send-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          service: form.service,
          desc: form.desc,
          source: "Форма заявки (Консультации)",
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
      <div className="text-center py-6">
        <div className="mb-3 flex items-center justify-center">
          <div className="w-10 h-10 flex items-center justify-center" style={{ border: "1px solid rgba(0,232,124,0.4)", background: "rgba(0,232,124,0.1)", color: "var(--accent)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        </div>
        <div className="text-sm font-bold text-white mb-1">Заявка принята!</div>
        <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>Свяжемся в течение 15 минут</p>
        <button onClick={onClose} className="btn-neon px-6 py-2 text-xs font-bold tracking-widest uppercase">Закрыть</button>
      </div>
    );
  }

  const inputStyle = {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff", padding: "8px 12px", fontSize: "0.8rem",
    fontFamily: "var(--font-space-grotesk),sans-serif", outline: "none",
    borderRadius: 0, width: "100%", transition: "border-color 0.2s",
  };

  return (
    <div className="space-y-3 p-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="text-[9px] font-bold tracking-widest uppercase" style={{ color: "var(--accent)" }}>ОСТАВИТЬ ЗАЯВКУ</div>
      {[
        { label: "Ваше имя", key: "name" as const, placeholder: "Иван" },
        { label: "Телефон", key: "phone" as const, placeholder: "+7 (___) ___-__-__" },
      ].map((f) => (
        <div key={f.key}>
          <label className="text-[9px] tracking-widest uppercase block mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>{f.label}</label>
          <input value={form[f.key]} onChange={(e) => set(f.key)(e.target.value)} placeholder={f.placeholder} style={inputStyle}
            onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(0,232,124,0.5)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
          />
        </div>
      ))}
      <div>
        <label className="text-[9px] tracking-widest uppercase block mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>Услуга</label>
        <select value={form.service} onChange={(e) => set("service")(e.target.value)} style={{ ...inputStyle, cursor: "pointer", appearance: "none" }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(0,232,124,0.5)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
          <option value="">— Выберите —</option>
          {["ОСАГО", "КАСКО", "Европротокол", "Эвакуация", "Помощь при ДТП", "Консультация", "Другое"].map((s) => (
            <option key={s} value={s} style={{ background: "#0b0c10" }}>{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-[9px] tracking-widest uppercase block mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>Описание</label>
        <textarea value={form.desc} onChange={(e) => set("desc")(e.target.value)} placeholder="Кратко опишите вашу ситуацию..." rows={3} style={{ ...inputStyle, resize: "none" }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(0,232,124,0.5)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
        />
      </div>
      {form.error && (
        <div className="text-[10px] text-center" style={{ color: "rgba(255,80,80,0.9)" }}>{form.error}</div>
      )}
      <button
        onClick={handleSubmit}
        disabled={!form.name || !form.phone || form.sending}
        className="w-full py-2.5 text-xs font-bold tracking-widest uppercase transition-all duration-300"
        style={{
          background: form.name && form.phone && !form.sending ? "var(--accent)" : "rgba(255,255,255,0.05)",
          color: form.name && form.phone && !form.sending ? "#040508" : "rgba(255,255,255,0.2)",
          cursor: form.name && form.phone && !form.sending ? "pointer" : "not-allowed",
          boxShadow: form.name && form.phone && !form.sending ? "0 0 20px rgba(0,232,124,0.25)" : "none",
        }}>
        {form.sending ? "Отправка..." : "Отправить заявку"}
      </button>
    </div>
  );
}

/* ─── Main chat widget (embeddable in section) ─── */
export default function ConsultChat() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "bot", text: INIT_TEXT, time: "" },
  ]);
  const [input, setInput] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [typing, setTyping] = useState(false);
  const msgsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMsgs([{ from: "bot", text: INIT_TEXT, time: now() }]);
  }, []);

  useEffect(() => {
    const el = msgsContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, typing]);

  const sendMsg = useCallback((text: string) => {
    if (!text.trim()) return;
    const t = now();
    setMsgs((m) => [...m, { from: "user", text, time: t }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { from: "bot", text: BOT_REPLIES[text] ?? DEFAULT_REPLY, time: now() }]);
    }, 1100);
  }, []);

  return (
    <div
      className="flex flex-col"
      style={{
        background: "rgba(6,6,8,0.92)",
        border: "1px solid rgba(0,232,124,0.18)",
        boxShadow: "0 0 40px rgba(0,232,124,0.07)",
        height: 480,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: "1px solid rgba(0,232,124,0.12)", background: "rgba(0,232,124,0.05)" }}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 flex items-center justify-center" style={{ border: "1px solid rgba(0,232,124,0.4)", background: "rgba(0,232,124,0.1)", color: "var(--accent)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                <rect x="3" y="11" width="18" height="10" rx="0.5"/>
                <path d="M12 3v4M8 11V7h8v4"/>
                <circle cx="9" cy="16" r="1" fill="currentColor" stroke="none"/>
                <circle cx="15" cy="16" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full" style={{ background: "var(--accent)", border: "1px solid #060608", animation: "pulse-dot 2s ease-in-out infinite" }} />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Е-Спасатель</div>
            <div className="text-[9px]" style={{ color: "var(--accent)" }}>● Онлайн</div>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 transition-all duration-200"
          style={{ border: "1px solid rgba(0,232,124,0.3)", color: "var(--accent)", background: showForm ? "rgba(0,232,124,0.1)" : "transparent" }}
        >
          {showForm ? "× Закрыть" : "+ Заявка"}
        </button>
      </div>

      {showForm ? (
        <div className="flex-1 overflow-y-auto">
          <RequestForm onClose={() => setShowForm(false)} />
        </div>
      ) : (
        <>
          {/* Messages */}
          <div ref={msgsContainerRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div style={{ maxWidth: "80%" }}>
                  <div
                    className="text-sm leading-relaxed px-3 py-2.5"
                    style={{
                      background: m.from === "bot" ? "rgba(0,232,124,0.07)" : "rgba(255,255,255,0.07)",
                      border: m.from === "bot" ? "1px solid rgba(0,232,124,0.18)" : "1px solid rgba(255,255,255,0.1)",
                      color: m.from === "bot" ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.75)",
                      borderRadius: m.from === "bot" ? "0 8px 8px 8px" : "8px 0 8px 8px",
                    }}
                  >
                    {m.text}
                  </div>
                  <div className="mt-1 text-[8px] px-1" style={{ color: "rgba(255,255,255,0.2)", textAlign: m.from === "user" ? "right" : "left" }}>{m.time}</div>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="px-3 py-2.5 flex items-center gap-1.5" style={{ background: "rgba(0,232,124,0.07)", border: "1px solid rgba(0,232,124,0.18)", borderRadius: "0 8px 8px 8px" }}>
                  {[0, 0.2, 0.4].map((d, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)", animation: `bounce 1s ease-in-out ${d}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick replies */}
          <div className="px-4 py-2 flex gap-2 overflow-x-auto flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            {QUICK.map((q) => (
              <button key={q} onClick={() => sendMsg(q)}
                className="flex-shrink-0 text-[10px] font-bold tracking-wide px-3 py-1.5 transition-all duration-200 whitespace-nowrap"
                style={{ border: "1px solid rgba(0,232,124,0.25)", color: "rgba(0,232,124,0.8)", background: "transparent" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(0,232,124,0.08)"; (e.currentTarget as HTMLElement).style.color = "var(--accent)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(0,232,124,0.8)"; }}>
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-4 py-3 flex gap-2 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMsg(input)}
              placeholder="Напишите сообщение..."
              style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "8px 12px", fontSize: "0.8rem", fontFamily: "var(--font-space-grotesk),sans-serif", outline: "none", borderRadius: 0 }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(0,232,124,0.4)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
            />
            <button
              onClick={() => sendMsg(input)}
              style={{ background: input.trim() ? "var(--accent)" : "rgba(255,255,255,0.05)", color: input.trim() ? "#040508" : "rgba(255,255,255,0.2)", border: "none", padding: "8px 14px", cursor: input.trim() ? "pointer" : "default", transition: "all 0.2s", flexShrink: 0 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </>
      )}

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-4px); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
