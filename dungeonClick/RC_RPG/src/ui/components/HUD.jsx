import React from "react";

export default function HUD({ turn = 1, currentActor = null }) {
  return (
    <div className="hud">
      <div>Tour <strong>#{turn}</strong></div>
      <div> <strong>{currentActor?.name ?? "—"}</strong></div>
    </div>
  );
}
