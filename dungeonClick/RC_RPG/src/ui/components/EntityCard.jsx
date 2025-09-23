import React from "react";
import settings from "../../config/settings.js";

export function EntityCard({ entity, align = "left", showMP, showDefense = true }) {
  if (!entity) return null;
  const { name, hp, maxHP, mp, maxMP, statuses /*, tags*/ } = entity;
  const pos = align === "left" ? { top: "6%", left: "6%", position: "absolute" } : { bottom: "6%", right: "6%", position: "absolute" };

  // Règles d'affichage MP :
  const isEnemy = align !== "left";
  const shouldShowMP = isEnemy ? !!settings.showEnemyMP : !!showMP;

  // Défense actuelle (réduction plate en attente)
  const defendFlat = Math.max(0, Number(statuses?.get?.("defend_flat") || 0));
  const showDefenseBadge = showDefense && (!isEnemy || (isEnemy && settings.showEnemyDefense)) && defendFlat > 0;

  return (
    <div style={{ ...card, ...pos, background: align === "left" ? heroBg : enemyBg }}>
      <div style={topRow}>
        <div style={label}>{name}</div>
        {showDefenseBadge && <div style={defBadge}>DEF +{defendFlat}</div>}
      </div>
      <div style={statsCol}>
        <Meter label="HP" value={hp} max={maxHP} kind="hp" />
        {shouldShowMP && <Meter label="MP" value={mp} max={maxMP} kind="mp" />}
      </div>
    </div>
  );
}

function Meter({ label, value, max, kind = "hp" }) {
  const pct = Math.max(0, Math.min(100, Math.round(((value ?? 0) / (max || 1)) * 100)));
  const track = { ...meterTrack, background: kind === "hp" ? "#3a3a3a" : "#2c2c2c" };
  const fill = { ...meterFill, width: pct + "%", background: kind === "hp" ? "#16a34a" : "#0ea5e9" };
  return (
    <div style={meterBox}>
      <span style={meterLabel}>{label}</span>
      <div style={track}><div style={fill} /></div>
      <span style={meterValue}>{value}</span>
    </div>
  );
}

const card = {
  width: 200,
  height: 150,
  borderRadius: 16,
  boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "flex-start",
  padding: 12,
  backdropFilter: "blur(3px)",
  border: "1px solid rgba(255,255,255,0.08)",
};
const heroBg = "linear-gradient(160deg, rgba(13,148,136,0.85), rgba(13,148,136,0.25))";
const enemyBg = "linear-gradient(160deg, rgba(220,38,38,0.85), rgba(220,38,38,0.25))";

const topRow = { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 };
const label = { fontWeight: 700, letterSpacing: 0.5 };
const defBadge = {
  fontSize: 12,
  padding: "2px 8px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(255,255,255,0.08)",
};

const statsCol = { display: "flex", gap: 8, flexDirection: "column" };

const meterBox = { display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 6, alignItems: "center", width: "100%" };
const meterLabel = { fontSize: 12, opacity: 0.9 };
const meterValue = { fontSize: 12, opacity: 0.9 };
const meterTrack = { height: 8, borderRadius: 999, overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)" };
const meterFill = { height: "100%" };
