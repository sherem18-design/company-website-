import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Эвакуация автомобиля — Е-Спасатель",
  description:
    "Вызов эвакуатора онлайн. Быстро, круглосуточно. Укажите местоположение и данные автомобиля — специалист перезвонит в течение 3 минут.",
  icons: { icon: "/emblema.png", apple: "/emblema.png" },
};

export default function EvacuationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
