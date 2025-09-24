import React, { useEffect, useState } from "react";

// Default export: <CombatUI />
// Drop this file into any React project (Vite/CRA/Next client component) and render <CombatUI />.
// It shows two scenes: (1) intro face-to-face center, (2) slide to corners + actions bar.

export default function CombatUI() {
  const [phase, setPhase] = useState("start"); // "start" | "fight"

  useEffect(() => {
    const t = setTimeout(() => setPhase("fight"), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={styles.page}>
      {/* Inline CSS so it's zero‑dep; tweak freely */}
      
      <div style={styles.arena} className={phase}>
        {/* Hero */}
        <div style={{ ...styles.card, ...styles.hero, ...posFor("hero", phase) }}>
          <div style={styles.label}>Héros</div>
          <StatsBar hp={84} mp={32} align="left" />
        </div>

        {/* Enemy */}
        <div style={{ ...styles.card, ...styles.enemy, ...posFor("enemy", phase) }}>
          <div style={styles.label}>Ennemi</div>
          <StatsBar hp={92} mp={20} align="right" />
        </div>

        {/* Actions */}
        <div style={{ ...styles.actionsWrap, opacity: phase === "fight" ? 1 : 0, pointerEvents: phase === "fight" ? "auto" : "none" }}>
          <ActionButton text="Attaque" onClick={() => alert("Attaque")}/>
          <ActionButton text="Attaque spéciale" onClick={() => alert("Attaque spéciale")}/>
          <ActionButton text="Focus" onClick={() => alert("Focus")}/>
          <ActionButton text="Défense" onClick={() => alert("Défense")}/>
          <ActionButton text="Soin" onClick={() => alert("Soin")}/>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ text, onClick }) {
  return (
    <button onClick={onClick} style={styles.button}>
      {text}
    </button>
  );
}

function StatsBar({ hp, mp, align = "left" }) {
  return (
    <div style={{ ...styles.stats, justifyContent: align === "left" ? "flex-start" : "flex-end" }}>
      <Meter label="HP" value={hp} max={100} />
      <Meter label="MP" value={mp} max={100} kind="mp" />
    </div>
  );
}

function Meter({ label, value, max, kind = "hp" }) {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  const track = { ...styles.meterTrack, background: kind === "hp" ? "#3a3a3a" : "#2c2c2c" };
  const fill = { ...styles.meterFill, width: pct + "%", background: kind === "hp" ? "#16a34a" : "#0ea5e9" };
  return (
    <div style={styles.meterBox}>
      <span style={styles.meterLabel}>{label}</span>
      <div style={track}>
        <div style={fill} />
      </div>
      <span style={styles.meterValue}>{value}</span>
    </div>
  );
}

// --- Layout helpers -------------------------------------------------------
function posFor(who, phase) {
  const common = {
    position: "absolute",
    transition: "all 800ms ease",
  };
  if (phase === "start") {
    if (who === "hero") return { ...common, top: "50%", left: "44%", transform: "translate(-50%, -50%)" };
    return { ...common, top: "50%", left: "56%", transform: "translate(-50%, -50%)" };
  }
  // fight
  if (who === "hero") return { ...common, top: "6%", left: "6%", transform: "none" };
  return { ...common, bottom: "6%", right: "6%", transform: "none" };
}

// --- Styles ---------------------------------------------------------------
const styles = {
  page: {
    width: "100vw",
    height: "100vh",
    margin: 0,
    background: "radial-gradient(1200px 600px at 50% 50%, #0f172a 0%, #0b1022 60%, #070b19 100%)",
    color: "#fff",
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  arena: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  card: {
    width: 160,
    height: 160,
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backdropFilter: "blur(3px)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  hero: {
    background: "linear-gradient(160deg, rgba(13,148,136,0.85), rgba(13,148,136,0.25))",
  },
  enemy: {
    background: "linear-gradient(160deg, rgba(220,38,38,0.85), rgba(220,38,38,0.25))",
  },
  label: {
    fontWeight: 700,
    letterSpacing: 0.5,
  },
  stats: {
    width: "100%",
    display: "flex",
    gap: 8,
  },
  meterBox: {
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    alignItems: "center",
    gap: 6,
    width: "100%",
  },
  meterLabel: {
    fontSize: 12,
    opacity: 0.9,
  },
  meterValue: {
    fontSize: 12,
    opacity: 0.9,
  },
  meterTrack: {
    height: 8,
    borderRadius: 999,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.12)",
  },
  meterFill: {
    height: "100%",
  },
  actionsWrap: {
    position: "absolute",
    left: "50%",
    bottom: "4%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: 12,
    transition: "opacity 400ms ease",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "min(780px, 92vw)",
  },
  button: {
    padding: "12px 16px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
    color: "#fff",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 600,
    letterSpacing: 0.3,
    boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
    transition: "transform 120ms ease, box-shadow 120ms ease, background 200ms ease",
  },
};

