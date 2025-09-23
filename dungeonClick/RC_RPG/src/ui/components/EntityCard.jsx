import React from "react";

/**
 * variant: "hero" | "enemy"  → couleurs de bordure
 */
export function EntityCard({ entity, variant = "hero", showMP, showDefense = true }) {
  if (!entity) return null;
  const { name, hp, maxHP, mp, maxMP, statuses, portrait } = entity;

  const shouldShowMP = !!showMP;

  // Armure actuelle = réduction plate active (défense pour la prochaine attaque)
  const defendFlat = Math.max(0, Number(statuses?.get?.("defend_flat") || 0));
  const showArmorBadge = showDefense && defendFlat > 0;

  return (
    <div className={`entityCard entityCard--${variant}`}>
      {/* Image carrée + overlay armure */}
      <div className="entityCard__portrait">
        {portrait ? (
          <img className="entityCard__img" src={portrait} alt={name} />
        ) : (
          <div className="entityCard__img entityCard__img--placeholder">?</div>
        )}

        {showArmorBadge && (
          <div className="entityCard__armorBadge" title={`Armure active : ${defendFlat}`}>
            <ShieldIcon />
            <span>{defendFlat}</span>
          </div>
        )}
      </div>

      <div className="entityCard__name">{name}</div>

      <div className="entityCard__stats">
        <Meter label="HP" value={hp} max={maxHP} kind="hp" />
        {shouldShowMP && <Meter label="MP" value={mp} max={maxMP} kind="mp" />}
      </div>
    </div>
  );
}

function Meter({ label, value, max, kind = "hp" }) {
  const pct = Math.max(0, Math.min(100, Math.round(((value ?? 0) / (max || 1)) * 100)));
  const trackCls = `entityCard__track ${kind === "mp" ? "entityCard__track--mp" : ""}`;
  const fillCls = `entityCard__fill ${kind === "mp" ? "entityCard__fill--mp" : ""}`;
  return (
    <div className="entityCard__meterBox">
      <span className="entityCard__meterLabel">{label}</span>
      <div className={trackCls}><div className={fillCls} style={{ width: pct + "%" }} /></div>
      <span className="entityCard__meterValue">{value}</span>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg className="entityCard__armorIcon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3l7 3v6c0 4.418-3.582 7.5-7 9-3.418-1.5-7-4.582-7-9V6l7-3z"
        fill="currentColor"
      />
    </svg>
  );
}
