import Character from "../core/entities/Character.js";
import { ActionRegistry, createEffect } from "../core/actions/index.js";

export function createHero() {
  return new Character({
    id: "hero",
    name: "Héros",
    maxHP: 100,
    maxMP: 40,
    atk: 18,
    def: 10,
    speed: 10,
    portrait: "/img/character/chevalier.png",
    ai: { name: "balanced", features: ["weakest_pct", "no_def"] }, // utilisé si jamais auto
    actions: [
      ActionRegistry.attack("Coup d'épée", "Attaque physique standard.", 12, 0.90),
      ActionRegistry.attack("Coup étourdissant", "Étourdît 1 tour.", 8, 0.80, 1, 5,
        [createEffect("Stun", "Ne peut pas agir", "STUN", "target", 1, 0)]
      ),
      ActionRegistry.attack("Brise-armure", "Dégâts subis +4 (2 tours).", 10, 0.85, 2, 8,
        [createEffect("Brise-Armure", "Dégâts subis +4", "MALUS_DEF", "target", 2, 4)]
      ),
      ActionRegistry.defend("Garde", "Réduction égale à DEF."),
      ActionRegistry.heal("Soin", "Restaure des PV au lanceur.", 22, 1, 2, 12, "self"),
    ],
  });
}

export function createEnemies() {
  const goblin = new Character({
    id: "enemy_goblin",
    name: "Gobelin",
    maxHP: 110, maxMP: 0, atk: 16, def: 10, speed: 8,
    portrait: "/img/character/goblin.png",
    ai: { name: "harass", features: ["min_pv", "no_def"] },
    actions: [
      ActionRegistry.attack("Griffe", "Attaque de base.", 10, 0.85),
      ActionRegistry.defend("Parade", "Se met en défense."),
      ActionRegistry.heal("Léchage de plaies", "Récupère des PV.", 12, 0.9, 3, 0, "self"),
    ],
  });

  const orc = new Character({
    id: "enemy_orc",
    name: "Orc",
    maxHP: 140, maxMP: 0, atk: 22, def: 12, speed: 7,
    portrait: "/img/character/orc.png",
    ai: { name: "brute", features: ["random"] },
    actions: [
      ActionRegistry.attack("Coup de masse", "Frappe lourde.", 15, 0.75),
      ActionRegistry.attack("Hurlement", "Étourdît 1 tour.", 0, 0.8, 2, 0,
        [createEffect("Stun", "Ne peut pas agir", "STUN", "target", 1, 0)]
      ),
    ],
  });

  return [goblin, orc];
}

export function createAllies() {
  const priest = new Character({
    id: "ally_priest",
    name: "Prêtresse",
    maxHP: 70, maxMP: 60, atk: 8, def: 6, speed: 9,
    portrait: "/img/character/pretresse.png",
    ai: { name: "support", features: ["min_pv", "weakest_pct"] }, // soigne la cible la plus fragile
    actions: [
      
      ActionRegistry.attack("Coup d'épée", "Attaque physique standard.", 12, 0.90),
      ActionRegistry.heal("Soin mineur", "Soin léger à un allié.", 16, 1, 0, 6, "ally"),
      ActionRegistry.heal("Chant de groupe", "Soigne tous les alliés.", 12, 1, 3, 10, "ally", { targetsAllAllies: true }),
    ],
  });

  const archer = new Character({
    id: "ally_archer",
    name: "Archer",
    maxHP: 80, maxMP: 20, atk: 14, def: 8, speed: 11,
    portrait: "/img/character/archère.png",
    ai: { name: "finisher", features: ["min_pv", "no_def", "weakest_pct"] },
    actions: [
      ActionRegistry.attack("Flèche", "Attaque à distance.", 10, 0.9),
    ],
  });

  return [priest, archer];
}
