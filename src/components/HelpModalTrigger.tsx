"use client";

import { openHelpModal } from "./HelpModal";

export default function HelpModalTrigger({ children, className, style }: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <button onClick={openHelpModal} className={className} style={style}>
      {children}
    </button>
  );
}
