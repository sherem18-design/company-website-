export default function HUDLines() {
  return (
    <div
      className="hud-lines-hero absolute inset-0 pointer-events-none z-20 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* ── Corner bracket: top-left ── */}
      <div className="absolute top-8 left-8 w-20 h-20">
        <div
          className="absolute top-0 left-0 right-0 h-px opacity-50"
          style={{ background: "var(--accent)" }}
        />
        <div
          className="absolute top-0 bottom-0 left-0 w-px opacity-50"
          style={{ background: "var(--accent)" }}
        />
      </div>

      {/* ── Corner bracket: top-right ── */}
      <div className="absolute top-8 right-8 w-20 h-20">
        <div
          className="absolute top-0 left-0 right-0 h-px opacity-50"
          style={{ background: "var(--accent)" }}
        />
        <div
          className="absolute top-0 bottom-0 right-0 w-px opacity-50"
          style={{ background: "var(--accent)" }}
        />
      </div>

      {/* ── Corner bracket: bottom-left ── */}
      <div className="absolute bottom-20 left-8 w-20 h-20">
        <div
          className="absolute bottom-0 left-0 right-0 h-px opacity-50"
          style={{ background: "var(--accent)" }}
        />
        <div
          className="absolute top-0 bottom-0 left-0 w-px opacity-50"
          style={{ background: "var(--accent)" }}
        />
      </div>

      {/* ── Corner bracket: bottom-right ── */}
      <div className="absolute bottom-20 right-8 w-20 h-20">
        <div
          className="absolute bottom-0 left-0 right-0 h-px opacity-50"
          style={{ background: "var(--accent)" }}
        />
        <div
          className="absolute top-0 bottom-0 right-0 w-px opacity-50"
          style={{ background: "var(--accent)" }}
        />
      </div>

      {/* ── Horizontal light track ── */}
      <div
        className="absolute left-0 right-0 h-px opacity-[0.035]"
        style={{
          top: "38%",
          background:
            "linear-gradient(90deg, transparent 0%, var(--accent) 20%, var(--accent) 80%, transparent 100%)",
        }}
      />

      {/* ── Vertical center accent ── */}
      <div
        className="absolute top-0 bottom-0 w-px opacity-[0.02]"
        style={{
          left: "50%",
          background:
            "linear-gradient(180deg, transparent 0%, var(--accent) 30%, var(--accent) 70%, transparent 100%)",
        }}
      />

      {/* ── Animated scan line ── */}
      <div
        className="absolute left-0 right-0 h-28 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(0,232,124,0.018) 50%, transparent 100%)",
          animation: "scanLine 12s linear infinite",
          top: "-120px",
        }}
      />

      {/* ── Reticle crosshair center ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 opacity-[0.12]">
        <div
          className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2"
          style={{ background: "var(--accent)" }}
        />
        <div
          className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
          style={{ background: "var(--accent)" }}
        />
      </div>
    </div>
  );
}
