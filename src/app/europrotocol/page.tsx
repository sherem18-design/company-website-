"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

/* ─── Types ─── */
interface ParticipantData {
  ownerName: string;
  ownerAddress: string;
  ownerPhone: string;
  brand: string;
  model: string;
  year: string;
  plate: string;
  vin: string;
  insurer: string;
  policyNumber: string;
  policyFrom: string;
  policyTo: string;
  driverName: string;
  driverLicense: string;
  driverPhone: string;
  damageZones: string;
}

interface FormData {
  date: string;
  time: string;
  city: string;
  street: string;
  house: string;
  participantA: ParticipantData;
  participantB: ParticipantData;
  circumstances: string[];
  notes: string;
}

/* ─── Circumstances list (from official RF europrotocol form) ─── */
const CIRCUMSTANCES = [
  "Стоял на стоянке/остановке",
  "Выезжал со стоянки/остановки",
  "Въезжал на стоянку/останавливался",
  "Двигался прямо",
  "Выполнял смену полосы движения",
  "Обгонял другое транспортное средство",
  "Поворачивал направо",
  "Поворачивал налево",
  "Выполнял разворот",
  "Двигался задним ходом",
  "Выезжал на полосу встречного движения",
  "Выезжал с прилегающей территории",
  "Выезжал с кругового движения",
  "Въезжал на круговое движение",
  "Не соблюдал дистанцию",
  "Не соблюдал боковой интервал",
];

const emptyParticipant = (): ParticipantData => ({
  ownerName: "",
  ownerAddress: "",
  ownerPhone: "",
  brand: "",
  model: "",
  year: "",
  plate: "",
  vin: "",
  insurer: "",
  policyNumber: "",
  policyFrom: "",
  policyTo: "",
  driverName: "",
  driverLicense: "",
  driverPhone: "",
  damageZones: "",
});

const STEPS = [
  { num: "01", title: "Место и время", tag: "ДАННЫЕ ДТП" },
  { num: "02", title: "Участник А", tag: "ПЕРВЫЙ УЧАСТНИК" },
  { num: "03", title: "Участник Б", tag: "ВТОРОЙ УЧАСТНИК" },
  { num: "04", title: "Обстоятельства", tag: "ОПИСАНИЕ ДТП" },
  { num: "05", title: "Итог", tag: "ПРОВЕРКА ДАННЫХ" },
];

/* ─── Animated scan line overlay ─── */
function ScanOverlay({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: "2px",
          background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
          boxShadow: "0 0 12px var(--accent-glow)",
          animation: "scanLine 1.8s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,232,124,0.04)",
          border: "1px solid rgba(0,232,124,0.3)",
        }}
      />
    </div>
  );
}

/* ─── Photo scan widget ─── */
function PhotoScanWidget({
  label,
  hint,
  onCapture,
}: {
  label: string;
  hint: string;
  onCapture?: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  const handleFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setScanning(true);
      const url = URL.createObjectURL(file);
      setPreview(url);
      onCapture?.(file);
      setTimeout(() => setScanning(false), 2000);
    },
    [onCapture]
  );

  return (
    <div
      className="relative cursor-pointer group"
      style={{
        border: "1px solid rgba(0,232,124,0.2)",
        background: "rgba(0,232,124,0.025)",
        minHeight: preview ? "auto" : "96px",
        transition: "border-color 0.3s, background 0.3s",
      }}
      onClick={() => inputRef.current?.click()}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,232,124,0.45)";
        (e.currentTarget as HTMLElement).style.background = "rgba(0,232,124,0.06)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,232,124,0.2)";
        (e.currentTarget as HTMLElement).style.background = "rgba(0,232,124,0.025)";
      }}
    >
      <ScanOverlay active={scanning} />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFile}
      />

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Скан документа"
            style={{ width: "100%", maxHeight: "200px", objectFit: "cover", display: "block" }}
          />
          <div
            className="absolute top-2 right-2 px-2 py-1 text-[8px] font-bold tracking-widest uppercase"
            style={{ background: "rgba(0,232,124,0.9)", color: "#040508" }}
          >
            {scanning ? "СКАНИРОВАНИЕ..." : "ДОКУМЕНТ ЗАГРУЖЕН"}
          </div>
          <div
            className="px-4 py-2 flex items-center gap-2 text-[9px] tracking-widest font-bold uppercase"
            style={{
              background: "rgba(6,6,8,0.85)",
              color: "rgba(255,255,255,0.5)",
              borderTop: "1px solid rgba(0,232,124,0.15)",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" style={{ color: "var(--accent)" }}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Нажмите для замены
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 p-6">
          <div
            className="w-10 h-10 flex items-center justify-center"
            style={{
              border: "1px solid rgba(0,232,124,0.35)",
              background: "rgba(0,232,124,0.07)",
              color: "var(--accent)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
              <rect x="3" y="3" width="18" height="18" rx="0.5" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <div className="text-center">
            <div className="text-xs font-bold text-white tracking-wide mb-1">{label}</div>
            <div className="text-[10px] tracking-wide" style={{ color: "rgba(255,255,255,0.35)" }}>
              {hint}
            </div>
          </div>
          <div
            className="px-3 py-1.5 text-[9px] font-bold tracking-[0.18em] uppercase transition-all duration-200 group-hover:shadow-[0_0_16px_rgba(0,232,124,0.3)]"
            style={{
              border: "1px solid rgba(0,232,124,0.4)",
              color: "var(--accent)",
              background: "rgba(0,232,124,0.06)",
            }}
          >
            Сканировать документ
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Form field ─── */
function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  hint,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
        className="text-[10px] font-bold tracking-[0.18em] uppercase"
        style={{ color: "rgba(255,255,255,0.5)" }}
      >
        {label}
        {required && (
          <span style={{ color: "var(--accent)", marginLeft: "4px" }}>*</span>
        )}
      </label>
      <input
        id={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#fff",
          padding: "10px 14px",
          fontSize: "0.875rem",
          fontFamily: "var(--font-space-grotesk), sans-serif",
          outline: "none",
          transition: "border-color 0.2s, background 0.2s",
          borderRadius: 0,
          width: "100%",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "rgba(0,232,124,0.5)";
          e.currentTarget.style.background = "rgba(0,232,124,0.04)";
          e.currentTarget.style.boxShadow = "0 0 0 1px rgba(0,232,124,0.15)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
          e.currentTarget.style.background = "rgba(255,255,255,0.03)";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
      {hint && (
        <span className="text-[9px] tracking-wide" style={{ color: "rgba(255,255,255,0.28)" }}>
          {hint}
        </span>
      )}
    </div>
  );
}

/* ─── Section divider ─── */
function SubSection({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="h-px w-4 flex-shrink-0" style={{ background: "var(--accent)", opacity: 0.6 }} />
      <span className="text-[9px] font-bold tracking-[0.22em] uppercase" style={{ color: "var(--accent)", opacity: 0.7 }}>
        {title}
      </span>
      <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
    </div>
  );
}

/* ─── Participant form ─── */
function ParticipantForm({
  data,
  onChange,
  label,
}: {
  data: ParticipantData;
  onChange: (d: ParticipantData) => void;
  label: "А" | "Б";
}) {
  const set = (key: keyof ParticipantData) => (val: string) =>
    onChange({ ...data, [key]: val });

  return (
    <div className="space-y-6">
      {/* Photo scan */}
      <div>
        <SubSection title="Сканирование документов" />
        <div className="grid gap-3 sm:grid-cols-2 mt-3">
          <PhotoScanWidget
            label="Полис ОСАГО"
            hint="Сфотографируйте полис ОСАГО участника"
          />
          <PhotoScanWidget
            label="СТС / ПТС"
            hint="Свидетельство о регистрации ТС"
          />
        </div>
        <p className="mt-2 text-[9px] tracking-wide" style={{ color: "rgba(255,255,255,0.25)" }}>
          После сканирования заполните поля ниже вручную
        </p>
      </div>

      {/* Owner */}
      <div>
        <SubSection title={`Владелец ТС · Участник ${label}`} />
        <div className="grid gap-4 sm:grid-cols-2 mt-3">
          <Field label="ФИО владельца" name={`owner-name-${label}`} value={data.ownerName} onChange={set("ownerName")} placeholder="Иванов Иван Иванович" required />
          <Field label="Телефон" name={`owner-phone-${label}`} value={data.ownerPhone} onChange={set("ownerPhone")} placeholder="+7 (___) ___-__-__" type="tel" required />
          <div className="sm:col-span-2">
            <Field label="Адрес владельца" name={`owner-addr-${label}`} value={data.ownerAddress} onChange={set("ownerAddress")} placeholder="г. Москва, ул. Ленина, д. 1, кв. 1" />
          </div>
        </div>
      </div>

      {/* Vehicle */}
      <div>
        <SubSection title="Транспортное средство" />
        <div className="grid gap-4 sm:grid-cols-3 mt-3">
          <Field label="Марка" name={`brand-${label}`} value={data.brand} onChange={set("brand")} placeholder="Toyota" required />
          <Field label="Модель" name={`model-${label}`} value={data.model} onChange={set("model")} placeholder="Camry" required />
          <Field label="Год выпуска" name={`year-${label}`} value={data.year} onChange={set("year")} placeholder="2020" type="number" />
          <Field label="Гос. номер" name={`plate-${label}`} value={data.plate} onChange={set("plate")} placeholder="А 123 ВС 77" required hint="Формат: А 123 ВС 77" />
          <div className="sm:col-span-2">
            <Field label="VIN / № кузова" name={`vin-${label}`} value={data.vin} onChange={set("vin")} placeholder="WVWZZZ3BZ3E123456" />
          </div>
          <div className="sm:col-span-3">
            <Field
              label="Повреждённые части автомобиля"
              name={`damage-${label}`}
              value={data.damageZones}
              onChange={set("damageZones")}
              placeholder="Передний бампер, капот, левое крыло..."
              hint="Опишите видимые повреждения"
            />
          </div>
        </div>
      </div>

      {/* Insurance */}
      <div>
        <SubSection title="Страховой полис ОСАГО" />
        <div className="grid gap-4 sm:grid-cols-3 mt-3">
          <div className="sm:col-span-2">
            <Field label="Страховая компания" name={`insurer-${label}`} value={data.insurer} onChange={set("insurer")} placeholder="АльфаСтрахование" required />
          </div>
          <Field label="Серия и № полиса" name={`policy-${label}`} value={data.policyNumber} onChange={set("policyNumber")} placeholder="МММ 0123456789" required />
          <Field label="Действителен с" name={`from-${label}`} value={data.policyFrom} onChange={set("policyFrom")} type="date" />
          <Field label="Действителен по" name={`to-${label}`} value={data.policyTo} onChange={set("policyTo")} type="date" />
        </div>
      </div>

      {/* Driver */}
      <div>
        <SubSection title="Водитель (если отличается от владельца)" />
        <div className="grid gap-4 sm:grid-cols-2 mt-3">
          <Field label="ФИО водителя" name={`driver-name-${label}`} value={data.driverName} onChange={set("driverName")} placeholder="Иванов Иван Иванович" />
          <Field label="Телефон водителя" name={`driver-phone-${label}`} value={data.driverPhone} onChange={set("driverPhone")} placeholder="+7 (___) ___-__-__" type="tel" />
          <div className="sm:col-span-2">
            <Field label="Серия и № водительского удостоверения" name={`license-${label}`} value={data.driverLicense} onChange={set("driverLicense")} placeholder="77 00 123456" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Review row ─── */
function ReviewRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <span className="text-[9px] font-bold tracking-[0.18em] uppercase w-36 flex-shrink-0 pt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</span>
      <span className="text-sm text-white flex-1">{value}</span>
    </div>
  );
}

/* ─── Main page ─── */
export default function EuroprotocolPage() {
  const [step, setStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<FormData>({
    date: "",
    time: "",
    city: "",
    street: "",
    house: "",
    participantA: emptyParticipant(),
    participantB: emptyParticipant(),
    circumstances: [],
    notes: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const goTo = useCallback((s: number) => {
    setStep(s);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const toggleCircumstance = (c: string) => {
    setForm((f) => ({
      ...f,
      circumstances: f.circumstances.includes(c)
        ? f.circumstances.filter((x) => x !== c)
        : [...f.circumstances, c],
    }));
  };

  const setA = (d: ParticipantData) => setForm((f) => ({ ...f, participantA: d }));
  const setB = (d: ParticipantData) => setForm((f) => ({ ...f, participantB: d }));

  if (!mounted) return null;

  if (submitted) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ background: "var(--bg)" }}
      >
        {/* Glowing emblem */}
        <div className="relative mb-8">
          <div
            className="absolute inset-0 blur-3xl"
            style={{ background: "radial-gradient(ellipse, rgba(0,232,124,0.25) 0%, transparent 70%)" }}
          />
          <Image src="/emblema.png" alt="" width={100} height={100} style={{ position: "relative", filter: "drop-shadow(0 0 24px rgba(0,232,124,0.5))" }} />
        </div>
        <div className="mb-3 inline-flex items-center gap-2">
          <div className="h-px w-6" style={{ background: "var(--accent)" }} />
          <span className="hud-label text-[9px]">ЕВРОПРОТОКОЛ // ОФОРМЛЕН</span>
          <div className="h-px w-6" style={{ background: "var(--accent)" }} />
        </div>
        <h1 className="hud-title text-3xl sm:text-4xl text-white mb-4">Готово!</h1>
        <p className="text-sm mb-8 max-w-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
          Европротокол сформирован. Распечатайте его и подпишите оба участника. Уведомите страховую компанию в течение 5 рабочих дней.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={() => window.print()}
            className="btn-primary px-8 py-3 text-sm font-bold tracking-[0.14em] uppercase"
          >
            Распечатать
          </button>
          <Link
            href="/"
            className="btn-neon px-8 py-3 text-sm font-bold tracking-[0.14em] uppercase text-center"
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
          >
            На главную
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* ── Background layers ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 20% 20%, rgba(0,232,124,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(0,232,124,0.03) 0%, transparent 50%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(0,232,124,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,232,124,0.025) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ── Header ── */}
      <header
        className="relative z-10 flex items-center justify-between px-6 py-4"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(6,6,8,0.92)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
        }}
      >
        <Link
          href="/"
          className="flex items-center gap-3 group"
          style={{ textDecoration: "none" }}
        >
          <div
            className="flex items-center justify-center w-8 h-8 transition-all duration-200 group-hover:border-[rgba(0,232,124,0.5)]"
            style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </div>
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase hidden sm:block" style={{ color: "rgba(255,255,255,0.3)" }}>
            Назад
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Image
            src="/emblema.png"
            alt="Е-Спасатель"
            width={32}
            height={32}
            style={{ opacity: 0.85 }}
          />
          <div>
            <div className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: "var(--accent)" }}>
              Е-Спасатель
            </div>
            <div className="text-[8px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
              Европротокол онлайн
            </div>
          </div>
        </div>

        <div className="text-[8px] font-bold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.2)" }}>
          РФ · 2025
        </div>
      </header>

      <div ref={topRef} className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 py-10 pb-24">
        {/* ── Title block ── */}
        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-3">
            <div className="h-px w-6 flex-shrink-0" style={{ background: "var(--accent)" }} />
            <span className="hud-label text-[9px]">ПРОТОКОЛ // ЦИФРОВОЙ ФОРМАТ</span>
          </div>
          <h1 className="hud-title text-3xl sm:text-5xl text-white mb-3">
            Европротокол
            <br />
            <span style={{ color: "var(--accent)" }}>онлайн</span>
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)", maxWidth: "480px" }}>
            Цифровое оформление извещения о ДТП без вызова ГИБДД. Только 2 участника, нет пострадавших, у всех есть ОСАГО.
          </p>
        </div>

        {/* ── App download block ── */}
        <div
          className="mb-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:gap-12 items-center p-6 sm:p-8"
          style={{ border: "1px solid rgba(0,232,124,0.18)", background: "rgba(0,232,124,0.025)", position: "relative", overflow: "hidden" }}
        >
          {/* glow corner */}
          <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none" style={{ background: "radial-gradient(circle at top right, rgba(0,232,124,0.12) 0%, transparent 65%)" }} />

          {/* Left: info + CTAs */}
          <div>
            <div className="text-[8px] font-bold tracking-[0.24em] uppercase mb-3" style={{ color: "var(--accent)", opacity: 0.7 }}>МОБИЛЬНОЕ ПРИЛОЖЕНИЕ</div>
            <h2 className="hud-title text-xl sm:text-2xl text-white mb-3">
              Европротокол прямо<br />в телефоне
            </h2>
            <p className="text-xs leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.4)" }}>
              Сканируйте документы камерой, заполняйте форму и отправляйте извещение прямо с экрана смартфона — без ПК и бумаг.
            </p>

            <ul className="space-y-2 mb-6">
              {[
                "Сканирование ОСАГО и СТС за 3 секунды",
                "Автозаполнение по VIN и гос. номеру",
                "Голосовой ввод описания обстоятельств",
                "Загрузка фото места ДТП прямо из камеры",
                "Готовый PDF для страховой одним нажатием",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" className="flex-shrink-0 mt-0.5" style={{ color: "var(--accent)" }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            {/* Download buttons */}
            <div className="flex gap-3 flex-wrap">
              {/* App Store */}
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-3 transition-all duration-300 group"
                style={{ border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.04)", textDecoration: "none", minWidth: 148 }}
                onClick={(e) => e.preventDefault()}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ color: "rgba(255,255,255,0.8)", flexShrink: 0 }}>
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div>
                  <div className="text-[9px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>Загрузить в</div>
                  <div className="text-sm font-bold text-white tracking-wide leading-tight">App Store</div>
                </div>
              </a>

              {/* Google Play */}
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-3 transition-all duration-300 group"
                style={{ border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.04)", textDecoration: "none", minWidth: 148 }}
                onClick={(e) => e.preventDefault()}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                  <path d="M3.18 23.76c.33.18.7.24 1.08.17l12.05-6.96-2.62-2.62-10.51 9.41z" style={{ fill: "#34A853" }} />
                  <path d="M21.6 10.4L18.73 8.8 15.8 11.73l2.93 2.93 2.9-1.68c.82-.48.82-1.63-.03-2.58z" style={{ fill: "#FBBC04" }} />
                  <path d="M2.26.95C2.1 1.18 2 1.5 2 1.87v20.27c0 .37.1.69.27.93l10.58-10.58L2.26.95z" style={{ fill: "#4285F4" }} />
                  <path d="M16.31 12l-3.62-3.62L1.98.67c.19-.1.41-.14.63-.1L16.31 12z" style={{ fill: "#EA4335" }} />
                </svg>
                <div>
                  <div className="text-[9px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>Доступно в</div>
                  <div className="text-sm font-bold text-white tracking-wide leading-tight">Google Play</div>
                </div>
              </a>
            </div>

            <p className="mt-3 text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>
              Приложение в разработке · Пока используйте веб-версию ниже
            </p>
          </div>

          {/* Right: CSS phone mockup */}
          <div className="hidden lg:flex justify-center">
            <div
              className="relative flex-shrink-0"
              style={{
                width: 170,
                height: 340,
                border: "2px solid rgba(0,232,124,0.3)",
                borderRadius: 28,
                background: "rgba(6,6,8,0.95)",
                boxShadow: "0 0 40px rgba(0,232,124,0.15), inset 0 0 20px rgba(0,232,124,0.04)",
                overflow: "hidden",
              }}
            >
              {/* Status bar */}
              <div className="flex items-center justify-between px-4 py-2" style={{ background: "rgba(0,232,124,0.05)", borderBottom: "1px solid rgba(0,232,124,0.1)" }}>
                <span style={{ fontSize: 7, color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-geist-mono)" }}>9:41</span>
                <div style={{ width: 32, height: 8, borderRadius: 4, background: "rgba(6,6,8,0.9)", border: "1px solid rgba(255,255,255,0.2)" }} />
                <div className="flex gap-1">
                  {[3, 5, 7].map((w) => (
                    <div key={w} style={{ width: w, height: 7, background: "var(--accent)", borderRadius: 1 }} />
                  ))}
                </div>
              </div>

              {/* App header */}
              <div className="px-3 py-2 flex items-center gap-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ width: 14, height: 14, border: "1px solid rgba(0,232,124,0.5)", borderRadius: 2, background: "rgba(0,232,124,0.1)" }} />
                <span style={{ fontSize: 7, fontWeight: 700, color: "var(--accent)", letterSpacing: 1 }}>Е-СПАСАТЕЛЬ</span>
              </div>

              {/* Progress bar */}
              <div className="px-3 pt-3 pb-2">
                <div style={{ height: 1.5, background: "rgba(255,255,255,0.06)", borderRadius: 1 }}>
                  <div style={{ width: "40%", height: "100%", background: "var(--accent)", boxShadow: "0 0 4px var(--accent-glow)" }} />
                </div>
                <div className="flex justify-between mt-1">
                  <span style={{ fontSize: 6, color: "rgba(255,255,255,0.3)" }}>ШАГ 2 / 5</span>
                  <span style={{ fontSize: 6, color: "rgba(0,232,124,0.6)" }}>40%</span>
                </div>
              </div>

              {/* Form fields */}
              <div className="px-3 space-y-2 pb-3">
                {[
                  { label: "Участник А", val: "Toyota Camry" },
                  { label: "Гос. номер", val: "А 123 ВС 77" },
                  { label: "ОСАГО", val: "АА 1234567890" },
                ].map((f) => (
                  <div key={f.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,232,124,0.15)", padding: "4px 6px" }}>
                    <div style={{ fontSize: 5, color: "rgba(0,232,124,0.6)", marginBottom: 1 }}>{f.label}</div>
                    <div style={{ fontSize: 7, color: "#fff" }}>{f.val}</div>
                  </div>
                ))}

                {/* Camera scan button */}
                <div style={{ background: "rgba(0,232,124,0.08)", border: "1px dashed rgba(0,232,124,0.3)", padding: "6px", display: "flex", alignItems: "center", gap: 4, justifyContent: "center" }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" style={{ color: "var(--accent)" }}>
                    <rect x="3" y="3" width="18" height="18" rx="0.5" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span style={{ fontSize: 6, color: "var(--accent)", fontWeight: 700 }}>СКАНИРОВАТЬ</span>
                </div>
              </div>

              {/* Bottom button */}
              <div className="absolute bottom-0 left-0 right-0 px-3 py-3" style={{ background: "linear-gradient(to top, rgba(6,6,8,1) 60%, transparent)" }}>
                <div style={{ background: "var(--accent)", padding: "6px", textAlign: "center" }}>
                  <span style={{ fontSize: 7, fontWeight: 700, color: "#040508", letterSpacing: 1 }}>ДАЛЕЕ →</span>
                </div>
              </div>

              {/* Scan line animation */}
              <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(0,232,124,0.03) 50%, transparent 100%)", animation: "holoDrift 6s ease-in-out infinite" }} />
            </div>
          </div>
        </div>

        {/* ── Conditions notice ── */}
        <div
          className="mb-8 p-4 flex gap-4 items-start"
          style={{
            background: "rgba(0,232,124,0.04)",
            border: "1px solid rgba(0,232,124,0.2)",
          }}
        >
          <div
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center"
            style={{ border: "1px solid rgba(0,232,124,0.35)", color: "var(--accent)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <div className="text-xs font-bold text-white tracking-wide mb-1">Условия применения европротокола</div>
            <ul className="text-[11px] leading-relaxed space-y-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
              <li>· Только 2 транспортных средства</li>
              <li>· Нет пострадавших людей</li>
              <li>· У всех участников есть действующий полис ОСАГО</li>
              <li>· Нет разногласий в обстоятельствах ДТП</li>
              <li>· Ущерб не превышает 100 000 ₽ (400 000 ₽ при наличии видеозаписи)</li>
            </ul>
          </div>
        </div>

        {/* ── Step nav ── */}
        <div className="mb-8">
          <div className="flex gap-1 overflow-x-auto pb-2">
            {STEPS.map((s, i) => (
              <button
                key={s.num}
                onClick={() => goTo(i)}
                className="flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 transition-all duration-300"
                style={{
                  background: step === i ? "rgba(0,232,124,0.08)" : "rgba(255,255,255,0.02)",
                  border: step === i ? "1px solid rgba(0,232,124,0.35)" : "1px solid rgba(255,255,255,0.06)",
                  color: step === i ? "var(--accent)" : "rgba(255,255,255,0.3)",
                  boxShadow: step === i ? "0 0 16px rgba(0,232,124,0.1)" : "none",
                  minWidth: "80px",
                }}
              >
                <span
                  className="font-bold text-base"
                  style={{
                    fontFamily: "var(--font-geist-mono)",
                    color: step === i ? "var(--accent)" : i < step ? "rgba(0,232,124,0.5)" : "rgba(255,255,255,0.2)",
                  }}
                >
                  {i < step ? "✓" : s.num}
                </span>
                <span className="text-[8px] font-bold tracking-[0.14em] uppercase text-center leading-tight">
                  {s.title}
                </span>
              </button>
            ))}
          </div>
          {/* Progress bar */}
          <div className="h-px w-full mt-2" style={{ background: "rgba(255,255,255,0.04)" }}>
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${((step) / (STEPS.length - 1)) * 100}%`,
                background: "linear-gradient(90deg, var(--accent), rgba(0,232,124,0.5))",
                boxShadow: "0 0 8px var(--accent-glow)",
              }}
            />
          </div>
        </div>

        {/* ── Step content ── */}
        <div
          key={step}
          style={{
            animation: "fadeInUp 0.35s ease forwards",
          }}
        >
          {/* Step tag */}
          <div className="mb-6 flex items-center gap-3">
            <div
              className="w-9 h-9 flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{
                border: "1px solid rgba(0,232,124,0.35)",
                background: "rgba(0,232,124,0.07)",
                color: "var(--accent)",
                fontFamily: "var(--font-geist-mono)",
              }}
            >
              {STEPS[step].num}
            </div>
            <div>
              <div className="text-[8px] font-bold tracking-[0.22em] uppercase" style={{ color: "rgba(0,232,124,0.6)" }}>
                {STEPS[step].tag}
              </div>
              <div className="text-lg font-bold text-white uppercase tracking-wide">
                {STEPS[step].title}
              </div>
            </div>
          </div>

          {/* ── STEP 0: Location & time ── */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <SubSection title="Дата и время ДТП" />
                <div className="grid gap-4 sm:grid-cols-2 mt-3">
                  <Field
                    label="Дата ДТП"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={(v) => setForm((f) => ({ ...f, date: v }))}
                    required
                  />
                  <Field
                    label="Время ДТП"
                    name="time"
                    type="time"
                    value={form.time}
                    onChange={(v) => setForm((f) => ({ ...f, time: v }))}
                    required
                  />
                </div>
              </div>

              <div>
                <SubSection title="Место ДТП" />
                <div className="grid gap-4 sm:grid-cols-3 mt-3">
                  <div className="sm:col-span-2">
                    <Field
                      label="Город / населённый пункт"
                      name="city"
                      value={form.city}
                      onChange={(v) => setForm((f) => ({ ...f, city: v }))}
                      placeholder="Москва"
                      required
                    />
                  </div>
                  <Field
                    label="Улица / трасса"
                    name="street"
                    value={form.street}
                    onChange={(v) => setForm((f) => ({ ...f, street: v }))}
                    placeholder="ул. Ленина"
                    required
                  />
                  <Field
                    label="Дом / км"
                    name="house"
                    value={form.house}
                    onChange={(v) => setForm((f) => ({ ...f, house: v }))}
                    placeholder="12"
                  />
                </div>
              </div>

              {/* Photo of accident scene */}
              <div>
                <SubSection title="Фотофиксация места ДТП" />
                <div className="grid gap-3 sm:grid-cols-2 mt-3">
                  <PhotoScanWidget
                    label="Место столкновения"
                    hint="Общий вид места ДТП с госномерами"
                  />
                  <PhotoScanWidget
                    label="Схема расположения ТС"
                    hint="Расположение автомобилей после ДТП"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 1: Participant A ── */}
          {step === 1 && (
            <ParticipantForm data={form.participantA} onChange={setA} label="А" />
          )}

          {/* ── STEP 2: Participant B ── */}
          {step === 2 && (
            <ParticipantForm data={form.participantB} onChange={setB} label="Б" />
          )}

          {/* ── STEP 3: Circumstances ── */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <SubSection title="Обстоятельства ДТП" />
                <p className="mt-2 mb-4 text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Отметьте обстоятельства, которые соответствуют ситуации каждого участника. Можно отметить несколько.
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {CIRCUMSTANCES.map((c, i) => {
                    const active = form.circumstances.includes(c);
                    return (
                      <button
                        key={i}
                        onClick={() => toggleCircumstance(c)}
                        className="text-left flex items-center gap-3 px-4 py-3 transition-all duration-200"
                        style={{
                          border: active ? "1px solid rgba(0,232,124,0.4)" : "1px solid rgba(255,255,255,0.07)",
                          background: active ? "rgba(0,232,124,0.07)" : "rgba(255,255,255,0.02)",
                          color: active ? "#fff" : "rgba(255,255,255,0.55)",
                        }}
                      >
                        <div
                          className="flex-shrink-0 w-4 h-4 flex items-center justify-center"
                          style={{
                            border: `1px solid ${active ? "var(--accent)" : "rgba(255,255,255,0.2)"}`,
                            background: active ? "rgba(0,232,124,0.2)" : "transparent",
                          }}
                        >
                          {active && (
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" style={{ color: "var(--accent)" }}>
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                        <span className="text-xs font-medium leading-tight">{c}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <SubSection title="Дополнительные сведения" />
                <div className="mt-3">
                  <label className="text-[10px] font-bold tracking-[0.18em] uppercase block mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>
                    Примечания и комментарии
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    placeholder="Опишите дополнительные обстоятельства ДТП..."
                    rows={4}
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#fff",
                      padding: "10px 14px",
                      fontSize: "0.875rem",
                      fontFamily: "var(--font-space-grotesk), sans-serif",
                      outline: "none",
                      resize: "vertical",
                      borderRadius: 0,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "rgba(0,232,124,0.5)";
                      e.currentTarget.style.background = "rgba(0,232,124,0.04)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    }}
                  />
                </div>
              </div>

              <div>
                <SubSection title="Повреждения ТС — фотофиксация" />
                <div className="grid gap-3 sm:grid-cols-2 mt-3">
                  <PhotoScanWidget
                    label="Повреждения ТС · Участник А"
                    hint="Снимите все видимые повреждения"
                  />
                  <PhotoScanWidget
                    label="Повреждения ТС · Участник Б"
                    hint="Снимите все видимые повреждения"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4: Review ── */}
          {step === 4 && (
            <div className="space-y-6">
              {/* Summary blocks */}
              <div
                className="p-5"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <SubSection title="Место и время ДТП" />
                <div className="mt-2">
                  <ReviewRow label="Дата" value={form.date} />
                  <ReviewRow label="Время" value={form.time} />
                  <ReviewRow label="Город" value={form.city} />
                  <ReviewRow label="Улица" value={form.street} />
                  <ReviewRow label="Дом / км" value={form.house} />
                </div>
              </div>

              <div
                className="p-5"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <SubSection title="Участник А" />
                <div className="mt-2">
                  <ReviewRow label="Владелец" value={form.participantA.ownerName} />
                  <ReviewRow label="Телефон" value={form.participantA.ownerPhone} />
                  <ReviewRow label="ТС" value={[form.participantA.brand, form.participantA.model, form.participantA.year].filter(Boolean).join(" ")} />
                  <ReviewRow label="Гос. номер" value={form.participantA.plate} />
                  <ReviewRow label="Страховая" value={form.participantA.insurer} />
                  <ReviewRow label="Полис ОСАГО" value={form.participantA.policyNumber} />
                  <ReviewRow label="Повреждения" value={form.participantA.damageZones} />
                </div>
              </div>

              <div
                className="p-5"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <SubSection title="Участник Б" />
                <div className="mt-2">
                  <ReviewRow label="Владелец" value={form.participantB.ownerName} />
                  <ReviewRow label="Телефон" value={form.participantB.ownerPhone} />
                  <ReviewRow label="ТС" value={[form.participantB.brand, form.participantB.model, form.participantB.year].filter(Boolean).join(" ")} />
                  <ReviewRow label="Гос. номер" value={form.participantB.plate} />
                  <ReviewRow label="Страховая" value={form.participantB.insurer} />
                  <ReviewRow label="Полис ОСАГО" value={form.participantB.policyNumber} />
                  <ReviewRow label="Повреждения" value={form.participantB.damageZones} />
                </div>
              </div>

              {form.circumstances.length > 0 && (
                <div
                  className="p-5"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <SubSection title="Обстоятельства ДТП" />
                  <ul className="mt-2 space-y-1">
                    {form.circumstances.map((c) => (
                      <li key={c} className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                        <div className="w-1 h-1 flex-shrink-0 rounded-full" style={{ background: "var(--accent)" }} />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Warning */}
              <div
                className="p-4 flex gap-3 items-start"
                style={{
                  background: "rgba(255,200,0,0.04)",
                  border: "1px solid rgba(255,200,0,0.18)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" style={{ color: "#ffcc00", flexShrink: 0, marginTop: 1 }}>
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Оба участника ДТП обязаны подписать извещение. Уведомите страховую компанию в течение{" "}
                  <span style={{ color: "#ffcc00", fontWeight: 700 }}>5 рабочих дней</span>. Не ремонтируйте ТС до осмотра страховщиком.
                </p>
              </div>
            </div>
          )}

          {/* ── Navigation buttons ── */}
          <div className="flex gap-3 mt-10 flex-wrap">
            {step > 0 && (
              <button
                onClick={() => goTo(step - 1)}
                className="btn-neon flex items-center gap-2 px-6 py-3 text-sm font-bold tracking-[0.14em] uppercase"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Назад
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                onClick={() => goTo(step + 1)}
                className="btn-primary flex items-center gap-2 px-8 py-3 text-sm font-bold tracking-[0.14em] uppercase ml-auto"
              >
                Далее
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            ) : (
              <button
                onClick={() => setSubmitted(true)}
                className="btn-primary flex items-center gap-2 px-8 py-3 text-sm font-bold tracking-[0.14em] uppercase ml-auto"
                style={{ boxShadow: "0 0 32px rgba(0,232,124,0.3)" }}
              >
                Оформить европротокол
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Inline keyframes ── */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scanLine {
          0%   { top: 0%; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
}
