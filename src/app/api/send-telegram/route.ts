import { NextRequest, NextResponse } from "next/server";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, service, desc, source } = body;

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
