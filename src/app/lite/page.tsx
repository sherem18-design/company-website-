"use client";

import { useState, useEffect, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────────────────────── */
const PHONE = "8-800-XXX-XX-XX";
const PHONE_HREF = "tel:+78001234567";

type Tab = "call" | "osago" | "evac" | "euro" | "dtp";
type Speed = "checking" | "fast" | "medium" | "slow" | "unknown";

/* ─────────────────────────────────────────────────────────────────────────
   Connection quality helpers
───────────────────────────────────────────────────────────────────────── */
function readConnectionSpeed(): { quality: Speed; bars: number; label: string } {
  if (typeof navigator === "undefined")
    return { quality: "unknown", bars: 3, label: "—" };

  const nav = navigator as unknown as Record<string, unknown>;
  const conn = (nav.connection ?? nav.mozConnection ?? nav.webkitConnection) as
    | { effectiveType?: string; downlink?: number; saveData?: boolean }
    | null;

  if (!conn) return { quality: "unknown", bars: 3, label: "—" };

  const { effectiveType: ect, downlink, saveData } = conn;

  if (saveData || ect === "slow-2g")
    return { quality: "slow", bars: 1, label: "< 2G" };
  if (ect === "2g")
    return { quality: "slow", bars: 1, label: "2G" };
  if (ect === "3g" || (downlink !== undefined && downlink < 1.5))
    return { quality: "medium", bars: 2, label: "3G" };
  if (ect === "4g" || (downlink !== undefined && downlink >= 1.5))
    return { quality: "fast", bars: 4, label: `${downlink?.toFixed(1) ?? "4G"} Mbps` };

  return { quality: "unknown", bars: 3, label: ect ?? "—" };
}

/* ─────────────────────────────────────────────────────────────────────────
   Reusable form components
───────────────────────────────────────────────────────────────────────── */
function F({
  label, name, value, onChange, type = "text", placeholder, hint, required,
}: {
  label: string; name: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; hint?: string; required?: boolean;
}) {
  return (
    <div className="field">
      <label className="label" htmlFor={name}>
        {label}{required && <span className="req">*</span>}
      </label>
      <input id={name} name={name} type={type} value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)} />
      {hint && <div className="hint">{hint}</div>}
    </div>
  );
}

function TA({
  label, name, value, onChange, placeholder, required,
}: {
  label: string; name: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean;
}) {
  return (
    <div className="field">
      <label className="label" htmlFor={name}>
        {label}{required && <span className="req">*</span>}
      </label>
      <textarea id={name} name={name} value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Sel({
  label, name, value, onChange, options, required,
}: {
  label: string; name: string; value: string; onChange: (v: string) => void;
  options: string[]; required?: boolean;
}) {
  return (
    <div className="field">
      <label className="label" htmlFor={name}>
        {label}{required && <span className="req">*</span>}
      </label>
      <select id={name} name={name} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">— выбрать —</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Done({ title, text, onReset }: { title: string; text: string; onReset: () => void }) {
  return (
    <div className="done-block">
      <div style={{ fontSize: 36, marginBottom: 10, color: "var(--accent)" }}>✓</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: "var(--accent)", marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 24, lineHeight: 1.6 }}>{text}</div>
      <a href={PHONE_HREF}
        style={{ display: "inline-block", background: "var(--accent)", color: "#040508", padding: "12px 24px", fontWeight: 700, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none", marginBottom: 10 }}>
        Позвонить: {PHONE}
      </a>
      <button className="btn-outline" onClick={onReset} style={{ marginTop: 8 }}>
        Заполнить ещё раз
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Tab: Экстренный звонок
───────────────────────────────────────────────────────────────────────── */
function TabCall() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);

  if (done) return <Done title="Заявка на звонок принята" text="Мы перезвоним в течение 3 минут." onReset={() => { setName(""); setPhone(""); setDone(false); }} />;

  return (
    <>
      <div className="section-tag">Экстренная связь</div>
      <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Позвоните сейчас</h2>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 24, lineHeight: 1.6 }}>Оператор ответит круглосуточно и сопроводит в любой ситуации.</p>

      <a href={PHONE_HREF} style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
        background: "var(--accent)", color: "#040508", padding: "18px 24px",
        fontSize: 20, fontWeight: 700, textDecoration: "none", marginBottom: 8,
        letterSpacing: "0.04em",
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
          <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        {PHONE}
      </a>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "center", marginBottom: 28, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        Бесплатно · 24/7 · Вся Россия
      </div>

      <div className="divider" />
      <div className="section-tag">Обратный звонок</div>

      <div className="card" style={{ marginTop: 16 }}>
        <F label="Ваше имя" name="cb-name" value={name} onChange={setName} placeholder="Иван" required />
        <F label="Телефон" name="cb-phone" value={phone} onChange={setPhone} type="tel" placeholder="+7 (___) ___-__-__" required />
        <button className="btn-primary" disabled={!name || !phone} onClick={() => setDone(true)}>
          Заказать звонок
        </button>
      </div>

      <div className="info-block" style={{ marginTop: 16 }}>
        <strong style={{ color: "#fff" }}>При ДТП с пострадавшими</strong> — сначала позвоните <strong>112</strong>, затем нам. Поможем оформить все документы.
      </div>

      <a href="tel:112" style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        background: "rgba(255,60,60,0.12)", border: "1px solid rgba(255,60,60,0.35)",
        color: "rgba(255,120,120,0.9)", padding: "13px 20px",
        fontSize: 14, fontWeight: 700, textDecoration: "none", letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        Экстренные службы: 112
      </a>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Tab: ОСАГО
───────────────────────────────────────────────────────────────────────── */
const OSAGO_PURPOSES = ["Личные нужды", "Поездки на работу", "Такси", "Прокат / аренда", "Учебная езда", "Иное"];

function TabOsago() {
  const init = { name: "", phone: "", email: "", brand: "", model: "", year: "", plate: "", vin: "", power: "", startDate: "", months: "12", purpose: "", consent: false };
  const [f, setF] = useState(init);
  const [done, setDone] = useState(false);
  const u = (k: keyof typeof init) => (v: string | boolean) => setF((p) => ({ ...p, [k]: v }));

  if (done) return <Done title="Заявка на ОСАГО принята" text="Специалист свяжется в течение 15 минут для оформления полиса." onReset={() => { setF(init); setDone(false); }} />;

  return (
    <>
      <div className="section-tag">Страхование · ОСАГО онлайн</div>
      <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        ОСАГО <span style={{ color: "var(--accent)" }}>онлайн</span>
      </h2>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 24, lineHeight: 1.6 }}>
        Заполните форму — подберём лучшее предложение и оформим полис.
      </p>

      <div className="info-block">
        Понадобятся: паспорт · ПТС / СТС · диагностическая карта (если ТС старше 4 лет) · ВУ водителей
      </div>

      <div className="card">
        <div className="card-title">Ваши данные</div>
        <F label="ФИО" name="osa-name" value={f.name} onChange={u("name")} placeholder="Иванов Иван Иванович" required />
        <div className="grid2">
          <F label="Телефон" name="osa-phone" value={f.phone} onChange={u("phone")} type="tel" placeholder="+7 (___) ___-__-__" required />
          <F label="Email" name="osa-email" value={f.email} onChange={u("email")} type="email" placeholder="ivan@mail.ru" />
        </div>
      </div>

      <div className="card">
        <div className="card-title">Транспортное средство</div>
        <div className="grid3">
          <F label="Марка" name="osa-brand" value={f.brand} onChange={u("brand")} placeholder="Toyota" required />
          <F label="Модель" name="osa-model" value={f.model} onChange={u("model")} placeholder="Camry" required />
          <F label="Год" name="osa-year" value={f.year} onChange={u("year")} type="number" placeholder="2019" required />
        </div>
        <div className="grid2">
          <F label="Гос. номер" name="osa-plate" value={f.plate} onChange={u("plate")} placeholder="А 123 ВС 77" />
          <F label="Мощность (л.с.)" name="osa-power" value={f.power} onChange={u("power")} type="number" placeholder="150" required />
        </div>
        <F label="VIN / № кузова" name="osa-vin" value={f.vin} onChange={u("vin")} placeholder="WVWZZZ..." hint="17 символов — с ПТС или СТС" />
      </div>

      <div className="card">
        <div className="card-title">Параметры полиса</div>
        <div className="grid2">
          <F label="Дата начала" name="osa-start" value={f.startDate} onChange={u("startDate")} type="date" required />
          <div className="field">
            <label className="label">Срок<span className="req">*</span></label>
            <div style={{ display: "flex", gap: 8 }}>
              {["3", "6", "12"].map((m) => (
                <button key={m} className={`chip${f.months === m ? " active" : ""}`} onClick={() => u("months")(m)}>
                  {m} мес.
                </button>
              ))}
            </div>
          </div>
        </div>
        <Sel label="Цель использования ТС" name="osa-purpose" value={f.purpose} onChange={u("purpose")} options={OSAGO_PURPOSES} required />
      </div>

      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 20, cursor: "pointer" }}>
        <input type="checkbox" checked={f.consent} onChange={(e) => u("consent")(e.target.checked)} style={{ marginTop: 2 }} />
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
          Согласен на обработку персональных данных (ФЗ №152-ФЗ)
        </span>
      </label>

      <button className="btn-primary" disabled={!f.consent || !f.name || !f.phone} onClick={() => setDone(true)}>
        Отправить заявку
      </button>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Tab: Эвакуатор
───────────────────────────────────────────────────────────────────────── */
const EVAC_REASONS = [
  { id: "dtp",       label: "ДТП — авария" },
  { id: "breakdown", label: "Поломка / не заводится" },
  { id: "stuck",     label: "Застрял (грязь, снег, яма)" },
  { id: "flat",      label: "Колесо / нет запаски" },
  { id: "parking",   label: "Штрафстоянка" },
  { id: "other",     label: "Другое" },
];

function TabEvac() {
  const init = { name: "", phone: "", location: "", brand: "", plate: "", reason: "", comment: "", consent: false };
  const [f, setF] = useState(init);
  const [done, setDone] = useState(false);
  const u = (k: keyof typeof init) => (v: string | boolean) => setF((p) => ({ ...p, [k]: v }));

  if (done) return <Done title="Эвакуатор вызван" text="Диспетчер перезвонит в течение 3 минут и сообщит время прибытия." onReset={() => { setF(init); setDone(false); }} />;

  return (
    <>
      <div className="section-tag">Дорожная помощь · Эвакуация</div>
      <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        Вызов <span style={{ color: "var(--accent)" }}>эвакуатора</span>
      </h2>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 24, lineHeight: 1.6 }}>
        Перезвоним в течение 3 минут, назовём время прибытия и стоимость.
      </p>

      <a href={PHONE_HREF} style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        background: "var(--accent)", color: "#040508", padding: "14px 20px",
        fontSize: 16, fontWeight: 700, textDecoration: "none", marginBottom: 24,
        letterSpacing: "0.06em",
      }}>
        Позвонить сразу: {PHONE}
      </a>

      <div className="card">
        <div className="card-title">Причина вызова</div>
        <div style={{ display: "flex", flexWrap: "wrap", margin: "-3px" }}>
          {EVAC_REASONS.map((r) => (
            <button key={r.id} className={`chip${f.reason === r.id ? " active" : ""}`} onClick={() => u("reason")(r.id)}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title">Ваши данные</div>
        <div className="grid2">
          <F label="Имя" name="ev-name" value={f.name} onChange={u("name")} placeholder="Иван" required />
          <F label="Телефон" name="ev-phone" value={f.phone} onChange={u("phone")} type="tel" placeholder="+7 (___) ___-__-__" required />
        </div>
      </div>

      <div className="card">
        <div className="card-title">Местоположение</div>
        <TA label="Где вы сейчас?" name="ev-loc" value={f.location} onChange={u("location")} required
          placeholder="Трасса М4, 312 км, у знака «АЗС 500 м»..." />
        <div style={{ fontSize: 12, color: "rgba(255,160,50,0.85)", marginTop: -8, marginBottom: 12, lineHeight: 1.5 }}>
          ⚠ Укажите трассу, ориентир или километровый столб — чем точнее, тем быстрее приедем
        </div>
        <div className="grid2">
          <F label="Марка и модель" name="ev-brand" value={f.brand} onChange={u("brand")} placeholder="Toyota Camry" required />
          <F label="Гос. номер" name="ev-plate" value={f.plate} onChange={u("plate")} placeholder="А 123 ВС 77" />
        </div>
        <TA label="Дополнительно" name="ev-comment" value={f.comment} onChange={u("comment")} placeholder="Особые условия, примечания..." />
      </div>

      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 20, cursor: "pointer" }}>
        <input type="checkbox" checked={f.consent} onChange={(e) => u("consent")(e.target.checked)} style={{ marginTop: 2 }} />
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
          Согласен на обработку персональных данных (ФЗ №152-ФЗ)
        </span>
      </label>

      <button className="btn-primary" disabled={!f.consent || !f.phone || !f.location} onClick={() => setDone(true)}>
        Вызвать эвакуатор
      </button>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Tab: Европротокол
───────────────────────────────────────────────────────────────────────── */
const CIRCS = [
  "Стоял на парковке", "Выезжал с парковки", "Двигался прямо",
  "Менял полосу", "Обгонял", "Поворачивал направо", "Поворачивал налево",
  "Выполнял разворот", "Двигался задним ходом", "Выезжал с прилегающей территории",
  "Выезжал на встречную", "Не соблюдал дистанцию", "Не соблюдал боковой интервал",
];

type ParticipantData = { ownerName: string; plate: string; brand: string; insurer: string; policyNum: string; driverName: string; driverPhone: string; damage: string };
const emptyP = (): ParticipantData => ({ ownerName: "", plate: "", brand: "", insurer: "", policyNum: "", driverName: "", driverPhone: "", damage: "" });

function ParticipantBlock({ label, data, onChange }: { label: string; data: ParticipantData; onChange: (k: keyof ParticipantData, v: string) => void }) {
  const u = (k: keyof ParticipantData) => (v: string) => onChange(k, v);
  return (
    <div className="card">
      <div className="card-title">{label}</div>
      <div className="grid2">
        <F label="ФИО владельца ТС" name={`${label}-owner`} value={data.ownerName} onChange={u("ownerName")} required />
        <F label="Гос. номер" name={`${label}-plate`} value={data.plate} onChange={u("plate")} placeholder="А 123 ВС 77" required />
      </div>
      <div className="grid2">
        <F label="Марка и модель" name={`${label}-brand`} value={data.brand} onChange={u("brand")} placeholder="Toyota Camry" />
        <F label="Страховая компания" name={`${label}-ins`} value={data.insurer} onChange={u("insurer")} placeholder="Росгосстрах" />
      </div>
      <div className="grid2">
        <F label="Номер полиса ОСАГО" name={`${label}-pol`} value={data.policyNum} onChange={u("policyNum")} />
        <F label="Телефон водителя" name={`${label}-tel`} value={data.driverPhone} onChange={u("driverPhone")} type="tel" placeholder="+7..." />
      </div>
      <TA label="Описание повреждений" name={`${label}-dmg`} value={data.damage} onChange={u("damage")} placeholder="Царапина на переднем бампере..." />
    </div>
  );
}

function TabEuro() {
  const [f, setF] = useState({ date: "", time: "", city: "", street: "", notes: "", consent: false });
  const [pA, setPA] = useState(emptyP());
  const [pB, setPB] = useState(emptyP());
  const [circs, setCircs] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const uF = (k: keyof typeof f) => (v: string | boolean) => setF((p) => ({ ...p, [k]: v }));
  const uPA = (k: keyof ParticipantData, v: string) => setPA((p) => ({ ...p, [k]: v }));
  const uPB = (k: keyof ParticipantData, v: string) => setPB((p) => ({ ...p, [k]: v }));
  const toggleCirc = (c: string) => setCircs((p) => p.includes(c) ? p.filter((x) => x !== c) : [...p, c]);

  if (done) return <Done title="Европротокол принят" text="Специалист свяжется в течение 10 минут для проверки данных и консультации." onReset={() => { setF({ date: "", time: "", city: "", street: "", notes: "", consent: false }); setPA(emptyP()); setPB(emptyP()); setCircs([]); setDone(false); }} />;

  return (
    <>
      <div className="section-tag">Оформление · Европротокол</div>
      <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        Европротокол <span style={{ color: "var(--accent)" }}>онлайн</span>
      </h2>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 20, lineHeight: 1.6 }}>
        Оформление ДТП без вызова ГИБДД — если нет пострадавших, два ТС и у всех есть ОСАГО.
      </p>

      <div className="warn-block">
        <div style={{ color: "rgba(255,100,100,0.9)", fontWeight: 700, marginBottom: 6 }}>⚠ Условия применения</div>
        <ul style={{ paddingLeft: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, fontSize: 13 }}>
          <li>Нет пострадавших людей</li>
          <li>Только 2 транспортных средства</li>
          <li>У обоих участников действующее ОСАГО</li>
          <li>Нет разногласий об обстоятельствах ДТП</li>
        </ul>
        <a href={PHONE_HREF} style={{ display: "block", color: "rgba(255,100,100,0.7)", fontSize: 12, marginTop: 8 }}>
          Не уверены? Позвоните нам: {PHONE}
        </a>
      </div>

      <div className="card">
        <div className="card-title">Место и время ДТП</div>
        <div className="grid2">
          <F label="Дата" name="eu-date" value={f.date} onChange={uF("date")} type="date" required />
          <F label="Время" name="eu-time" value={f.time} onChange={uF("time")} type="time" required />
        </div>
        <F label="Город / населённый пункт" name="eu-city" value={f.city} onChange={uF("city")} required />
        <TA label="Улица, дом, ориентир" name="eu-street" value={f.street} onChange={uF("street")} required />
      </div>

      <ParticipantBlock label="Участник А (вы)" data={pA} onChange={uPA} />
      <ParticipantBlock label="Участник Б" data={pB} onChange={uPB} />

      <div className="card">
        <div className="card-title">Обстоятельства ДТП</div>
        <div style={{ display: "flex", flexWrap: "wrap", margin: "-3px" }}>
          {CIRCS.map((c) => (
            <button key={c} className={`chip${circs.includes(c) ? " active" : ""}`} onClick={() => toggleCirc(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <TA label="Дополнительные сведения" name="eu-notes" value={f.notes} onChange={uF("notes")} placeholder="Что ещё важно знать..." />

      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 20, cursor: "pointer" }}>
        <input type="checkbox" checked={f.consent} onChange={(e) => uF("consent")(e.target.checked)} style={{ marginTop: 2 }} />
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
          Согласен на обработку персональных данных (ФЗ №152-ФЗ)
        </span>
      </label>

      <button className="btn-primary" disabled={!f.consent || !f.date || !pA.plate || !pB.plate} onClick={() => setDone(true)}>
        Отправить европротокол
      </button>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Tab: ДТП — пошаговый алгоритм
───────────────────────────────────────────────────────────────────────── */
type DtpStep = { q: string; sub: string; yes: string; no: string };
const DTP_STEPS: DtpStep[] = [
  { q: "Есть пострадавшие люди?", sub: "Люди с травмами или в тяжёлом состоянии", yes: "call112", no: "next" },
  { q: "Сколько автомобилей?",    sub: "Посчитайте все транспортные средства",      yes: "gibdd",   no: "next" },
  { q: "У всех участников есть действующее ОСАГО?", sub: "Проверьте страховой полис каждого", yes: "next", no: "gibdd" },
  { q: "Есть разногласия об обстоятельствах?", sub: "Спорите о том, кто виноват?", yes: "gibdd",  no: "euro" },
];
const DTP_ANSWERS: Record<number, { yes: string; no: string }> = {
  1: { yes: "Да, есть пострадавшие", no: "Нет пострадавших" },
  2: { yes: "3 и более",             no: "Только 2 автомобиля" },
  3: { yes: "Да, у всех есть ОСАГО", no: "У кого-то нет / не знаю" },
  4: { yes: "Да, есть споры",        no: "Нет, всё согласовано" },
};

function TabDtp() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<null | "euro" | "gibdd" | "112">(null);
  const reset = () => { setStep(0); setResult(null); };

  if (result === "112") return (
    <div>
      <div className="warn-block" style={{ marginBottom: 16 }}>
        <div style={{ color: "rgba(255,100,100,0.9)", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Позвоните 112 прямо сейчас</div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>При наличии пострадавших необходимо вызвать скорую и полицию.</div>
      </div>
      <a href="tel:112" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "rgba(255,60,60,0.15)", border: "1px solid rgba(255,60,60,0.45)", color: "rgba(255,120,120,0.95)", padding: "16px", fontSize: 18, fontWeight: 700, textDecoration: "none", marginBottom: 8 }}>
        📞 112 — Экстренные службы
      </a>
      <a href={PHONE_HREF} style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "var(--accent)", color: "#040508", padding: "14px", fontSize: 16, fontWeight: 700, textDecoration: "none", marginBottom: 16 }}>
        {PHONE} — Е-Спасатель
      </a>
      <button className="btn-outline" onClick={reset}>← Начать заново</button>
    </div>
  );

  if (result === "gibdd") return (
    <div>
      <div className="warn-block" style={{ marginBottom: 16 }}>
        <div style={{ color: "rgba(255,100,100,0.9)", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Вызовите ГИБДД</div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.6 }}>В данной ситуации оформить европротокол нельзя. Звоните 102 или 112 и дождитесь сотрудников ГИБДД.</div>
      </div>
      <a href="tel:102" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "rgba(255,60,60,0.12)", border: "1px solid rgba(255,60,60,0.4)", color: "rgba(255,120,120,0.9)", padding: "14px", fontSize: 16, fontWeight: 700, textDecoration: "none", marginBottom: 8 }}>
        📞 102 — ГИБДД
      </a>
      <a href={PHONE_HREF} style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "var(--accent)", color: "#040508", padding: "14px", fontSize: 15, fontWeight: 700, textDecoration: "none", marginBottom: 16 }}>
        {PHONE} — консультация
      </a>
      <button className="btn-outline" onClick={reset}>← Начать заново</button>
    </div>
  );

  if (result === "euro") return (
    <div>
      <div className="done-block" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 32, color: "var(--accent)", marginBottom: 8 }}>✓</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "var(--accent)", marginBottom: 8 }}>Можно оформить Европротокол</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>ГИБДД вызывать не нужно. Перейдите на вкладку «Европротокол» и заполните форму.</div>
      </div>
      <a href={PHONE_HREF} style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "var(--accent)", color: "#040508", padding: "14px", fontSize: 15, fontWeight: 700, textDecoration: "none", marginBottom: 8 }}>
        {PHONE} — консультация
      </a>
      <button className="btn-outline" onClick={reset}>← Начать заново</button>
    </div>
  );

  const current = DTP_STEPS[step];
  const ans = DTP_ANSWERS[step + 1];
  if (!current) return null;

  const handleAnswer = (choice: string) => {
    const action = choice === "yes" ? current.yes : current.no;
    if (action === "next") { setStep((s) => s + 1); return; }
    if (action === "call112") { setResult("112"); return; }
    if (action === "gibdd") { setResult("gibdd"); return; }
    if (action === "euro") { setResult("euro"); return; }
  };

  return (
    <>
      <div className="section-tag">Алгоритм · Помощь при ДТП</div>
      <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        Помощь при <span style={{ color: "var(--accent)" }}>ДТП</span>
      </h2>

      <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
        {DTP_STEPS.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 3, background: i <= step ? "var(--accent)" : "var(--border)", transition: "background 0.3s" }} />
        ))}
      </div>

      <div className="card">
        <div style={{ fontSize: 10, color: "rgba(0,232,124,0.6)", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 12, fontFamily: "var(--mono)" }}>
          Шаг {step + 1} из {DTP_STEPS.length}
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, lineHeight: 1.3 }}>{current.q}</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 20 }}>{current.sub}</div>
        <button className="btn-primary" style={{ marginBottom: 8 }} onClick={() => handleAnswer("no")}>
          {ans.no}
        </button>
        <button className="btn-outline" onClick={() => handleAnswer("yes")}>
          {ans.yes}
        </button>
      </div>

      {step > 0 && (
        <button className="btn-outline" style={{ marginTop: 8 }} onClick={() => setStep((s) => s - 1)}>
          ← Назад
        </button>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Signal bars SVG (for footer bar)
───────────────────────────────────────────────────────────────────────── */
function Bars({ n, color }: { n: number; color: string }) {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden>
      {[4, 7, 10, 13].map((h, i) => (
        <rect key={i} x={i * 5} y={14 - h} width="3.5" height={h} rx="1"
          fill={i < n ? color : "rgba(255,255,255,0.1)"} />
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Main page
───────────────────────────────────────────────────────────────────────── */
const TABS: { id: Tab; label: string }[] = [
  { id: "call", label: "📞 Звонок" },
  { id: "dtp",  label: "⚠ ДТП" },
  { id: "evac", label: "🚛 Эвакуатор" },
  { id: "euro", label: "📋 Европротокол" },
  { id: "osago",label: "🛡 ОСАГО" },
];

export default function LitePage() {
  const [tab, setTab] = useState<Tab>("call");
  const [fromTimeout, setFromTimeout] = useState(false);
  const [speed, setSpeed] = useState<{ quality: Speed; bars: number; label: string }>({ quality: "checking", bars: 3, label: "..." });

  /* Speed monitor */
  const checkSpeed = useCallback(() => {
    setSpeed(readConnectionSpeed());
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("from") === "timeout") setFromTimeout(true);

    /* Initial check */
    checkSpeed();

    /* Re-check every 15 seconds */
    const iv = setInterval(checkSpeed, 45000);

    /* Also listen to Network Information API changes */
    const nav = navigator as unknown as Record<string, unknown>;
    const conn = (nav.connection ?? nav.mozConnection ?? nav.webkitConnection) as
      | (EventTarget & { effectiveType?: string; downlink?: number }) | null;
    conn?.addEventListener("change", checkSpeed);

    return () => {
      clearInterval(iv);
      conn?.removeEventListener("change", checkSpeed);
    };
  }, [checkSpeed]);

  /* Full mode button state */
  const canGoFull = speed.quality === "fast" || speed.quality === "unknown";

  const goFullSite = () => {
    document.cookie = "lite_mode_pref=off; path=/; max-age=86400; samesite=lax";
    document.cookie = "lite_mode=; path=/; max-age=0; samesite=lax";
    window.location.href = "/#support";
  };

  const speedColor =
    speed.quality === "fast"     ? "var(--accent)" :
    speed.quality === "medium"   ? "rgba(255,160,50,0.9)" :
    speed.quality === "slow"     ? "rgba(255,80,80,0.85)" :
    speed.quality === "checking" ? "rgba(255,255,255,0.3)" :
    "rgba(255,255,255,0.45)";

  const speedText =
    speed.quality === "fast"     ? "Хорошее соединение" :
    speed.quality === "medium"   ? "Среднее (3G)" :
    speed.quality === "slow"     ? "Слабое соединение" :
    speed.quality === "checking" ? "Определение..." :
    "Нет данных";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* ── Header ───────────────────────────────────────────────────── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(6,6,8,0.96)", borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(12px)",
      }}>
        {fromTimeout && (
          <div style={{ background: "rgba(255,160,50,0.1)", borderBottom: "1px solid rgba(255,160,50,0.25)", padding: "8px 16px", fontSize: 12, color: "rgba(255,160,50,0.9)", textAlign: "center" }}>
            Сайт долго загружался — переключены на упрощённую версию.{" "}
            <button onClick={goFullSite} style={{ background: "none", border: "none", color: "rgba(255,160,50,0.9)", cursor: "pointer", textDecoration: "underline", fontSize: 12, fontFamily: "inherit" }}>
              Попробовать полную версию
            </button>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", maxWidth: 900, margin: "0 auto", width: "100%" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, border: "1px solid var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 10, height: 10, background: "var(--accent)" }} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Е<span style={{ color: "var(--accent)" }}>-</span>Спасатель
              </div>
              <div style={{ fontSize: 8, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(0,232,124,0.5)", fontFamily: "var(--mono)" }}>
                УПРОЩЁННЫЙ РЕЖИМ
              </div>
            </div>
          </div>

          {/* Phone */}
          <a href={PHONE_HREF} style={{
            display: "flex", alignItems: "center", gap: 6,
            color: "var(--accent)", textDecoration: "none",
            fontSize: 14, fontWeight: 700, letterSpacing: "0.06em",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="sm-hide">{PHONE}</span>
            <span className="sm-show">Звонок</span>
          </a>
        </div>

        {/* Service tabs */}
        <nav style={{ display: "flex", overflowX: "auto", borderTop: "1px solid var(--border)", background: "var(--bg-2)" }}>
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: "0 0 auto", padding: "12px 16px",
              background: tab === t.id ? "var(--accent-dim)" : "transparent",
              color: tab === t.id ? "var(--accent)" : "rgba(255,255,255,0.45)",
              border: "none",
              borderBottom: tab === t.id ? "2px solid var(--accent)" : "2px solid transparent",
              cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit",
              whiteSpace: "nowrap", transition: "color 0.15s, background 0.15s",
            }}>
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <main style={{ flex: 1, maxWidth: 900, margin: "0 auto", width: "100%", padding: "24px 16px 120px" }}>
        {tab === "call"  && <TabCall />}
        {tab === "dtp"   && <TabDtp />}
        {tab === "evac"  && <TabEvac />}
        {tab === "euro"  && <TabEuro />}
        {tab === "osago" && <TabOsago />}
      </main>

      {/* ── Footer: connection bar + full-mode button ─────────────── */}
      <footer style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 90,
        background: "rgba(6,6,8,0.96)", borderTop: "1px solid var(--border)",
        backdropFilter: "blur(12px)",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "10px 16px", display: "flex", alignItems: "center", gap: 12 }}>

          {/* Signal bars + quality label */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
            <Bars n={speed.bars} color={speedColor} />
            <div>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: speedColor, fontFamily: "var(--mono)" }}>
                {speedText}
              </div>
              {speed.label !== "..." && speed.label !== "—" && (
                <div style={{ fontSize: 8, color: "rgba(255,255,255,0.25)", letterSpacing: "0.12em", fontFamily: "var(--mono)" }}>
                  {speed.label}
                </div>
              )}
            </div>
          </div>

          {/* Full mode button — gated by connection quality */}
          <button
            onClick={canGoFull ? goFullSite : undefined}
            disabled={!canGoFull}
            title={canGoFull ? "Перейти на полную версию сайта" : "Соединение слишком слабое для полной версии"}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "9px 14px",
              background: canGoFull ? "transparent" : "transparent",
              border: `1px solid ${canGoFull ? "var(--accent)" : "rgba(255,255,255,0.1)"}`,
              color: canGoFull ? "var(--accent)" : "rgba(255,255,255,0.2)",
              fontSize: 10, fontWeight: 700, letterSpacing: "0.16em",
              textTransform: "uppercase", cursor: canGoFull ? "pointer" : "not-allowed",
              fontFamily: "var(--mono)",
              boxShadow: canGoFull ? "0 0 16px rgba(0,232,124,0.25), 0 0 32px rgba(0,232,124,0.1)" : "none",
              transition: "all 0.4s ease",
              animation: canGoFull ? "glowPulse 2s ease-in-out infinite" : "none",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            {canGoFull ? "Полный сайт" : "Слабый сигнал"}
          </button>
        </div>

        {/* Glow animation for "full mode" button */}
        <style>{`
          @keyframes glowPulse {
            0%, 100% { box-shadow: 0 0 12px rgba(0,232,124,0.2), 0 0 24px rgba(0,232,124,0.08); }
            50%       { box-shadow: 0 0 20px rgba(0,232,124,0.45), 0 0 40px rgba(0,232,124,0.18); }
          }
          .sm-show { display: none; }
          @media (max-width: 480px) {
            .sm-hide { display: none; }
            .sm-show { display: inline; }
          }
        `}</style>
      </footer>
    </div>
  );
}
