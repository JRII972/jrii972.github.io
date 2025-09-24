import React from "react";

/**
 * variant: "hero" | "enemy"
 * size: "normal" | "small"
 */
export function EntityCard({ entity, variant = "hero", size = "normal", showMP, showDefense = true }) {
  if (!entity) return null;
  const { name, hp, maxHP, mp, maxMP, statuses, portrait } = entity;

  const shouldShowMP = !!showMP;
  let defendFlat = Number(statuses?.get?.("defend_flat"));
  if (!Number.isFinite(defendFlat)) defendFlat = 0;
  const showArmorBadge = showDefense && defendFlat > 0;

  return (
    <div className={`entityCard entityCard--${variant} ${size === "small" ? "entityCard--small" : ""}`}>
      <div className="entityCard__portrait">
        {portrait ? (
          <img className="entityCard__img" src={portrait} alt={name} />
        ) : (
          <div className="entityCard__img entityCard__img--placeholder">?</div>
        )}
        {showArmorBadge && (
          <div className="entityCard__armorBadge" title={`Armure active : ${defendFlat}`}>
            <ShieldIcon /><span>{String(defendFlat)}</span>
          </div>
        )}
      </div>

      <div className="entityCard__name">{name}</div>

      <div className="entityCard__stats">
        <Meter label="HP" value={hp ?? 0} max={maxHP ?? 1} kind="hp" />
        {shouldShowMP && <Meter label="MP" value={mp ?? 0} max={maxMP ?? 1} kind="mp" />}
      </div>
    </div>
  );
}

function Meter({ label, value, max, kind = "hp" }) {
  const pct = Math.max(0, Math.min(100, Math.round((Number(value || 0) / Number(max || 1)) * 100)));
  const trackCls = `entityCard__track ${kind === "mp" ? "entityCard__track--mp" : ""}`;
  const fillCls = `entityCard__fill ${kind === "mp" ? "entityCard__fill--mp" : ""}`;
  return (
    <div className="entityCard__meterBox">
      <span className="entityCard__meterLabel">{label}</span>
      <div className={trackCls}><div className={fillCls} style={{ width: pct + "%" }} /></div>
      <span className="entityCard__meterValue">{String(value ?? 0)}</span>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg className="entityCard__armorIcon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l7 3v6c0 4.418-3.582 7.5-7 9-3.418-1.5-7-4.582-7-9V6l7-3z" fill="currentColor" />
    </svg>
  );
}
