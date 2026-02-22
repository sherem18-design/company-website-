/* ─────────────────────────────────────────────────────────────────────────────
   БАЗА ЦЕН СТРАХОВЫХ КОМПАНИЙ
   ─────────────────────────────────────────────────────────────────────────────
   Как обновлять цены:
   1. Измените basePrice у нужной компании / типа страхования
   2. OUR_MARKUP — общий коэффициент наценки (1.20 = +20%)
   3. Можно задать markup индивидуально для каждой компании (override)
   4. Когда подключите API агрегатора — замените basePrice на данные из API
   ───────────────────────────────────────────────────────────────────────────── */

export const OUR_MARKUP = 1.20; // глобальная наценка 20%

export type InsuranceType = "osago" | "kasko" | "kasko-lite" | "dsago" | "gap" | "green" | "accident";

export interface CompanyOffer {
  company: string;
  logo: string;         // аббревиатура для отображения
  rating: number;       // 1–5
  payoutRate: number;   // % выплат
  markup: number;       // индивидуальный коэффициент наценки
  badge?: string;       // метка: "Лучшая цена" | "Топ выплат" | "Популярное"
  prices: {
    [K in InsuranceType]?: {
      base: number;     // базовая цена (без наценки) в рублях/год
      // Коэффициенты для расчёта по мощности (ОСАГО)
      powerCoeff?: Record<string, number>; // "до 50" | "51–70" | "71–100" | "101–120" | "121–150" | "150+"
    };
  };
}

/* ─── Коэффициенты мощности для ОСАГО (базовые по ЦБ РФ) ─── */
export const POWER_COEFFICIENTS: Record<string, number> = {
  "до 50":   0.6,
  "51–70":   1.0,
  "71–100":  1.1,
  "101–120": 1.2,
  "121–150": 1.4,
  "150+":    1.6,
};

export const COMPANIES: CompanyOffer[] = [
  {
    company: "Ингосстрах",
    logo: "ИНГ",
    rating: 4.9,
    payoutRate: 98,
    markup: 1.20,
    badge: "Топ выплат",
    prices: {
      osago:      { base: 7200,  powerCoeff: { "до 50": 4320, "51–70": 7200, "71–100": 7920, "101–120": 8640, "121–150": 10080, "150+": 11520 } },
      kasko:      { base: 52000 },
      "kasko-lite": { base: 18000 },
      dsago:      { base: 2200 },
      gap:        { base: 9500 },
      green:      { base: 4800 },
      accident:   { base: 3200 },
    },
  },
  {
    company: "РЕСО-Гарантия",
    logo: "РЕСО",
    rating: 4.7,
    payoutRate: 95,
    markup: 1.18,
    badge: "Лучшая цена",
    prices: {
      osago:      { base: 6800,  powerCoeff: { "до 50": 4080, "51–70": 6800, "71–100": 7480, "101–120": 8160, "121–150": 9520, "150+": 10880 } },
      kasko:      { base: 48000 },
      "kasko-lite": { base: 16500 },
      dsago:      { base: 1900 },
      gap:        { base: 8800 },
      green:      { base: 4200 },
      accident:   { base: 2900 },
    },
  },
  {
    company: "АльфаСтрахование",
    logo: "АЛФ",
    rating: 4.6,
    payoutRate: 94,
    markup: 1.22,
    prices: {
      osago:      { base: 7400,  powerCoeff: { "до 50": 4440, "51–70": 7400, "71–100": 8140, "101–120": 8880, "121–150": 10360, "150+": 11840 } },
      kasko:      { base: 54000 },
      "kasko-lite": { base: 19000 },
      dsago:      { base: 2400 },
      gap:        { base: 10200 },
      green:      { base: 5100 },
      accident:   { base: 3500 },
    },
  },
  {
    company: "Тинькофф Страхование",
    logo: "ТНК",
    rating: 4.5,
    payoutRate: 92,
    markup: 1.25,
    badge: "Популярное",
    prices: {
      osago:      { base: 6600,  powerCoeff: { "до 50": 3960, "51–70": 6600, "71–100": 7260, "101–120": 7920, "121–150": 9240, "150+": 10560 } },
      kasko:      { base: 46000 },
      "kasko-lite": { base: 15500 },
      dsago:      { base: 1800 },
      green:      { base: 3900 },
      accident:   { base: 2700 },
    },
  },
  {
    company: "СберСтрахование",
    logo: "СБР",
    rating: 4.4,
    payoutRate: 91,
    markup: 1.20,
    prices: {
      osago:      { base: 7000,  powerCoeff: { "до 50": 4200, "51–70": 7000, "71–100": 7700, "101–120": 8400, "121–150": 9800, "150+": 11200 } },
      kasko:      { base: 50000 },
      "kasko-lite": { base: 17000 },
      dsago:      { base: 2000 },
      gap:        { base: 9000 },
      green:      { base: 4500 },
      accident:   { base: 3000 },
    },
  },
  {
    company: "Согласие",
    logo: "СОГ",
    rating: 4.3,
    payoutRate: 89,
    markup: 1.15,
    prices: {
      osago:      { base: 6500,  powerCoeff: { "до 50": 3900, "51–70": 6500, "71–100": 7150, "101–120": 7800, "121–150": 9100, "150+": 10400 } },
      kasko:      { base: 44000 },
      "kasko-lite": { base: 15000 },
      dsago:      { base: 1700 },
      accident:   { base: 2500 },
    },
  },
];

/* ─── Вычислить финальную цену для клиента ─── */
export function calcPrice(
  company: CompanyOffer,
  type: InsuranceType,
  power?: string,
): number | null {
  const priceData = company.prices[type];
  if (!priceData) return null;

  let base = priceData.base;

  // Для ОСАГО используем коэффициент мощности если выбран
  if (type === "osago" && power && priceData.powerCoeff?.[power]) {
    base = priceData.powerCoeff[power];
  }

  return Math.round(base * company.markup);
}

/* ─── Получить все предложения по типу, отсортированные по цене ─── */
export function getOffers(type: InsuranceType, power?: string) {
  return COMPANIES
    .map((c) => ({ company: c, price: calcPrice(c, type, power) }))
    .filter((o): o is { company: CompanyOffer; price: number } => o.price !== null)
    .sort((a, b) => a.price - b.price);
}

/* ─── Диалог ассистента: вопросы для подбора страховки ─── */
export type AssistantStep = {
  id: string;
  question: string;
  options: { label: string; value: string; next: string }[];
};

export type AssistantResult = {
  type: InsuranceType;
  title: string;
  reason: string;
};

export const ASSISTANT_FLOW: Record<string, AssistantStep | AssistantResult> = {
  start: {
    id: "start",
    question: "Для чего вам страховка?",
    options: [
      { label: "Поездки за рубеж", value: "abroad", next: "abroad" },
      { label: "Защита от ДТП и угона", value: "full", next: "credit" },
      { label: "Обязательное (просто нужно)", value: "mandatory", next: "mandatory" },
      { label: "Расширить лимит ОСАГО", value: "dsago", next: "dsago_result" },
    ],
  },
  credit: {
    id: "credit",
    question: "Автомобиль куплен в кредит?",
    options: [
      { label: "Да, кредитный", value: "yes", next: "kasko_result" },
      { label: "Нет, собственный", value: "no", next: "age" },
    ],
  },
  age: {
    id: "age",
    question: "Сколько лет автомобилю?",
    options: [
      { label: "До 3 лет", value: "new", next: "theft" },
      { label: "3–7 лет", value: "mid", next: "theft" },
      { label: "Старше 7 лет", value: "old", next: "old_result" },
    ],
  },
  theft: {
    id: "theft",
    question: "Хотите защиту от угона и полной гибели?",
    options: [
      { label: "Да, максимальная защита", value: "yes", next: "kasko_result" },
      { label: "Только от угона, подешевле", value: "lite", next: "kasko_lite_result" },
      { label: "Нет, мне достаточно ОСАГО", value: "no", next: "osago_result" },
    ],
  },
  mandatory: {
    id: "mandatory",
    question: "У вас уже есть ОСАГО?",
    options: [
      { label: "Нет, нужно оформить", value: "no", next: "osago_result" },
      { label: "Есть, хочу дополнить", value: "yes", next: "addon" },
    ],
  },
  addon: {
    id: "addon",
    question: "Что хотите добавить к ОСАГО?",
    options: [
      { label: "Увеличить лимит выплат", value: "dsago", next: "dsago_result" },
      { label: "Страховку от несчастного случая", value: "accident", next: "accident_result" },
      { label: "Зелёную карту (въезд в ЕС)", value: "green", next: "green_result" },
    ],
  },
  abroad: {
    id: "abroad",
    question: "В какие страны планируете поездки?",
    options: [
      { label: "Страны ЕС / СНГ", value: "eu", next: "green_result" },
      { label: "Только по России", value: "ru", next: "start" },
    ],
  },
  // Результаты
  kasko_result:      { type: "kasko",      title: "КАСКО",        reason: "Полная защита: ДТП, угон, стихия, ущерб по вашей вине. Обязательно для кредитных авто." },
  "kasko-lite_result": { type: "kasko-lite", title: "КАСКО-лайт",   reason: "Защита только от угона и полной гибели — оптимальное соотношение цены и защиты." },
  kasko_lite_result: { type: "kasko-lite", title: "КАСКО-лайт",   reason: "Защита только от угона и полной гибели — оптимальное соотношение цены и защиты." },
  osago_result:      { type: "osago",      title: "ОСАГО",        reason: "Обязательный полис для каждого водителя. Покрывает ущерб пострадавшей стороне." },
  old_result:        { type: "osago",      title: "ОСАГО",        reason: "Для авто старше 7 лет КАСКО обычно невыгодно — ОСАГО оптимальный выбор." },
  dsago_result:      { type: "dsago",      title: "ДСАГО",        reason: "Расширяет лимит ОСАГО до 3–30 млн ₽. Незаменимо при ДТП с дорогим авто." },
  green_result:      { type: "green",      title: "Зелёная карта", reason: "Обязателен для въезда в страны ЕС и СНГ. Аналог ОСАГО за рубежом." },
  accident_result:   { type: "accident",   title: "НС водителя",  reason: "Выплата при травме, инвалидности или гибели водителя — независимо от виновника." },
};

export function isAssistantResult(step: AssistantStep | AssistantResult): step is AssistantResult {
  return "type" in step;
}
