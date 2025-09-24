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

export default function CombatScene({ hero, enemies = [], allies = [] }) {
  const actors = useMemo(() => [hero, ...allies, ...enemies], [hero, allies, enemies]);

  const { battle, turnMgr, bus, ai } = useMemo(() => {
    const rng = new RNG();
    const bus = new EventBus();
    const cooldowns = new CooldownManager(actors);
    const battle = new Battle({ hero, enemies, allies, rng, cooldowns, eventBus: bus });
    const turnMgr = new TurnManager({ actors });
    const ai = new AIController();
    return { battle, turnMgr, bus, ai };
  }, [actors, hero, enemies, allies]);

  const [logs, setLogs] = useState([]);
  useEffect(() => {
    const off1 = bus.on("log", (line) => setLogs((prev) => [...prev, line]));
    const off2 = bus.on("state:update", () => forceTick((n) => n + 1));
    return () => { off1(); off2(); };
  }, [bus]);

  const [, forceTick] = useState(0);

  const [current, setCurrent] = useState(null);
  useEffect(() => { setCurrent(() => turnMgr.currentActor()); }, [turnMgr]);

  // Limites d'actions (globales → héros principal uniquement ; par tour pour héros)
  const [clicksLeftGlobal, setClicksLeftGlobal] = useState(Math.max(0, Number(settings.clicksTotal ?? 0)));
  const [clicksLeftTurn, setClicksLeftTurn] = useState(null);

  useEffect(() => {
    if (!current) return;
    if (current.id === hero.id) {
      setClicksLeftTurn(Math.max(1, Number(settings.clicksPerTurn ?? 1)));
    } else {
      setClicksLeftTurn(null);
    }
  }, [current, hero.id]);

  const turnLock = useRef(false);

  useEffect(() => {
    if (!current || battle.isOver()) return;
    if (turnLock.current) return;
    turnLock.current = true;

    const end = () => { endTurn(); turnLock.current = false; };

    const skipIfStunned = () => {
      if (battle.hasStun(current)) {
        bus.emit("log", `${current.name} est étourdi et passe son tour !`);
        end();
        return true;
      }
      return false;
    };

    // Héros principal sans actions globales restantes → on saute
    if (current.id === hero.id && clicksLeftGlobal <= 0) {
      bus.emit("log", `Vous n'avez plus d'actions disponibles pour ce combat.`);
      end();
      return;
    }

    // ➜ ennemi courant (si le current est dans enemies)
    const foe = enemies.find(e => e.id === current.id);

    if (foe) {
      if (skipIfStunned()) return;
      const t = setTimeout(() => {
        // L'ennemi cible toujours le héros principal
        const pick = ai.chooseAction(foe, hero) || { action: (foe.actions || [])[0] };
        if (pick?.action) battle.resolve(pick.action, foe, hero);
        end();
      }, 500);
      return () => { clearTimeout(t); turnLock.current = false; };
    } else if (current.id !== hero.id) {
      // ➕ Compagnon : tour automatique côté moteur
      if (skipIfStunned()) return;
      const t = setTimeout(() => { battle.autoTurnCompanion(current); end(); }, 450);
      return () => { clearTimeout(t); turnLock.current = false; };
    } else {
      // Héros : on attend l'input → pas d'auto
      if (skipIfStunned()) return;
      turnLock.current = false;
    }
  }, [current, ai, enemies, hero, battle, bus, clicksLeftGlobal]);

  function endTurn() {
    const { next, roundEnded } = turnMgr.advance();
    if (roundEnded) battle.endOfRound();
    setCurrent(next);
    forceTick((n) => n + 1);
  }

  function onPlayerAction(actionId) {
    if (battle.isOver()) return;
    if (current?.id !== hero.id) return;

    // Limites héros
    if (clicksLeftGlobal <= 0) { bus.emit("log", `Plus d'actions disponibles dans ce combat.`); endTurn(); return; }
    if (typeof clicksLeftTurn === "number" && clicksLeftTurn <= 0) { bus.emit("log", `Limite atteinte pour ce tour.`); endTurn(); return; }
    if (battle.hasStun(hero)) { bus.emit("log", `${hero.name} est étourdi et ne peut pas agir !`); endTurn(); return; }

    const action = hero.actions.find((a) => a.id === actionId);
    if (!action) return;

    // Ciblage 
    battle.resolve(action, hero, null);
    if (battle.isOver()) return;

    // Décréments
    setClicksLeftGlobal((g) => Math.max(0, g - 1));
    if (typeof clicksLeftTurn === "number") setClicksLeftTurn((t) => Math.max(0, t - 1));

    const nextGlobal = clicksLeftGlobal - 1;
    const nextTurn = (typeof clicksLeftTurn === "number") ? (clicksLeftTurn - 1) : 1;
    if (nextGlobal > 0 && nextTurn > 0) return;

    endTurn();
  }

  function onPassTurn() {
    if (current?.id !== hero.id) { endTurn(); return; }
    endTurn();
  }


  const heroShowMP = hero.actions.some((a) => (a.costMP ?? 0) > 0);
  const enemyShowMP = settings.showEnemyMP;
  const allyHasMP = (ally) => ally.actions.some(a => (a.costMP ?? 0) > 0);

  const currentActions = hero.actions.map(a => ({
    id: a.id,
    name: a.name,
    remainingCooldown: a.remainingCooldown,
    canUse: a.canUse(hero, { battle })
  }));

  const anyEnemyAlive = enemies.some(e => e.alive);
  const battleOver = !hero.alive || !anyEnemyAlive;

  const isPlayersTurn = current && (current.id === hero.id || allies.some(a => a.id === current.id));
  const isMainHeroTurn = current?.id === hero.id;

  return (
    <div className="page">
      <div className="topSection">
        <div className="container">
          <HUD
            turn={turnMgr.turn}
            currentActor={current}
            clicksLeftGlobal={isMainHeroTurn ? clicksLeftGlobal : undefined}
            clicksLeftTurn={isMainHeroTurn ? (clicksLeftTurn ?? undefined) : undefined}
          />

          <div className="columns">
            {/* Colonne gauche : Héros + compagnons */}
            <div className="leftCol">
              <EntityCard entity={hero} variant="hero" size="normal" showMP={heroShowMP} showDefense />
              {allies.length > 0 && (
                <div className="alliesGrid">
                  {allies.map((a) => (
                    <EntityCard key={a.id} entity={a} variant="hero" size="small" showMP={allyHasMP(a)} showDefense />
                  ))}
                </div>
              )}
            </div>

            {/* Colonne droite : plusieurs ennemis */}
            <div className="rightCol">
              <div className="alliesGrid">
                {enemies.map((e) => (
                  <EntityCard key={e.id} entity={e} variant="enemy" size="normal" showMP={enemyShowMP} showDefense />
                ))}
              </div>
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
              logs.slice(-8).map((l, i) => <div key={i} className="logLine">• {l}</div>)
            )}
          </div>

          <ActionBar
            title={
              battleOver
                ? "Combat terminé"
                : isMainHeroTurn
                ? `À vous de jouer (${current?.name})`
                : (isPlayersTurn ? `Tour de ${current?.name}` : "Tour de l'ennemi")
            }
            actions={currentActions}
            onAction={(a) => onPlayerAction(a.id)}
            disabled={
              battleOver ||
              !isMainHeroTurn ||
              clicksLeftGlobal <= 0 ||
              (typeof clicksLeftTurn === "number" && clicksLeftTurn <= 0)
            }
            showPass={isMainHeroTurn && !battleOver}
            onPass={onPassTurn}
            passDisabled={!isMainHeroTurn || battleOver}
          />
        </div>
      </div>
    </div>
  );
}
