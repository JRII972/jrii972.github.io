import React, { useMemo } from "react";
import CombatScene from "./ui/scenes/CombatScene.jsx";
import { createHero, createEnemies, createAllies } from "./data/presets.js";
import './App.css';

export default function App() {
  const hero = useMemo(() => createHero(), []);
  const enemies = useMemo(() => createEnemies(), []); // tableau d'ennemis
  const allies = useMemo(() => createAllies(), []);

  return (
    <div className="app">
      <CombatScene hero={hero} enemies={enemies} allies={allies} />
    </div>
  );
}
