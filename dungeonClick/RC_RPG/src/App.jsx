import React, { useMemo } from "react";
import CombatScene from "./ui/scenes/CombatScene.jsx";
import { LogProvider } from "./ui/context/LogContext.jsx";
import { createWarrior, createArcher, createMage , createClassicEnemies} from "./data/presets.js";
import './App.css';

export default function App() {
  const hero = useMemo(() => createWarrior(), []);
  const enemies = useMemo(() => createClassicEnemies(), []); // tableau d'ennemis
  const allies = useMemo(() => [createArcher(), createMage()], []);

  return (
    <LogProvider>
      <div className="app">
        <CombatScene hero={hero} enemies={enemies} allies={allies} />
      </div>
    </LogProvider>
  );
}
