import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Европротокол онлайн — Е-Спасатель",
  description:
    "Цифровое оформление извещения о ДТП без вызова ГИБДД. Заполните европротокол РФ онлайн с функцией сканирования документов.",
  icons: {
    icon: "/emblema.png",
    apple: "/emblema.png",
  },
};

export default function EuroprotocolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
