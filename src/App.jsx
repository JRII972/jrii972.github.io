import React, { useMemo } from "react";
import CombatScene from "./ui/scenes/CombatScene.jsx";
import { createHero, createEnemy } from "./data/presets.js";

export default function App() {
  // Instancie le héros et l’ennemi depuis les presets (une seule fois)
  const hero = useMemo(() => createHero(), []);
  const enemy = useMemo(() => createEnemy(), []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background:
          "radial-gradient(1200px 600px at 50% 50%, #0f172a 0%, #0b1022 60%, #070b19 100%)",
      }}
    >
      {/* Passe le héros et l’ennemi en entrée à la scène */}
      <CombatScene hero={hero} enemy={enemy} />
    </div>
  );
}
