import React, { useEffect, useMemo, useRef, useState } from "react";

import ActionBar from "../components/ActionBar.jsx";
import { EntityCard } from "../components/EntityCard.jsx";
import HUD from "../components/HUD.jsx";

import settings from "../../config/settings.js";

import RNG from "../../core/combat/RNG.js";
import CooldownManager from "../../core/combat/CooldownManager.js";
import TurnManager from "../../core/combat/TurnManager.js";
import Battle from "../../core/combat/Battle.js";
import EventBus from "../../core/state/EventBus.js";
import GameState from "../../core/state/GameState.js";
import AIController from "../../adapters/AIController.js";

export default function CombatScene({ hero, enemy }) {
  const { battle, turnMgr, game, bus, ai } = useMemo(() => {
    const rng = new RNG();
    const bus = new EventBus();
    const cooldowns = new CooldownManager([hero, enemy]);
    const battle = new Battle({ hero, enemy, rng, cooldowns, eventBus: bus });
    const turnMgr = new TurnManager({ actors: [hero, enemy] });
    const game = new GameState({ hero, enemy });
    const ai = new AIController();
    return { battle, turnMgr, game, bus, ai };
  }, [hero, enemy]);

  const [logs, setLogs] = useState([]);
  useEffect(() => {
    const off1 = bus.on("log", (line) => {
      setLogs((prev) => [...prev, line]);
      game.pushLog(line);
    });
    const off2 = bus.on("state:update", () => forceTick((n) => n + 1));
    return () => { off1(); off2(); };
  }, [bus, game]);

  const [, forceTick] = useState(0);

  const [current, setCurrent] = useState(null);
  useEffect(() => { setCurrent(() => turnMgr.currentActor()); }, [turnMgr]);

  const turnLock = useRef(false);

  useEffect(() => {
    if (!current || battle.isOver()) return;
    if (turnLock.current) return;
    turnLock.current = true;

    const skipIfStunned = () => {
      if (battle.hasStun(current)) {
        bus.emit("log", `${current.name} est étourdi et passe son tour !`);
        endTurn();
        return true;
      }
      return false;
    };

    if (current.id === enemy.id) {
      if (skipIfStunned()) { turnLock.current = false; return; }
      const t = setTimeout(() => {
        if (battle.hasStun(enemy)) {
          bus.emit("log", `${enemy.name} est étourdi et passe son tour !`);
          endTurn();
          turnLock.current = false;
          return;
        }
        const pick = ai.chooseAction(enemy, hero);
        if (pick?.action) battle.resolve(pick.action, enemy, pick.target ?? hero);
        endTurn();
        turnLock.current = false;
      }, 500);
      return () => { clearTimeout(t); turnLock.current = false; };
    } else {
      if (skipIfStunned()) { turnLock.current = false; return; }
      turnLock.current = false;
    }
  }, [current, ai, enemy, hero, battle, bus]);

  function endTurn() {
    const wasIndex0 = turnMgr.currentIndex === 0;
    const next = turnMgr.nextActor();
    if (turnMgr.currentIndex === 0 && !wasIndex0) battle.endOfRound();
    setCurrent(next);
    forceTick((n) => n + 1);
  }

  function onPlayerAction(actionId) {
    if (battle.isOver()) return;
    if (current?.id !== hero.id) return;
    if (battle.hasStun(hero)) {
      bus.emit("log", `${hero.name} est étourdi et ne peut pas agir !`);
      endTurn();
      return;
    }
    const action = hero.actions.find((a) => a.id === actionId);
    if (!action) return;
    const target = action.kind === "attack" ? enemy : hero;
    battle.resolve(action, hero, target);
    if (battle.isOver()) return;
    endTurn();
  }

  const heroShowMP = hero.actions.some((a) => (a.costMP ?? 0) > 0);
  const actionModels = hero.actions.map((a) => ({
    id: a.id,
    name: a.name,
    remainingCooldown: a.remainingCooldown,
    canUse: a.canUse(hero, { battle }),
  }));
  const battleOver = !hero.alive || !enemy.alive;

  return (
    <div className="page">
      <div className="topSection">
        <div className="container">
          <HUD turn={turnMgr.turn} currentActor={current} />
          <div className="cardsRow">
            <div className="cardCol">
              <EntityCard entity={hero} variant="hero" showMP={heroShowMP} showDefense />
            </div>
            <div className="cardCol">
              <EntityCard entity={enemy} variant="enemy" showMP={settings.showEnemyMP} showDefense />
            </div>
          </div>
        </div>
      </div>

      <div className="spacer" />

      <div className="bottomSection">
        <div className="container">
          <div className="logsBox">
            {logs.length === 0 ? (
              <div className="logEmpty">Le combat commence…</div>
            ) : (
              logs.slice(-8).map((l, i) => (
                <div key={i} className="logLine">• {l}</div>
              ))
            )}
          </div>

          <ActionBar
            title={battleOver ? "Combat terminé" : current?.id === hero.id ? "À vous de jouer" : "Tour de l'ennemi"}
            actions={actionModels}
            onAction={(a) => onPlayerAction(a.id)}
            disabled={battleOver || current?.id !== hero.id}
          />
        </div>
      </div>
    </div>
  );
}
