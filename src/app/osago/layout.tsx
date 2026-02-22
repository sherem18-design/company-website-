import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ОСАГО онлайн — Е-Спасатель",
  description:
    "Оформление полиса ОСАГО онлайн. Быстрый расчёт стоимости, сбор данных и подготовка документов без визита в офис.",
  icons: { icon: "/emblema.png", apple: "/emblema.png" },
};

export default function OsagoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
