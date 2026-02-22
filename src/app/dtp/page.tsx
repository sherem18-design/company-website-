"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Header from "@/components/Header";

/* ─── Types ─── */
type Answer = "yes" | "no" | string;

interface Question {
  id: string;
  text: string;
  sub?: string;
  type: "choice" | "input";
  choices?: { value: Answer; label: string }[];
  placeholder?: string;
  inputKey?: string;
}

/* ─── Q&A Flow ─── */
const QUESTIONS: Question[] = [
  {
    id: "q1",
    text: "Есть ли пострадавшие в ДТП?",
    sub: "Люди с травмами или в тяжёлом состоянии",
    type: "choice",
    choices: [
      { value: "yes", label: "Да, есть пострадавшие" },
      { value: "no",  label: "Нет пострадавших" },
    ],
  },
  {
    id: "q2",
    text: "Сколько автомобилей участвовало?",
    sub: "Считайте все транспортные средства",
    type: "choice",
    choices: [
      { value: "two",  label: "Только 2 автомобиля" },
      { value: "more", label: "3 и более" },
    ],
  },
  {
    id: "q3",
    text: "У всех участников есть действующий полис ОСАГО?",
    sub: "Проверьте страховку каждого участника",
    type: "choice",
    choices: [
      { value: "yes", label: "Да, у всех есть ОСАГО" },
      { value: "no",  label: "У кого-то нет / не знаю" },
    ],
  },
  {
    id: "q4",
    text: "Есть ли разногласия по обстоятельствам ДТП?",
    sub: "Спорите о том, кто виноват?",
    type: "choice",
    choices: [
      { value: "no",  label: "Нет, всё согласовано" },
      { value: "yes", label: "Да, есть споры" },
    ],
  },
  {
    id: "q5",
    text: "Введите ваше имя",
    sub: "Для персонализации инструкций",
    type: "input",
    placeholder: "Иван Иванов",
    inputKey: "name",
  },
  {
    id: "q6",
    text: "Номер вашего полиса ОСАГО",
    sub: "Серия и номер (например: ААА 1234567890)",
    type: "input",
    placeholder: "ААА 1234567890",
    inputKey: "policy",
  },
  {
    id: "q7",
    text: "Госномер вашего автомобиля",
    sub: "Например: А 123 ВС 77",
    type: "input",
    placeholder: "А 123 ВС 77",
    inputKey: "plate",
  },
];

/* ─── Result logic ─── */
function getResult(answers: Record<string, Answer>) {
  const hasVictims    = answers.q1 === "yes";
  const moreThanTwo  = answers.q2 === "more";
  const allHaveOsago = answers.q3 === "yes";
  const disputed     = answers.q4 === "yes";
  const euroOk = !hasVictims && !moreThanTwo && allHaveOsago && !disputed;

  return {
    euroOk,
    hasVictims,
    steps: euroOk
      ? [
          { num: "01", tag: "БЕЗОПАСНОСТЬ",    title: "Включите аварийку и выставьте знак",  text: "Аварийная сигнализация — сразу. Знак — не менее 15 м в населённом пункте, 30 м вне его." },
          { num: "02", tag: "ДОКУМЕНТЫ",       title: "Снимите место ДТП на фото/видео",      text: "Снимайте со всех углов: расположение ТС, повреждения, следы торможения, разметку, знаки." },
          { num: "03", tag: "ОБМЕН ДАННЫМИ",   title: "Обменяйтесь данными с участником",    text: "ФИО, телефон, госномер, серия и номер полиса ОСАГО. Запишите данные свидетелей." },
          { num: "04", tag: "ЕВРОПРОТОКОЛ",    title: "Заполните извещение о ДТП",           text: "Оба участника заполняют одно извещение. Подписи обоих обязательны. Не оставляйте пустых граф." },
          { num: "05", tag: "СТРАХОВАНИЕ",     title: "Уведомите страховую немедленно",      text: "Позвоните в вашу страховую. Срок подачи заявления — 5 рабочих дней. Авто не ремонтировать." },
        ]
      : [
          { num: "01", tag: "ЭКСТРЕННЫЕ СЛУЖБЫ", title: "Вызовите ГИБДД, скорую (при необходимости)", text: `${hasVictims ? "⚠️ ЕСТЬ ПОСТРАДАВШИЕ — 103 (скорая) и 102 (полиция) немедленно!" : "Вызовите ГИБДД по номеру 102 или через приложение."}` },
          { num: "02", tag: "БЕЗОПАСНОСТЬ",    title: "Аварийка и знак аварийной остановки", text: "Включите аварийку. Знак — 15 м (город) / 30 м (трасса). Не перемещайте ТС." },
          { num: "03", tag: "ФОТОФИКСАЦИЯ",    title: "Зафиксируйте место ДТП",              text: "Сфотографируйте ТС, повреждения, следы, знаки, разметку. Снимите видео с регистратора." },
          { num: "04", tag: "ОБМЕН ДАННЫМИ",   title: "Запишите данные всех участников",     text: "ФИО, телефон, ВУ, госномер, полис ОСАГО. Запишите очевидцев. Не подписывайте ничего до ГИБДД." },
          { num: "05", tag: "ДОКУМЕНТЫ",       title: "Оформите документы с инспектором",    text: "Проверьте протокол. Если не согласны — укажите разногласия. Получите справку о ДТП и постановление." },
          { num: "06", tag: "СТРАХОВАНИЕ",     title: "Обратитесь в страховую (до 5 дней)",  text: "Уведомите свою страховую компанию. Не ремонтируйте ТС до осмотра страховщиком." },
        ],
  };
}

/* ─── 3D Background ─── */
function DtpBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let rafId: number;
    let tx = 0, ty = 0;

    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      tx = ((e.clientX - cx) / cx) * 6;
      ty = ((e.clientY - cy) / cy) * -4;
    };

    const tick = () => {
      el.style.transform = `perspective(900px) rotateY(${tx}deg) rotateX(${ty}deg) scale(1.12)`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden" style={{ transformStyle: "preserve-3d" }}>
      <div ref={ref} className="absolute inset-0 transition-transform duration-75 ease-out" style={{ willChange: "transform" }}>
        <Image
          src="/dtp-bg.jpg"
          alt=""
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
      {/* Overlays */}
      <div className="absolute inset-0 bg-black/62" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 10%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.88) 100%)" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 30%, transparent 65%, rgba(6,6,8,1) 100%)" }} />
      {/* Green tint glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(0,232,124,0.055) 0%, transparent 60%)" }} />
      {/* Scan line */}
      <div className="absolute inset-x-0 h-px opacity-20" style={{ top: "38%", background: "linear-gradient(90deg, transparent, var(--accent), transparent)", animation: "holoDrift 12s ease-in-out infinite" }} />
    </div>
  );
}

/* ─── Consent Modal ─── */
function ConsentModal({ onAccept }: { onAccept: () => void }) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(8px)" }}>
      <div className="relative w-full max-w-md" style={{ background: "var(--bg-2)", border: "1px solid rgba(0,232,124,0.2)", boxShadow: "0 0 60px rgba(0,232,124,0.1)" }}>
        {/* Top accent */}
        <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }} />

        <div className="p-8">
          <div className="mb-5 inline-flex items-center gap-3">
            <div className="h-px w-6" style={{ background: "var(--accent)" }} />
            <span className="hud-label text-[9px]">СОГЛАСИЕ НА ОБРАБОТКУ ДАННЫХ</span>
          </div>

          <h2 className="hud-title text-xl text-white mb-4">Перед началом</h2>

          <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
            Для предоставления персонализированных инструкций мы запросим ряд данных: ваше имя, номер полиса ОСАГО и госномер ТС. Данные используются исключительно в рамках текущей сессии и не передаются третьим лицам.
          </p>

          <label className="flex items-start gap-3 cursor-pointer group mb-8">
            <div
              className="flex-shrink-0 w-5 h-5 border flex items-center justify-center transition-all duration-200 mt-0.5"
              style={{
                borderColor: checked ? "var(--accent)" : "rgba(255,255,255,0.2)",
                background: checked ? "rgba(0,232,124,0.15)" : "transparent",
              }}
              onClick={() => setChecked(!checked)}
            >
              {checked && (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" style={{ color: "var(--accent)" }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              Я согласен на обработку персональных данных в соответствии с Федеральным законом №152-ФЗ «О персональных данных»
            </span>
          </label>

          <button
            onClick={onAccept}
            disabled={!checked}
            className="w-full py-4 text-sm font-bold tracking-[0.16em] uppercase transition-all duration-300"
            style={{
              background: checked ? "var(--accent)" : "rgba(255,255,255,0.05)",
              color: checked ? "#040508" : "rgba(255,255,255,0.2)",
              border: checked ? "none" : "1px solid rgba(255,255,255,0.08)",
              cursor: checked ? "pointer" : "not-allowed",
              boxShadow: checked ? "0 0 32px rgba(0,232,124,0.3)" : "none",
            }}
          >
            Начать сеанс помощи
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Assistant Widget ─── */
function Assistant() {
  const [step, setStep]       = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [inputVal, setInputVal] = useState("");
  const [done, setDone]       = useState(false);

  const current = QUESTIONS[step];
  const result  = done ? getResult(answers) : null;

  const handleChoice = useCallback((value: Answer) => {
    const next = { ...answers, [current.id]: value };
    setAnswers(next);
    if (step + 1 < QUESTIONS.length) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  }, [answers, current, step]);

  const handleInput = useCallback(() => {
    if (!inputVal.trim()) return;
    const key = current.inputKey ?? current.id;
    const next = { ...answers, [current.id]: inputVal.trim(), [key]: inputVal.trim() };
    setAnswers(next);
    setInputVal("");
    if (step + 1 < QUESTIONS.length) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  }, [answers, current, inputVal, step]);

  const progress = Math.round((step / QUESTIONS.length) * 100);

  if (done && result) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        {/* Result header */}
        <div className="mb-8 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 mb-4"
            style={{ background: result.euroOk ? "rgba(0,232,124,0.1)" : "rgba(255,80,80,0.08)", border: `1px solid ${result.euroOk ? "rgba(0,232,124,0.3)" : "rgba(255,80,80,0.2)"}` }}
          >
            <div className="w-2 h-2 rounded-full animate-pulse-dot" style={{ background: result.euroOk ? "var(--accent)" : "#ff5050" }} />
            <span className="hud-label text-[9px]" style={{ color: result.euroOk ? "var(--accent)" : "#ff8080" }}>
              {result.euroOk ? "ЕВРОПРОТОКОЛ ПРИМЕНИМ" : "ВЫЗОВ ГИБДД ОБЯЗАТЕЛЕН"}
            </span>
          </div>

          <h2 className="hud-title text-2xl sm:text-3xl text-white mb-2">
            {answers.name ? `${answers.name}, ` : ""}
            {result.euroOk ? "можно оформить без ГИБДД" : "следуйте инструкциям"}
          </h2>
          {answers.policy && (
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
              Полис ОСАГО: <span style={{ color: "var(--accent)" }}>{answers.policy}</span>
              {answers.plate && <> · ТС: <span style={{ color: "var(--accent)" }}>{answers.plate}</span></>}
            </p>
          )}
        </div>

        {/* Steps */}
        <div className="grid gap-px">
          {result.steps.map((s) => (
            <div key={s.num} className="hud-card p-6 cursor-default" style={{ borderRadius: 0 }}>
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-9 h-9 flex items-center justify-center border text-xs font-bold"
                  style={{ borderColor: "rgba(0,232,124,0.3)", background: "rgba(0,232,124,0.06)", color: "var(--accent)", fontFamily: "var(--font-geist-mono)" }}
                >
                  {s.num}
                </div>
                <div>
                  <span className="hud-label text-[8px] block mb-1" style={{ opacity: 0.5 }}>{s.tag}</span>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-1">{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{s.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-4 flex-wrap justify-center">
          <a href="/#contacts" className="btn-primary inline-flex items-center justify-center rounded-none px-8 py-3 text-sm font-bold tracking-[0.14em] uppercase">
            Получить помощь специалиста
          </a>
          <button
            onClick={() => { setStep(0); setAnswers({}); setDone(false); setInputVal(""); }}
            className="btn-neon inline-flex items-center justify-center rounded-none px-8 py-3 text-sm font-bold tracking-[0.14em] uppercase"
          >
            Начать заново
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="hud-label text-[9px]" style={{ opacity: 0.4 }}>ШАГ {step + 1} / {QUESTIONS.length}</span>
          <span className="hud-label text-[9px]" style={{ opacity: 0.4 }}>{progress}%</span>
        </div>
        <div className="h-px w-full" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div className="h-full transition-all duration-500" style={{ width: `${progress}%`, background: "var(--accent)", boxShadow: "0 0 8px var(--accent-glow)" }} />
        </div>
      </div>

      {/* Question card */}
      <div
        className="hud-card p-8"
        style={{ borderRadius: 0, borderTop: "2px solid rgba(0,232,124,0.35)" }}
        key={current.id}
      >
        {/* Bot icon */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-8 h-8 flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(0,232,124,0.1)", border: "1px solid rgba(0,232,124,0.3)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" style={{ color: "var(--accent)" }}>
              <rect x="3" y="11" width="18" height="10" rx="0.5"/>
              <path d="M12 3v4M8 11V7h8v4"/>
              <circle cx="9" cy="16" r="1" fill="currentColor" stroke="none"/>
              <circle cx="15" cy="16" r="1" fill="currentColor" stroke="none"/>
            </svg>
          </div>
          <span className="hud-label text-[9px]" style={{ opacity: 0.5 }}>Е-СПАСАТЕЛЬ · АССИСТЕНТ</span>
        </div>

        <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wide leading-snug">
          {current.text}
        </h3>
        {current.sub && (
          <p className="text-xs mb-6 leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
            {current.sub}
          </p>
        )}

        {current.type === "choice" && (
          <div className="grid gap-3">
            {current.choices!.map((c) => (
              <button
                key={c.value}
                onClick={() => handleChoice(c.value)}
                className="group text-left px-5 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-200"
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "transparent",
                  color: "rgba(255,255,255,0.6)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,232,124,0.4)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(0,232,124,0.06)";
                  (e.currentTarget as HTMLElement).style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)";
                }}
              >
                <span className="inline-flex items-center gap-3">
                  <span
                    className="inline-block w-4 h-4 border flex-shrink-0"
                    style={{ borderColor: "rgba(0,232,124,0.3)" }}
                  />
                  {c.label}
                </span>
              </button>
            ))}
          </div>
        )}

        {current.type === "input" && (
          <div className="flex flex-col gap-3">
            <input
              autoFocus
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInput()}
              placeholder={current.placeholder}
              className="w-full px-4 py-3 text-sm text-white bg-transparent outline-none transition-all duration-200"
              style={{
                border: "1px solid rgba(0,232,124,0.25)",
                background: "rgba(0,232,124,0.03)",
                fontFamily: "inherit",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(0,232,124,0.6)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(0,232,124,0.25)")}
            />
            <button
              onClick={handleInput}
              disabled={!inputVal.trim()}
              className="self-end px-6 py-3 text-xs font-bold tracking-[0.16em] uppercase transition-all duration-200"
              style={{
                background: inputVal.trim() ? "var(--accent)" : "rgba(255,255,255,0.05)",
                color: inputVal.trim() ? "#040508" : "rgba(255,255,255,0.2)",
                border: inputVal.trim() ? "none" : "1px solid rgba(255,255,255,0.08)",
                cursor: inputVal.trim() ? "pointer" : "not-allowed",
              }}
            >
              Далее →
            </button>
          </div>
        )}
      </div>

      {step > 0 && (
        <button
          onClick={() => { setStep(step - 1); setInputVal(""); }}
          className="mt-4 text-xs font-bold tracking-[0.14em] uppercase transition-colors duration-200"
          style={{ color: "rgba(255,255,255,0.25)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.25)")}
        >
          ← Назад
        </button>
      )}
    </div>
  );
}

/* ─── Page ─── */
export default function DtpPage() {
  const [showConsent, setShowConsent] = useState(false);
  const [started, setStarted]         = useState(false);

  const handleStart = () => setShowConsent(true);
  const handleAccept = () => { setShowConsent(false); setStarted(true); };

  return (
    <div className="min-h-screen text-white" style={{ background: "var(--bg)" }}>
      <Header />

      {showConsent && <ConsentModal onAccept={handleAccept} />}

      {/* ── Hero with 3D background ── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden grain pt-16">
        <DtpBackground />

        {/* HUD corner brackets */}
        <div className="absolute top-24 left-6 w-12 h-12 hidden lg:block" style={{ borderTop: "1px solid rgba(0,232,124,0.3)", borderLeft: "1px solid rgba(0,232,124,0.3)" }} />
        <div className="absolute top-24 right-6 w-12 h-12 hidden lg:block" style={{ borderTop: "1px solid rgba(0,232,124,0.3)", borderRight: "1px solid rgba(0,232,124,0.3)" }} />
        <div className="absolute bottom-12 left-6 w-12 h-12 hidden lg:block" style={{ borderBottom: "1px solid rgba(0,232,124,0.3)", borderLeft: "1px solid rgba(0,232,124,0.3)" }} />
        <div className="absolute bottom-12 right-6 w-12 h-12 hidden lg:block" style={{ borderBottom: "1px solid rgba(0,232,124,0.3)", borderRight: "1px solid rgba(0,232,124,0.3)" }} />

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          {!started ? (
            <>
              <div className="mb-6 inline-flex items-center gap-3 animate-fade-up">
                <div className="h-px w-10" style={{ background: "var(--accent)" }} />
                <span className="hud-label tracking-[0.28em]">АВАРИЙНЫЙ ПРОТОКОЛ</span>
                <div className="h-px w-10" style={{ background: "var(--accent)" }} />
              </div>

              <h1
                className="hud-title text-5xl sm:text-6xl lg:text-7xl text-white mb-6 animate-fade-up"
                style={{ textShadow: "0 0 80px rgba(0,232,124,0.18), 0 4px 40px rgba(0,0,0,0.9)", lineHeight: 1.05 }}
              >
                Помощь при{" "}
                <span style={{ color: "var(--accent)", textShadow: "0 0 48px rgba(0,232,124,0.5)" }}>
                  ДТП
                </span>
              </h1>

              <p className="text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-10 animate-fade-up-delay" style={{ color: "rgba(255,255,255,0.5)" }}>
                Ассистент задаст несколько вопросов и выдаст персональный алгоритм действий — именно для вашей ситуации.
              </p>

              <div className="animate-fade-up-delay-2">
                <button
                  onClick={handleStart}
                  className="btn-primary inline-flex items-center gap-3 rounded-none px-10 py-5 text-sm font-bold tracking-[0.18em] uppercase"
                  style={{ boxShadow: "0 0 40px rgba(0,232,124,0.25)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                  Начать
                </button>
              </div>

              {/* Quick info badges */}
              <div className="mt-12 flex flex-wrap justify-center gap-3 animate-fade-up-delay-2">
                {["Без регистрации", "Данные не хранятся", "Бесплатно", "24/7"].map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 text-[10px] font-bold tracking-[0.14em] uppercase"
                    style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.35)" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <Assistant />
          )}
        </div>

        {/* Scroll indicator (only when not started) */}
        {!started && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
            <span className="hud-label opacity-30 text-[8px]">ИНСТРУКЦИИ НИЖЕ</span>
            <div className="h-10 w-px" style={{ background: "linear-gradient(to bottom, var(--accent), transparent)", opacity: 0.4 }} />
          </div>
        )}
      </section>

      {/* ── Static steps (for reference) ── */}
      {!started && (
        <>
          <section className="py-24 px-6" style={{ background: "var(--bg)" }}>
            <div className="mx-auto max-w-5xl">
              <div className="mb-12 text-center">
                <div className="mb-5 inline-flex items-center gap-3">
                  <div className="h-px w-6" style={{ background: "var(--accent)" }} />
                  <span className="hud-label">ОБЩИЙ АЛГОРИТМ</span>
                  <div className="h-px w-6" style={{ background: "var(--accent)" }} />
                </div>
                <h2 className="hud-title text-3xl sm:text-4xl text-white">
                  Базовые <span style={{ color: "var(--accent)" }}>шаги</span>
                </h2>
              </div>

              <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { num: "01", tag: "БЕЗОПАСНОСТЬ",  title: "Аварийка и знак",     text: "Включить сразу. Знак — 15/30 м в зависимости от зоны." },
                  { num: "02", tag: "ПОМОЩЬ",         title: "Пострадавшие?",        text: "При травмах — 103 и 102 немедленно. Не перемещать." },
                  { num: "03", tag: "ФИКСАЦИЯ",       title: "Снимите на фото/видео", text: "ТС, повреждения, следы, знаки, разметку, свидетелей." },
                  { num: "04", tag: "СТРАХОВАНИЕ",    title: "Уведомите страховую",  text: "Не позднее 5 рабочих дней. Не ремонтируйте до осмотра." },
                ].map((s) => (
                  <div key={s.num} className="hud-card group p-6 flex flex-col items-center text-center cursor-default" style={{ borderRadius: 0 }}>
                    <div
                      className="w-10 h-10 flex items-center justify-center border mb-4"
                      style={{ borderColor: "rgba(0,232,124,0.25)", background: "rgba(0,232,124,0.05)" }}
                    >
                      <span className="text-xs font-bold" style={{ color: "var(--accent)", fontFamily: "var(--font-geist-mono)" }}>{s.num}</span>
                    </div>
                    <span className="hud-label text-[8px] mb-3" style={{ opacity: 0.5 }}>{s.tag}</span>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2 group-hover:text-[var(--accent)] transition-colors duration-200">{s.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{s.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="section-divider" />

          {/* CTA */}
          <section className="py-20 px-6 text-center">
            <div className="mx-auto max-w-xl">
              <p className="hud-label mb-4">НУЖНА ПОМОЩЬ ПРЯМО СЕЙЧАС?</p>
              <h2 className="hud-title text-3xl text-white mb-8">
                Свяжитесь с <span style={{ color: "var(--accent)" }}>специалистом</span>
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/#contacts" className="btn-primary inline-flex items-center justify-center rounded-none px-9 py-4 text-sm font-bold tracking-[0.16em] uppercase">
                  Получить помощь
                </a>
                <a href="/" className="btn-neon inline-flex items-center justify-center gap-2 rounded-none px-9 py-4 text-sm font-bold tracking-[0.16em] uppercase">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
                    <line x1="19" y1="12" x2="5" y2="12"/>
                    <polyline points="12 19 5 12 12 5"/>
                  </svg>
                  На главную
                </a>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
