import React, { useEffect, useMemo, useRef, useState } from "react";

import ActionBar from "../components/ActionBar.jsx";
import { EntityCard } from "../components/EntityCard.jsx";
import HUD from "../components/HUD.jsx";

import settings from "../../config/settings.js";

import RNG from "../../core/combat/RNG.js";
import CooldownManager from "../../core/combat/CooldownManager.js";
import Battle from "../../core/combat/Battle.js";
import { useLogs } from "../context/LogContext.jsx";
import GameState from "../../core/state/GameState.js";

export default function CombatScene({ hero, enemies = [], allies = [], seed = Date.now() }) {
  const { logs: contextLogs } = useLogs();
  const actors = useMemo(() => [hero, ...allies, ...enemies], [hero, allies, enemies]);

  const [round, setRound] = useState(1);
  const [clicksLeftGlobal, setClicksLeftGlobal] = useState(Math.max(0, Number(settings.clicksTotal ?? 0)));
  const [clicksLeftTurn, setClicksLeftTurn] = useState(Math.max(1, Number(settings.clicksPerTurn ?? 1)));

  const battleRef = useRef(null);

  useEffect(() => {
    const rng = new RNG(seed);
    const cooldowns = new CooldownManager(actors);
    const battle = new Battle({
      hero, enemies, allies, rng, cooldowns,
      onStateChange: (s) => {
        setRound(s.round);
        setClicksLeftGlobal(s.clicksLeftGlobal);
        setClicksLeftTurn(s.clicksLeftTurn);
      }
    });
    battleRef.current = battle;
    battle.start();
    return () => battle.dispose?.();
  }, [actors, hero, enemies, allies, seed]);

  function onPlayerAction(actionId) {
    const battle = battleRef.current;
    if (!battle) return;
    battle.playerUse(actionId);
  }

  function onPassTurn() {
    battleRef.current?.passHeroTurn();
  }


  const heroShowMP = hero.actions.some((a) => (a.costMP ?? 0) > 0);
  const enemyShowMP = settings.showEnemyMP;
  const allyHasMP = (ally) => ally.actions.some(a => (a.costMP ?? 0) > 0);

  const currentActions = hero.actions.map(a => ({
    id: a.id,
    name: a.name,
    remainingCooldown: a.remainingCooldown,
    canUse: a.canUse(hero, { battle: battleRef.current }) && clicksLeftTurn > 0 && clicksLeftGlobal > 0 && !(battleRef.current?.hasStun(hero))
  }));

  const anyEnemyAlive = enemies.some(e => e.alive);
  const battleOver = !hero.alive || !anyEnemyAlive;

  return (
    <div className="page">
      <div className="topSection">
        <div className="container">
          <HUD
            turn={round}
            currentActor={hero}
            clicksLeftGlobal={clicksLeftGlobal}
            clicksLeftTurn={clicksLeftTurn}
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
            {contextLogs.length === 0 ? (
              <div className="logEmpty">Le combat commence…</div>
            ) : (
              contextLogs.slice(-8).map((l, i) => <div key={i} className="logLine">• {l}</div>)
            )}
          </div>

          <ActionBar
            title={battleOver ? "Combat terminé" : `Tour du héros (${hero.name})`}
            actions={currentActions}
            onAction={(a) => onPlayerAction(a.id)}
            disabled={battleOver || clicksLeftGlobal <= 0 || clicksLeftTurn <= 0}
            showPass={!battleOver}
            onPass={onPassTurn}
            passDisabled={battleOver}
          />
        </div>
      </div>
    </div>
  );
}
