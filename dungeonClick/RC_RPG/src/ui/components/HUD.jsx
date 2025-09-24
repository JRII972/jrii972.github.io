import React from "react";
import settings from "../../config/settings";

export default function HUD({ turn = 1, currentActor = null, clicksLeftGlobal = null, clicksLeftTurn = null }) {
  return (
    <div className="hud">
      <div className="hud__left">
        {typeof clicksLeftGlobal === "number" && clicksLeftGlobal >= 0 && (
          <div className="clickBadge" title="Actions restantes pour tout le combat">
            <BoltIcon />
            <span>{clicksLeftGlobal}</span>
          </div>
        )}
        {settings.clicksPerTurn > 1 && typeof clicksLeftTurn === "number" && clicksLeftTurn >= 0 && (
          <div className="clickBadge clickBadge--sub" title="Actions restantes ce tour">
            <RookIcon />
            <span>{clicksLeftTurn}</span>
          </div>
        )}
      </div>

      <div className="hud__center">
        <span>Tour <strong>#{turn}</strong></span>
        <span style={{ marginLeft: 12 }}>
          <strong>{currentActor?.name ?? "—"}</strong>
        </span>
      </div>

      <div className="hud__right" />
    </div>
  );
}

function BoltIcon() {
  return (
    <svg className="clickBadge__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13 2L3 14h7l-1 8 11-14h-7l0-6z" fill="currentColor" />
    </svg>
  );
}

function TurnIcon() {
  return (
    <svg class="clickBadge__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 10V4l-2.9 2.9A8 8 0 1 0 20 12h-2a6 6 0 1 1-1.76-4.24L13 11h7z" fill="currentColor" />
    </svg>

  );
}
