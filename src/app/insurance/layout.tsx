import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Страхование автомобиля — Е-Спасатель",
  description:
    "КАСКО, ОСАГО, ДСАГО, GAP и другие виды страхования. Подберём лучшее предложение и оформим полис онлайн.",
  icons: { icon: "/emblema.png", apple: "/emblema.png" },
};

export default function InsuranceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
