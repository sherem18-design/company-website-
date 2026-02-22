"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import InsuranceCalculator from "@/components/InsuranceCalculator";

/* ─── Types ─── */
interface VehicleData {
  category: string;
  brand: string;
  model: string;
  year: string;
  power: string;
  vin: string;
  plate: string;
  mileage: string;
}

interface OwnerData {
  lastName: string;
  firstName: string;
  middleName: string;
  dob: string;
  passportSeries: string;
  passportNumber: string;
  address: string;
  phone: string;
  email: string;
}

interface Driver {
  id: string;
  lastName: string;
  firstName: string;
  middleName: string;
  dob: string;
  licSeries: string;
  licNumber: string;
  licDate: string;
  expSince: string;
}

interface PolicyData {
  startDate: string;
  months: string;
  purpose: string;
  unlimited: boolean;
}

interface FormData {
  vehicle: VehicleData;
  owner: OwnerData;
  sameAsOwner: boolean;
  drivers: Driver[];
  policy: PolicyData;
  consent: boolean;
}

const STEPS = [
  { num: "01", title: "Транспортное средство", tag: "ДАННЫЕ ТС" },
  { num: "02", title: "Собственник", tag: "ДАННЫЕ ВЛАДЕЛЬЦА" },
  { num: "03", title: "Водители", tag: "ДОПУЩЕНЫ К УПРАВЛЕНИЮ" },
  { num: "04", title: "Период полиса", tag: "ПАРАМЕТРЫ СТРАХОВАНИЯ" },
  { num: "05", title: "Проверка", tag: "ИТОГ И ОТПРАВКА" },
];

const VEHICLE_CATEGORIES = ["B — Легковые автомобили", "C — Грузовые", "D — Автобусы", "E — Прицепы", "Мотоциклы"];
const PURPOSES = [
  "Личные, семейные нужды",
  "Регулярные поездки на работу",
  "Деятельность такси",
  "Прокат / аренда",
  "Учебная езда",
  "Иные цели",
];

const newDriver = (): Driver => ({
  id: Math.random().toString(36).slice(2),
  lastName: "",
  firstName: "",
  middleName: "",
  dob: "",
  licSeries: "",
  licNumber: "",
  licDate: "",
  expSince: "",
});

/* ─── Shared Field ─── */
function Field({
  label, name, value, onChange, placeholder, type = "text", hint, required,
}: {
  label: string; name: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; hint?: string; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>
        {label}{required && <span style={{ color: "var(--accent)", marginLeft: 4 }}>*</span>}
      </label>
      <input
        id={name} type={type} value={value} placeholder={placeholder} autoComplete="off"
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
          color: "#fff", padding: "10px 14px", fontSize: "0.875rem",
          fontFamily: "var(--font-space-grotesk), sans-serif", outline: "none",
          transition: "border-color 0.2s, background 0.2s", borderRadius: 0, width: "100%",
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
      {hint && <span className="text-[9px] tracking-wide" style={{ color: "rgba(255,255,255,0.28)" }}>{hint}</span>}
    </div>
  );
}

function SelectField({
  label, name, value, onChange, options, required,
}: {
  label: string; name: string; value: string; onChange: (v: string) => void;
  options: string[]; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>
        {label}{required && <span style={{ color: "var(--accent)", marginLeft: 4 }}>*</span>}
      </label>
      <select
        id={name} value={value} onChange={(e) => onChange(e.target.value)}
        style={{
          background: "rgba(6,6,8,0.95)", border: "1px solid rgba(255,255,255,0.1)",
          color: value ? "#fff" : "rgba(255,255,255,0.3)", padding: "10px 14px",
          fontSize: "0.875rem", fontFamily: "var(--font-space-grotesk), sans-serif",
          outline: "none", borderRadius: 0, width: "100%", cursor: "pointer",
          appearance: "none",
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(0,232,124,0.5)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
      >
        <option value="">— Выберите —</option>
        {options.map((o) => <option key={o} value={o} style={{ background: "#0b0c10", color: "#fff" }}>{o}</option>)}
      </select>
    </div>
  );
}

function SubSection({ title }: { title: string }) {
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
      <span className="text-[9px] font-bold tracking-[0.18em] uppercase w-36 flex-shrink-0 pt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</span>
      <span className="text-sm text-white flex-1">{value}</span>
    </div>
  );
}

/* ─── Main ─── */
export default function OsagoPage() {
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
          name: `${form.owner.firstName} ${form.owner.lastName}`.trim() || "Не указано",
          phone: form.owner.phone || "Не указан",
          service: "ОСАГО",
          desc: [
            form.vehicle.brand && `Авто: ${form.vehicle.brand} ${form.vehicle.model} ${form.vehicle.year}`,
            form.vehicle.plate && `Гос. номер: ${form.vehicle.plate}`,
            form.owner.email && `Email: ${form.owner.email}`,
          ].filter(Boolean).join(", "),
          source: "Форма ОСАГО",
        }),
      });
    } catch { /* продолжаем в любом случае */ }
    setSending(false);
    setSubmitted(true);
  };

  const [form, setForm] = useState<FormData>({
    vehicle: { category: "", brand: "", model: "", year: "", power: "", vin: "", plate: "", mileage: "" },
    owner: { lastName: "", firstName: "", middleName: "", dob: "", passportSeries: "", passportNumber: "", address: "", phone: "", email: "" },
    sameAsOwner: true,
    drivers: [newDriver()],
    policy: { startDate: "", months: "12", purpose: "", unlimited: false },
    consent: false,
  });

  useEffect(() => { setMounted(true); }, []);

  const goTo = useCallback((s: number) => {
    setStep(s);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const setVehicle = (k: keyof VehicleData) => (v: string) =>
    setForm((f) => ({ ...f, vehicle: { ...f.vehicle, [k]: v } }));
  const setOwner = (k: keyof OwnerData) => (v: string) =>
    setForm((f) => ({ ...f, owner: { ...f.owner, [k]: v } }));
  const setDriver = (id: string, k: keyof Driver) => (v: string) =>
    setForm((f) => ({
      ...f,
      drivers: f.drivers.map((d) => d.id === id ? { ...d, [k]: v } : d),
    }));
  const addDriver = () => setForm((f) => ({ ...f, drivers: [...f.drivers, newDriver()] }));
  const removeDriver = (id: string) =>
    setForm((f) => ({ ...f, drivers: f.drivers.filter((d) => d.id !== id) }));
  const setPolicy = (k: keyof PolicyData) => (v: string | boolean) =>
    setForm((f) => ({ ...f, policy: { ...f.policy, [k]: v } }));

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
          <span className="hud-label text-[9px]">ОСАГО // ЗАЯВКА ПРИНЯТА</span>
          <div className="h-px w-6" style={{ background: "var(--accent)" }} />
        </div>
        <h1 className="hud-title text-3xl sm:text-4xl text-white mb-4">Заявка отправлена</h1>
        <p className="text-sm mb-8 max-w-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
          Наш специалист свяжется с вами в течение 15 минут для подтверждения данных и оформления полиса ОСАГО.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/" className="btn-primary px-8 py-3 text-sm font-bold tracking-[0.14em] uppercase" style={{ display: "inline-flex", alignItems: "center" }}>
            На главную
          </Link>
          <button onClick={() => { setSubmitted(false); setStep(0); }} className="btn-neon px-8 py-3 text-sm font-bold tracking-[0.14em] uppercase">
            Новая заявка
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Fixed background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 15% 25%, rgba(0,232,124,0.04) 0%, transparent 50%), radial-gradient(ellipse at 85% 75%, rgba(0,232,124,0.03) 0%, transparent 50%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,232,124,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,232,124,0.025) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(6,6,8,0.92)", backdropFilter: "blur(12px)", position: "sticky", top: 0 }}>
        <Link href="/" className="flex items-center gap-3 group" style={{ textDecoration: "none" }}>
          <div className="flex items-center justify-center w-8 h-8 transition-all duration-200" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>
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
            <div className="text-[8px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>ОСАГО онлайн</div>
          </div>
        </div>
        <div className="text-[8px] font-bold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.2)" }}>РФ · 2025</div>
      </header>

      <div ref={topRef} className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 py-10 pb-24">
        {/* Title */}
        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-3">
            <div className="h-px w-6 flex-shrink-0" style={{ background: "var(--accent)" }} />
            <span className="hud-label text-[9px]">СТРАХОВАНИЕ // ОСАГО ОНЛАЙН</span>
          </div>
          <h1 className="hud-title text-3xl sm:text-5xl text-white mb-3">
            ОСАГО<br /><span style={{ color: "var(--accent)" }}>онлайн</span>
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)", maxWidth: "480px" }}>
            Оформление полиса обязательного страхования гражданской ответственности. Заполните форму — специалист подберёт лучшее предложение и свяжется с вами.
          </p>
        </div>

        {/* ── Калькулятор ОСАГО с ценами ── */}
        <div className="mb-10">
          <InsuranceCalculator defaultType="osago" />
        </div>

        {/* Разделитель */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.2)" }}>
            или заполните детальную заявку
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
        </div>

        {/* Info block */}
        <div className="mb-8 p-4 flex gap-4 items-start" style={{ background: "rgba(0,232,124,0.04)", border: "1px solid rgba(0,232,124,0.2)" }}>
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center" style={{ border: "1px solid rgba(0,232,124,0.35)", color: "var(--accent)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <path d="M12 2L4 5v7c0 4.4 3.5 8.5 8 10 4.5-1.5 8-5.6 8-10V5L12 2z"/><polyline points="9 12 11 14 15 10"/>
            </svg>
          </div>
          <div>
            <div className="text-xs font-bold text-white tracking-wide mb-1">Что нужно для оформления ОСАГО</div>
            <ul className="text-[11px] leading-relaxed space-y-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
              <li>· Паспорт собственника транспортного средства</li>
              <li>· ПТС или СТС (свидетельство о регистрации)</li>
              <li>· Диагностическая карта (если ТС старше 4 лет)</li>
              <li>· Водительские удостоверения всех допущенных водителей</li>
            </ul>
          </div>
        </div>

        {/* Step nav */}
        <div className="mb-8">
          <div className="flex gap-1 overflow-x-auto pb-2">
            {STEPS.map((s, i) => (
              <button key={s.num} onClick={() => goTo(i)} className="flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 transition-all duration-300"
                style={{ background: step === i ? "rgba(0,232,124,0.08)" : "rgba(255,255,255,0.02)", border: step === i ? "1px solid rgba(0,232,124,0.35)" : "1px solid rgba(255,255,255,0.06)", color: step === i ? "var(--accent)" : "rgba(255,255,255,0.3)", boxShadow: step === i ? "0 0 16px rgba(0,232,124,0.1)" : "none", minWidth: "80px" }}
              >
                <span className="font-bold text-base" style={{ fontFamily: "var(--font-geist-mono)", color: step === i ? "var(--accent)" : i < step ? "rgba(0,232,124,0.5)" : "rgba(255,255,255,0.2)" }}>
                  {i < step ? "✓" : s.num}
                </span>
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

          {/* ── STEP 0: Vehicle ── */}
          {step === 0 && (
            <div className="space-y-6">
              <SubSection title="Категория и характеристики" />
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField label="Категория ТС" name="category" value={form.vehicle.category} onChange={setVehicle("category")} options={VEHICLE_CATEGORIES} required />
                <Field label="Мощность двигателя (л.с.)" name="power" value={form.vehicle.power} onChange={setVehicle("power")} placeholder="150" type="number" required />
              </div>
              <SubSection title="Идентификация транспортного средства" />
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Марка" name="brand" value={form.vehicle.brand} onChange={setVehicle("brand")} placeholder="Toyota" required />
                <Field label="Модель" name="model" value={form.vehicle.model} onChange={setVehicle("model")} placeholder="Camry" required />
                <Field label="Год выпуска" name="year" value={form.vehicle.year} onChange={setVehicle("year")} placeholder="2019" type="number" required />
                <Field label="Гос. номер" name="plate" value={form.vehicle.plate} onChange={setVehicle("plate")} placeholder="А 123 ВС 77" hint="Если ещё не получен — оставьте пустым" />
                <div className="sm:col-span-2">
                  <Field label="VIN / № кузова" name="vin" value={form.vehicle.vin} onChange={setVehicle("vin")} placeholder="WVWZZZ3BZ3E123456" hint="17 символов" />
                </div>
                <Field label="Пробег (км)" name="mileage" value={form.vehicle.mileage} onChange={setVehicle("mileage")} placeholder="50000" type="number" />
              </div>
            </div>
          )}

          {/* ── STEP 1: Owner ── */}
          {step === 1 && (
            <div className="space-y-6">
              <SubSection title="ФИО собственника" />
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Фамилия" name="lastName" value={form.owner.lastName} onChange={setOwner("lastName")} placeholder="Иванов" required />
                <Field label="Имя" name="firstName" value={form.owner.firstName} onChange={setOwner("firstName")} placeholder="Иван" required />
                <Field label="Отчество" name="middleName" value={form.owner.middleName} onChange={setOwner("middleName")} placeholder="Иванович" />
              </div>
              <SubSection title="Паспортные данные" />
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Дата рождения" name="dob" value={form.owner.dob} onChange={setOwner("dob")} type="date" required />
                <Field label="Серия паспорта" name="passportSeries" value={form.owner.passportSeries} onChange={setOwner("passportSeries")} placeholder="77 00" hint="4 цифры" />
                <Field label="Номер паспорта" name="passportNumber" value={form.owner.passportNumber} onChange={setOwner("passportNumber")} placeholder="123456" hint="6 цифр" />
                <div className="sm:col-span-3">
                  <Field label="Адрес регистрации" name="address" value={form.owner.address} onChange={setOwner("address")} placeholder="г. Москва, ул. Ленина, д. 1, кв. 1" required />
                </div>
              </div>
              <SubSection title="Контактные данные" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Телефон" name="phone" value={form.owner.phone} onChange={setOwner("phone")} placeholder="+7 (___) ___-__-__" type="tel" required />
                <Field label="Email" name="email" value={form.owner.email} onChange={setOwner("email")} placeholder="ivan@mail.ru" type="email" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer mt-2">
                <div
                  className="flex-shrink-0 w-5 h-5 border flex items-center justify-center transition-all duration-200"
                  style={{ borderColor: form.sameAsOwner ? "var(--accent)" : "rgba(255,255,255,0.2)", background: form.sameAsOwner ? "rgba(0,232,124,0.15)" : "transparent" }}
                  onClick={() => setForm((f) => ({ ...f, sameAsOwner: !f.sameAsOwner }))}
                >
                  {form.sameAsOwner && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" style={{ color: "var(--accent)" }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>Страхователь совпадает с собственником</span>
              </label>
            </div>
          )}

          {/* ── STEP 2: Drivers ── */}
          {step === 2 && (
            <div className="space-y-6">
              <label className="flex items-center gap-3 cursor-pointer mb-4">
                <div
                  className="flex-shrink-0 w-5 h-5 border flex items-center justify-center transition-all duration-200"
                  style={{ borderColor: form.policy.unlimited ? "var(--accent)" : "rgba(255,255,255,0.2)", background: form.policy.unlimited ? "rgba(0,232,124,0.15)" : "transparent" }}
                  onClick={() => setForm((f) => ({ ...f, policy: { ...f.policy, unlimited: !f.policy.unlimited } }))}
                >
                  {form.policy.unlimited && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" style={{ color: "var(--accent)" }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <div>
                  <span className="text-sm text-white font-medium">Неограниченное число водителей</span>
                  <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>К управлению допускается любой водитель с действующим ВУ</p>
                </div>
              </label>

              {!form.policy.unlimited && (
                <>
                  {form.drivers.map((d, i) => (
                    <div key={d.id} className="p-4" style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
                      <div className="flex items-center justify-between mb-4">
                        <SubSection title={`Водитель ${i + 1}`} />
                        {form.drivers.length > 1 && (
                          <button onClick={() => removeDriver(d.id)} className="text-[10px] font-bold tracking-widest uppercase transition-colors" style={{ color: "rgba(255,80,80,0.6)" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,80,80,1)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,80,80,0.6)"; }}
                          >
                            Удалить
                          </button>
                        )}
                      </div>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <Field label="Фамилия" name={`d-ln-${d.id}`} value={d.lastName} onChange={setDriver(d.id, "lastName")} placeholder="Иванов" required />
                        <Field label="Имя" name={`d-fn-${d.id}`} value={d.firstName} onChange={setDriver(d.id, "firstName")} placeholder="Иван" required />
                        <Field label="Отчество" name={`d-mn-${d.id}`} value={d.middleName} onChange={setDriver(d.id, "middleName")} placeholder="Иванович" />
                        <Field label="Дата рождения" name={`d-dob-${d.id}`} value={d.dob} onChange={setDriver(d.id, "dob")} type="date" required />
                        <Field label="Серия ВУ" name={`d-ls-${d.id}`} value={d.licSeries} onChange={setDriver(d.id, "licSeries")} placeholder="77 00" />
                        <Field label="Номер ВУ" name={`d-ln2-${d.id}`} value={d.licNumber} onChange={setDriver(d.id, "licNumber")} placeholder="123456" />
                        <Field label="Дата выдачи ВУ" name={`d-ld-${d.id}`} value={d.licDate} onChange={setDriver(d.id, "licDate")} type="date" />
                        <Field label="Стаж вождения с" name={`d-exp-${d.id}`} value={d.expSince} onChange={setDriver(d.id, "expSince")} type="date" hint="Дата первого ВУ" />
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={addDriver}
                    className="w-full py-3 flex items-center justify-center gap-2 text-sm font-bold tracking-wide uppercase transition-all duration-200"
                    style={{ border: "1px dashed rgba(0,232,124,0.3)", color: "rgba(0,232,124,0.6)", background: "transparent" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,232,124,0.6)"; (e.currentTarget as HTMLElement).style.color = "var(--accent)"; (e.currentTarget as HTMLElement).style.background = "rgba(0,232,124,0.04)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,232,124,0.3)"; (e.currentTarget as HTMLElement).style.color = "rgba(0,232,124,0.6)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Добавить водителя
                  </button>
                </>
              )}
            </div>
          )}

          {/* ── STEP 3: Policy ── */}
          {step === 3 && (
            <div className="space-y-6">
              <SubSection title="Период страхования" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Дата начала действия" name="startDate" value={form.policy.startDate} onChange={(v) => setPolicy("startDate")(v)} type="date" required />
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>
                    Срок страхования <span style={{ color: "var(--accent)" }}>*</span>
                  </label>
                  <div className="flex gap-2">
                    {["3", "6", "12"].map((m) => (
                      <button key={m} onClick={() => setPolicy("months")(m)}
                        className="flex-1 py-2.5 text-sm font-bold tracking-wide uppercase transition-all duration-200"
                        style={{ border: form.policy.months === m ? "1px solid rgba(0,232,124,0.5)" : "1px solid rgba(255,255,255,0.1)", background: form.policy.months === m ? "rgba(0,232,124,0.1)" : "transparent", color: form.policy.months === m ? "var(--accent)" : "rgba(255,255,255,0.4)" }}
                      >
                        {m} мес.
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <SubSection title="Цель использования ТС" />
              <div className="grid gap-2">
                {PURPOSES.map((p) => (
                  <button key={p} onClick={() => setPolicy("purpose")(p)}
                    className="text-left flex items-center gap-3 px-4 py-3 transition-all duration-200"
                    style={{ border: form.policy.purpose === p ? "1px solid rgba(0,232,124,0.4)" : "1px solid rgba(255,255,255,0.07)", background: form.policy.purpose === p ? "rgba(0,232,124,0.07)" : "rgba(255,255,255,0.02)", color: form.policy.purpose === p ? "#fff" : "rgba(255,255,255,0.55)" }}
                  >
                    <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center" style={{ border: `1px solid ${form.policy.purpose === p ? "var(--accent)" : "rgba(255,255,255,0.2)"}`, background: form.policy.purpose === p ? "rgba(0,232,124,0.2)" : "transparent" }}>
                      {form.policy.purpose === p && (
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" style={{ color: "var(--accent)" }}>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm">{p}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 4: Review ── */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <SubSection title="Транспортное средство" />
                <div className="mt-2">
                  <ReviewRow label="Категория" value={form.vehicle.category} />
                  <ReviewRow label="Марка/Модель" value={`${form.vehicle.brand} ${form.vehicle.model}`} />
                  <ReviewRow label="Год" value={form.vehicle.year} />
                  <ReviewRow label="Мощность" value={form.vehicle.power ? `${form.vehicle.power} л.с.` : ""} />
                  <ReviewRow label="VIN" value={form.vehicle.vin} />
                  <ReviewRow label="Гос. номер" value={form.vehicle.plate} />
                </div>
              </div>
              <div className="p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <SubSection title="Собственник" />
                <div className="mt-2">
                  <ReviewRow label="ФИО" value={`${form.owner.lastName} ${form.owner.firstName} ${form.owner.middleName}`} />
                  <ReviewRow label="Дата рождения" value={form.owner.dob} />
                  <ReviewRow label="Паспорт" value={form.owner.passportSeries ? `${form.owner.passportSeries} ${form.owner.passportNumber}` : ""} />
                  <ReviewRow label="Телефон" value={form.owner.phone} />
                  <ReviewRow label="Email" value={form.owner.email} />
                </div>
              </div>
              <div className="p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <SubSection title="Параметры полиса" />
                <div className="mt-2">
                  <ReviewRow label="Дата начала" value={form.policy.startDate} />
                  <ReviewRow label="Срок" value={form.policy.months ? `${form.policy.months} месяцев` : ""} />
                  <ReviewRow label="Цель" value={form.policy.purpose} />
                  <ReviewRow label="Водители" value={form.policy.unlimited ? "Неограниченный список" : `${form.drivers.length} водитель(-я)`} />
                </div>
              </div>

              {/* Consent */}
              <label className="flex items-start gap-3 cursor-pointer p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div
                  className="flex-shrink-0 w-5 h-5 border flex items-center justify-center transition-all duration-200 mt-0.5"
                  style={{ borderColor: form.consent ? "var(--accent)" : "rgba(255,255,255,0.2)", background: form.consent ? "rgba(0,232,124,0.15)" : "transparent" }}
                  onClick={() => setForm((f) => ({ ...f, consent: !f.consent }))}
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
                  {" "}(Федеральный закон №152-ФЗ «О персональных данных»)
                </span>
              </label>
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex gap-3 mt-10 flex-wrap">
            {step > 0 && (
              <button onClick={() => goTo(step - 1)} className="btn-neon flex items-center gap-2 px-6 py-3 text-sm font-bold tracking-[0.14em] uppercase">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                  <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                </svg>
                Назад
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button onClick={() => goTo(step + 1)} className="btn-primary flex items-center gap-2 px-8 py-3 text-sm font-bold tracking-[0.14em] uppercase ml-auto">
                Далее
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSubmitForm}
                disabled={!form.consent || sending}
                className="flex items-center gap-2 px-8 py-3 text-sm font-bold tracking-[0.14em] uppercase ml-auto transition-all duration-300"
                style={{ background: form.consent && !sending ? "var(--accent)" : "rgba(255,255,255,0.05)", color: form.consent && !sending ? "#040508" : "rgba(255,255,255,0.2)", border: form.consent && !sending ? "none" : "1px solid rgba(255,255,255,0.08)", cursor: form.consent && !sending ? "pointer" : "not-allowed", boxShadow: form.consent && !sending ? "0 0 32px rgba(0,232,124,0.3)" : "none" }}
              >
                {sending ? "Отправка..." : "Отправить заявку"}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
