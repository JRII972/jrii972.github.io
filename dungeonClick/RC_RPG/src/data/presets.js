import Character from "../core/entities/Character.js";
import { ActionRegistry, createEffect } from "../core/actions/index.js";
import { createClear } from "../core/effects/index.js";

/** =========================
 * HÉROS JOUEUR
 * ========================= */

export function createWarrior() {
  const atk = ActionRegistry.attack("Attaque", "Coup standard.", 10, 0.50, 1, 0, []);
  atk.aiWeight = 0.25; // pondération générique quand 4+ comp.

  const spe = ActionRegistry.attack(
    "Coup d’épée",
    "Attaque spéciale + Gel (stun 1 tour).",
    15, 0.60, 2, 0,
    [createEffect("Gel", "La cible est gelée 1 tour.", "STUN", "target", 1, 0)]
  );
  spe.aiWeight = 0.30;

  const focus = ActionRegistry.focus
    ? ActionRegistry.focus("Focus", "Augmente la précision temporairement.", 0.15 /* +15% */, 3, 0.05 /* decay */, 1)
    : ActionRegistry.defend("Focus", "Placeholder focus (utiliser votre implémentation focus).", { aiWeight: 0.20 }); // fallback si vous n'avez pas de focus dédié
  focus.aiWeight = 0.20;

  const def = ActionRegistry.defend(
    "Défense",
    "Réduit la prochaine attaque de 15 puis 5 de moins pendant 3 tours (approx).",
    { aiWeight: 0.20, cooldown: 1 }
  );

  const heal = ActionRegistry.heal(
    "Soin",
    "Soigne ~10% PV (≈ 20 PV) et retire les effets de dégâts (poison/brûlure).",
    20, 1.0, 2, 0, "ally",
    { aiWeight: 0.20, effects: [createClear("Purification", "Retire les effets de dégâts.", "ally", ["DEG"])] }
  );

  return new Character({
    id: "hero_warrior",
    name: "Guerrier",
    maxHP: 200, maxMP: 0,
    atk: 10, def: 10, speed: 10,
    portrait: "/images/hero_warrior.png",
    ai: { name: "warrior_ai", features: ["max_pv", "no_def"] }, // si auto
    actions: [atk, spe, focus, def, heal],
  });
}

export function createArcher() {
  const atk = ActionRegistry.attack("Attaque", "Tir standard.", 15, 0.60, 1, 0, []);
  atk.aiWeight = 0.25;

  const spe = ActionRegistry.attack(
    "Flèche empoisonnée",
    "20 dégâts + poison 5 (type DEG).",
    20, 0.60, 2, 0,
    [createEffect("Poison", "Perd 5 PV par tour jusqu'au soin.", "DEG", "target", 99, 5)]
  );
  spe.aiWeight = 0.50;

  const focus = ActionRegistry.focus
    ? ActionRegistry.focus("Focus", "Augmente la précision temporairement.", 0.15, 3, 0.05, 1)
    : ActionRegistry.defend("Focus", "Placeholder focus.", { aiWeight: 0.20 });
  focus.aiWeight = 0.20;

  const def = ActionRegistry.defend("Défense", "Réduction dégâts prochaine attaque (voir moteur).", { aiWeight: 0.15, cooldown: 1 });

  const heal = ActionRegistry.heal(
    "Soin",
    "Soigne ~10% PV (≈ 10 PV) et retire les effets de dégâts.",
    10, 1.0, 2, 0, "ally",
    { aiWeight: 0.20, effects: [createClear("Purification", "Retire les effets de dégâts.", "ally", ["DEG"])] }
  );

  return new Character({
    id: "hero_archer",
    name: "Archer",
    maxHP: 100, maxMP: 0,
    atk: 15, def: 8, speed: 12,
    portrait: "/images/hero_archer.png",
    ai: { name: "archer_ai", features: ["weakest_pct", "no_def"] },
    actions: [spe, atk, focus, def, heal], // spe prioritaire visuellement
  });
}

export function createMage() {
  const atk = ActionRegistry.attack("Attaque", "Projectile magique.", 10, 0.70, 1, 0, []);
  atk.aiWeight = 0.25;

  const spe = ActionRegistry.attack(
    "Boule de feu",
    "15 dégâts (précision 80%) + brûlure 5",
    15, 0.80, 2, 0,
    [createEffect("Brûlure", "Perd 5 PV puis décroît", "DEG", "target", 5, 5)]
  );
  spe.aiWeight = 0.50;

  const focus = ActionRegistry.focus
    ? ActionRegistry.focus("Focus", "Augmente la précision temporairement.", 0.15, 3, 0.05, 1)
    : ActionRegistry.defend("Focus", "Placeholder focus.", { aiWeight: 0.20 });
  focus.aiWeight = 0.20;

  const def = ActionRegistry.defend("Défense", "Réduction dégâts prochaine attaque (voir moteur).", { aiWeight: 0.15, cooldown: 1 });

  const heal = ActionRegistry.heal(
    "Soin",
    "Soigne ~20% PV (≈ 24 PV) et retire les effets de dégâts.",
    24, 1.0, 2, 0, "ally",
    { aiWeight: 0.30, effects: [createClear("Purification", "Retire les effets de dégâts.", "ally", ["DEG"])] }
  );

  return new Character({
    id: "hero_mage",
    name: "Mage",
    maxHP: 120, maxMP: 0,
    atk: 10, def: 7, speed: 11,
    portrait: "/images/hero_mage.png",
    ai: { name: "mage_ai", features: ["weakest_pct"] },
    actions: [spe, atk, focus, def, heal],
  });
}

/** =========================
 * ALLIÉS (si non choisis comme héros) : on peut réutiliser les mêmes constructeurs
 * ========================= */

export function createAlliesFromSelection(selectedId) {
  const pool = {
    "hero_warrior": [createArcher(), createMage()],
    "hero_archer": [createWarrior(), createMage()],
    "hero_mage": [createWarrior(), createArcher()],
  };
  return pool[selectedId] ?? [];
}

/** =========================
 * ENNEMIS
 * ========================= */

export function createClassicEnemies() {
  // Loup solitaire : ATK / ATK SPE / FOCUS
  const loneWolf = new Character({
    id: "enemy_lone_wolf",
    name: "Loup solitaire",
    maxHP: 120, maxMP: 0, atk: 20, def: 8, speed: 10,
    portrait: "/images/enemy_lone_wolf.png",
    ai: { name: "wolf_ai", features: ["max_pv"] }, // cible en priorité le plus de PV total
    actions: [
      (() => { const a = ActionRegistry.attack("ATK", "Morsure légère.", 20, 0.60, 1, 0, []); a.aiWeight = 0.33; return a; })(),
      (() => { const a = ActionRegistry.attack("Morsure", "ATK SPE", 25, 0.65, 2, 0, []); a.aiWeight = 0.50; return a; })(),
      (() => {
        const a = ActionRegistry.focus
          ? ActionRegistry.focus("FOCUS", "Augmente précision.", 0.15, 3, 0.05, 1)
          : ActionRegistry.defend("FOCUS", "Placeholder focus.");
        a.aiWeight = 0.33; return a;
      })(),
    ],
  });

  // Sanglier : ATK / FOCUS / DEF
  const boar = new Character({
    id: "enemy_boar",
    name: "Sanglier",
    maxHP: 220, maxMP: 0, atk: 10, def: 12, speed: 8,
    portrait: "/images/enemy_boar.png",
    ai: { name: "boar_ai", features: ["max_pv"] },
    actions: [
      (() => { const a = ActionRegistry.attack("ATK", "Charge légère.", 10, 0.60, 1, 0, []); a.aiWeight = 0.33; return a; })(),
      (() => {
        const a = ActionRegistry.focus
          ? ActionRegistry.focus("FOCUS", "Augmente précision.", 0.15, 3, 0.05, 1)
          : ActionRegistry.defend("FOCUS", "Placeholder focus.");
        a.aiWeight = 0.33; return a;
      })(),
      (() => { const a = ActionRegistry.defend("DEF", "Se protège.", { aiWeight: 0.20, cooldown: 1 }); return a; })(),
    ],
  });

  return [loneWolf, boar];
}

export function createEliteEnemies() {
  // Meute de 3 loups (une seule entité)
  const wolfPack = new Character({
    id: "enemy_wolf_pack",
    name: "Meute de loups",
    maxHP: 220, maxMP: 0, atk: 40, def: 12, speed: 11,
    portrait: "/images/enemy_wolf_pack.png",
    ai: { name: "wolf_pack_ai", features: ["max_pv"] },
    actions: [
      (() => { const a = ActionRegistry.attack("ATK", "Multiples morsures.", 40, 0.60, 1, 0, []); a.aiWeight = 0.25; return a; })(),
      (() => { const a = ActionRegistry.attack("Morsure", "ATK SPE", 60, 0.65, 2, 0, []); a.aiWeight = 0.50; return a; })(),
      (() => {
        const a = ActionRegistry.focus
          ? ActionRegistry.focus("FOCUS", "Augmente précision.", 0.15, 3, 0.05, 1)
          : ActionRegistry.defend("FOCUS", "Placeholder focus.");
        a.aiWeight = 0.25; return a;
      })(),
      (() => { const a = ActionRegistry.defend("DEF", "Se protège.", { aiWeight: 0.20, cooldown: 1 }); return a; })(),
    ],
  });

  // Compagnie de 2 sangliers (une seule entité)
  const boarCompany = new Character({
    id: "enemy_boar_company",
    name: "Compagnie de sangliers",
    maxHP: 360, maxMP: 0, atk: 20, def: 14, speed: 9,
    portrait: "/images/enemy_boar_company.png",
    ai: { name: "boar_company_ai", features: ["max_pv"] },
    actions: [
      (() => { const a = ActionRegistry.attack("ATK", "Coudes, crocs.", 20, 0.60, 1, 0, []); a.aiWeight = 0.25; return a; })(),
      (() => { const a = ActionRegistry.attack("Charge", "ATK SPE", 35, 0.65, 2, 0, []); a.aiWeight = 0.33; return a; })(),
      (() => {
        const a = ActionRegistry.focus
          ? ActionRegistry.focus("FOCUS", "Augmente précision.", 0.15, 3, 0.05, 1)
          : ActionRegistry.defend("FOCUS", "Placeholder focus.");
        a.aiWeight = 0.25; return a;
      })(),
      (() => { const a = ActionRegistry.defend("DEF", "Se protège.", { aiWeight: 0.20, cooldown: 1 }); return a; })(),
    ],
  });

  return [wolfPack, boarCompany];
}

export function createBoss() {
  const pyrok = new Character({
    id: "enemy_pyrok",
    name: "Pyrok",
    maxHP: 500, maxMP: 0, atk: 35, def: 16, speed: 10,
    portrait: "/images/enemy_pyrok.png",
    ai: { name: "pyrok_ai", features: ["min_pv", "weakest_pct"] }, // cible le plus faible en PV restants
    actions: [
      (() => { const a = ActionRegistry.attack("ATK", "Coup de magma.", 35, 0.70, 1, 0, []); a.aiWeight = 0.20; return a; })(),
      (() => { const a = ActionRegistry.attack("Lave", "ATK SPE + brûlure 10", 50, 0.75, 2, 0, [createEffect("Brûlure", "DoT 10 décroissant", "DEG", "target", 10, 10)]); a.aiWeight = 0.50; return a; })(),
      (() => {
        const a = ActionRegistry.focus
          ? ActionRegistry.focus("FOCUS", "Augmente précision.", 0.15, 3, 0.05, 1)
          : ActionRegistry.defend("FOCUS", "Placeholder focus.");
        a.aiWeight = 0.20; return a;
      })(),
      (() => { const a = ActionRegistry.defend("DEF", "Se protège.", { aiWeight: 0.30, cooldown: 1 }); return a; })(),
      (() => {
        const a = ActionRegistry.heal(
          "HEAL",
          "Se soigne (20% ~ 100 PV approximés) et retire les effets de dégâts.",
          100, 1.0, 2, 0, "self",
          { aiWeight: 0.30, effects: [createClear("Autopurification", "Retire les effets de dégâts.", "self", ["DEG"])] }
        );
        return a;
      })(),
    ],
  });
  return pyrok;
}

/** Paquets d'ennemis utilitaires */

export function createEnemies() {
  return [
    ...createClassicEnemies(),
    ...createEliteEnemies(),
    createBoss(),
  ];
}
