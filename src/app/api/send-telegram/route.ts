import { NextRequest, NextResponse } from "next/server";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

const ALLOWED_ORIGINS = [
  "https://еспасатель.рф",
  "https://www.еспасатель.рф",
  "https://willowy-semolina-1d1e89.netlify.app",
  /^https:\/\/[a-z0-9-]+--willowy-semolina-1d1e89\.netlify\.app$/,
  /^http:\/\/localhost(:\d+)?$/,
];

function isAllowedOrigin(origin: string | null, referer: string | null): boolean {
  const val = origin || referer || "";
  if (!val) return false;
  const url = val.startsWith("http") ? val : `https://${val}`;
  return ALLOWED_ORIGINS.some((o) =>
    typeof o === "string" ? url.startsWith(o) : o.test(url)
  );
}

function sanitize(str: string, maxLen: number): string {
  return String(str)
    .slice(0, maxLen)
    .replace(/[*_`\[\]()#]/g, "")
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get("origin");
    const referer = req.headers.get("referer");
    if (!isAllowedOrigin(origin, referer)) {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const raw = { name: body.name, phone: body.phone, service: body.service, desc: body.desc, source: body.source };

    const name = sanitize(raw.name ?? "", 80);
    const phone = sanitize(raw.phone ?? "", 24);
    const service = sanitize(raw.service ?? "", 120);
    const desc = sanitize(raw.desc ?? "", 500);
    const source = sanitize(raw.source ?? "", 120);

    if (!name || !phone) {
      return NextResponse.json({ ok: false, error: "Не заполнены обязательные поля" }, { status: 400 });
    }

    const date = new Date().toLocaleString("ru-RU", {
      timeZone: "Europe/Moscow",
      day: "2-digit",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });

    const text = [
      `🆕 *Новая заявка — Е-Спасатель*`,
      ``,
      `👤 *Имя:* ${name}`,
      `📞 *Телефон:* ${phone}`,
      service ? `🔧 *Услуга:* ${service}` : null,
      desc ? `📝 *Описание:* ${desc}` : null,
      source ? `📍 *Источник:* ${source}` : null,
      ``,
      `🕐 ${date} (МСК)`,
    ]
      .filter(Boolean)
      .join("\n");

    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "Markdown",
      }),
    });

    const data = await res.json();

    if (!data.ok) {
      return NextResponse.json({ ok: false, error: data.description }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
