import Character from "../core/entities/Character.js";
import { ActionRegistry, createEffect } from "../core/actions/index.js";
import { createClear } from "../core/effects/index.js";

/** =========================
 * FACTORIES D'EFFETS (toujours retourner une nouvelle instance pour éviter état partagé)
 * ========================= */
export const FX = {
  stun1: () => createEffect("Gel", "La cible est gelée 1 tour.", "STUN", "target", 1, 0, { iconText: "❄" }),
  // Utilise l'image dédiée pour l'icône du poison
  poison5: () => createEffect("Poison", "Perd 5 PV par tour jusqu'au soin.", "DOT", "target", 99, 5, { icon: "/img/icon/poison.png" }),
  burn5: () => createEffect("Brûlure", "Perd 5 PV puis décroît", "DOT", "target", 5, 5, { decay: 1, iconText: "🔥" }),
  burn10: () => createEffect("Brûlure", "DoT 10 décroissant", "DOT", "target", 10, 10, { decay: 2, iconText: "🔥" }),
  clearAlly: () => createClear("Purification", "Retire les effets de dégâts.", "ally", ["DOT"]),
  clearSelf: () => createClear("Autopurification", "Retire les effets de dégâts.", "self", ["DOT"]),
};

/** =========================
 * HÉROS JOUEUR
 * ========================= */

export function createWarrior() {
  return new Character({
    id: "hero_warrior",
    name: "Guerrier",
    maxHP: 200, maxMP: 0, atk: 10, def: 10, speed: 10,
    portrait: "/img/character/chevalier.png",
    ai: { name: "warrior_ai", features: ["max_pv", "no_def"] },
    actions : [
      ActionRegistry.attack({ name: "Attaque", description: "Coup standard.", baseDamage: 10, accuracy: 0.50, cooldown: 1, aiWeight: 0.25 }),
      ActionRegistry.attack({ name: "Coup d’épée", description: "Attaque spéciale + Gel (stun 1 tour).", baseDamage: 15, accuracy: 0.60, cooldown: 2, effects: [FX.stun1()], aiWeight: 0.30 }),
      ActionRegistry.focus({ name: "Focus", description: "Augmente la précision temporairement.", amount: 0.15, duration: 1, cooldown: 3, aiWeight: 0.20 }),
      ActionRegistry.defend({ name: "Défense", description: "Réduit la prochaine attaque de 15 puis 5 de moins pendant 3 tours (approx).", defendFlat: 15, cooldown: 1, aiWeight: 0.20 }),
      ActionRegistry.heal({ name: "Soin", description: "Soigne ~10% PV (≈ 20 PV) et retire les effets de dégâts.", healAmount: 20, accuracy: 1.0, cooldown: 2, target: "self", effects: [FX.clearSelf()], aiWeight: 0.20 })
    ],
  });
}

export function createArcher() {
  const actions = [
    ActionRegistry.attack({ name: "Flèche empoisonnée", description: "20 dégâts + poison 5 (type DOT).", baseDamage: 20, accuracy: 0.60, cooldown: 2, effects: [FX.poison5()], aiWeight: 0.50 }),
    ActionRegistry.attack({ name: "Attaque", description: "Tir standard.", baseDamage: 15, accuracy: 0.60, cooldown: 1, aiWeight: 0.25 }),
    ActionRegistry.focus({ name: "Focus", description: "Augmente la précision temporairement.", amount: 0.15, duration: 1, cooldown: 3, aiWeight: 0.20 }),
    ActionRegistry.defend({ name: "Défense", description: "Réduction dégâts prochaine attaque.", defendFlat: 10, cooldown: 1, aiWeight: 0.15 }),
    ActionRegistry.heal({ name: "Soin", description: "Soigne ~10% PV (≈ 10 PV) et retire les effets de dégâts.", healAmount: 10, accuracy: 1.0, cooldown: 2, target: "ally", effects: [FX.clearAlly()], aiWeight: 0.20 }),
  ];
  return new Character({
    id: "hero_archer",
    name: "Archer",
    maxHP: 100, maxMP: 0, atk: 15, def: 8, speed: 12,
    portrait: "/img/character/archère.png",
    ai: { name: "archer_ai", features: ["weakest_pct", "no_def"] },
    actions,
  });
}

export function createMage() {
  const actions = [
    ActionRegistry.attack({ name: "Boule de feu", description: "15 dégâts (précision 80%) + brûlure 5", baseDamage: 15, accuracy: 0.80, cooldown: 2, effects: [FX.burn5()], aiWeight: 0.50 }),
    ActionRegistry.attack({ name: "Attaque", description: "Projectile magique.", baseDamage: 10, accuracy: 0.70, cooldown: 1, aiWeight: 0.25 }),
    ActionRegistry.focus({ name: "Focus", description: "Augmente la précision temporairement.", amount: 0.15, duration: 1, cooldown: 3, aiWeight: 0.20 }),
    ActionRegistry.defend({ name: "Défense", description: "Réduction dégâts prochaine attaque.", defendFlat: 12, cooldown: 1, aiWeight: 0.15 }),
    ActionRegistry.heal({ name: "Soin", description: "Soigne ~20% PV (≈ 24 PV) et retire les effets de dégâts.", healAmount: 24, accuracy: 1.0, cooldown: 2, target: "ally", effects: [FX.clearAlly()], aiWeight: 0.30 }),
  ];
  return new Character({
    id: "hero_mage",
    name: "Mage",
    maxHP: 120, maxMP: 0, atk: 10, def: 7, speed: 11,
    portrait: "/img/character/pretresse.png",
    ai: { name: "mage_ai", features: ["weakest_pct"] },
    actions,
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
  portrait: "/img/character/goblin.png", // TODO: image dédiée loup à ajouter
    ai: { name: "wolf_ai", features: ["random"] }, // cible en priorité le plus de PV total
    actions: [
      ActionRegistry.attack({ name: "ATK", description: "Morsure légère.", baseDamage: 20, accuracy: 1, cooldown: 1, aiWeight: 0.33 }),
      ActionRegistry.attack({ name: "Morsure", description: "ATK SPE", baseDamage: 25, accuracy: 1, cooldown: 2, aiWeight: 0.50 }),
      ActionRegistry.focus({ name: "FOCUS", description: "Augmente précision.", amount: 0.15, duration: 1, cooldown: 3, aiWeight: 0.33 }),
    ],
  });

  // Sanglier : ATK / FOCUS / DEF
  const boar = new Character({
    id: "enemy_boar",
    name: "Sanglier",
    maxHP: 220, maxMP: 0, atk: 10, def: 12, speed: 8,
  portrait: "/img/character/orc.png", // TODO: image sanglier à ajouter
    ai: { name: "boar_ai", features: ["max_pv"] },
    actions: [
      ActionRegistry.focus({ name: "FOCUS", description: "Augmente précision.", amount: 0.15, duration: 2, cooldown: 3, aiWeight: 1 }),
      // ActionRegistry.attack({ name: "ATK", description: "Charge légère.", baseDamage: 10, accuracy: 0.60, cooldown: 1, aiWeight: 0.33 }),
      // ActionRegistry.defend({ name: "DEF", description: "Se protège.", defendFlat: 12, cooldown: 1, aiWeight: 0.20 }),
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
  portrait: "/img/character/goblin.png", // placeholder meute
    ai: { name: "wolf_pack_ai", features: ["max_pv"] },
    actions: [
      ActionRegistry.attack({ name: "ATK", description: "Multiples morsures.", baseDamage: 40, accuracy: 0.60, cooldown: 1, aiWeight: 0.25 }),
      ActionRegistry.attack({ name: "Morsure", description: "ATK SPE", baseDamage: 60, accuracy: 0.65, cooldown: 2, aiWeight: 0.50 }),
      ActionRegistry.focus({ name: "FOCUS", description: "Augmente précision.", amount: 0.15, duration: 1, cooldown: 3, aiWeight: 0.25 }),
      ActionRegistry.defend({ name: "DEF", description: "Se protège.", defendFlat: 12, cooldown: 1, aiWeight: 0.20 }),
    ],
  });

  // Compagnie de 2 sangliers (une seule entité)
  const boarCompany = new Character({
    id: "enemy_boar_company",
    name: "Compagnie de sangliers",
    maxHP: 360, maxMP: 0, atk: 20, def: 14, speed: 9,
  portrait: "/img/character/orc.png", // placeholder compagnie
    ai: { name: "boar_company_ai", features: ["max_pv"] },
    actions: [
      ActionRegistry.attack({ name: "ATK", description: "Coudes, crocs.", baseDamage: 20, accuracy: 0.60, cooldown: 1, aiWeight: 0.25 }),
      ActionRegistry.attack({ name: "Charge", description: "ATK SPE", baseDamage: 35, accuracy: 0.65, cooldown: 2, aiWeight: 0.33 }),
      ActionRegistry.focus({ name: "FOCUS", description: "Augmente précision.", amount: 0.15, duration: 1, cooldown: 3, aiWeight: 0.25 }),
      ActionRegistry.defend({ name: "DEF", description: "Se protège.", defendFlat: 14, cooldown: 1, aiWeight: 0.20 }),
    ],
  });

  return [wolfPack, boarCompany];
}

export function createBoss() {
  const pyrok = new Character({
    id: "enemy_pyrok",
    name: "Pyrok",
    maxHP: 500, maxMP: 0, atk: 35, def: 16, speed: 10,
  portrait: "/img/character/orc.png", // placeholder Pyrok
    ai: { name: "pyrok_ai", features: ["min_pv", "weakest_pct"] }, // cible le plus faible en PV restants
    actions: [
      ActionRegistry.attack({ name: "ATK", description: "Coup de magma.", baseDamage: 35, accuracy: 0.70, cooldown: 1, aiWeight: 0.20 }),
      ActionRegistry.attack({ name: "Lave", description: "ATK SPE + brûlure 10", baseDamage: 50, accuracy: 0.75, cooldown: 2, effects: [createEffect("Brûlure", "DoT 10 décroissant", "DOT", "target", 10, 10)], aiWeight: 0.50 }),
      ActionRegistry.focus({ name: "FOCUS", description: "Augmente précision.", amount: 0.15, duration: 1, cooldown: 3, aiWeight: 0.20 }),
      ActionRegistry.defend({ name: "DEF", description: "Se protège.", defendFlat: 16, cooldown: 1, aiWeight: 0.30 }),
      ActionRegistry.heal({ name: "HEAL", description: "Se soigne (20% ~ 100 PV approximés) et retire les effets de dégâts.", healAmount: 100, accuracy: 1.0, cooldown: 2, target: "self", effects: [createClear("Autopurification", "Retire les effets de dégâts.", "self", ["DOT"])], aiWeight: 0.30 }),
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
