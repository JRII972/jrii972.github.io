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
    actions: [
      ActionRegistry.attack("Coup d'épée", "Attaque physique standard.", 12, 0.90),
      ActionRegistry.attack(
        "Coup étourdissant",
        "Étourdît la cible pendant 1 tour.",
        8, 0.80, 1, 5,
        [createEffect("Stun", "Ne peut pas agir", "STUN", "target", 1, 0)]
      ),
      ActionRegistry.attack(
        "Brise-armure",
        "La cible prend +4 dégâts supplémentaires (2 tours).",
        10, 0.85, 2, 8,
        [createEffect("Brise-Armure", "Dégâts subis +4", "MALUS_DEF", "target", 2, 4)]
      ),
      ActionRegistry.defend("Garde", "Réduit la prochaine attaque subie d’un montant égal à votre DEF.", 20),
      ActionRegistry.heal("Soin", "Restaure des PV au lanceur.", 22, 1, 2, 12, "self"),
    ],
  });
}

export function createEnemy() {
  return new Character({
    id: "enemy",
    name: "Gobelin",
    maxHP: 110,
    maxMP: 0,
    atk: 16,
    def: 10,
    speed: 8,
    portrait: "/img/character/goblin.png", 
    actions: [
      ActionRegistry.attack("Griffe", "Attaque de base du gobelin.", 10, 0.85),
      ActionRegistry.defend("Parade", "Se met en défense."),
      ActionRegistry.heal("Léchage de plaies", "Récupère un peu de PV.", 12, 0.9, 3, 0, "self"),
      ActionRegistry.attack(
        "Brûlure",
        "Inflige des dégâts immédiats supplémentaires.",
        7, 0.8, 2, 0,
        [createEffect("Brûlure", "Dégâts immédiats", "DEG", "target", 1, 6)]
      ),
      ActionRegistry.attack(
        "Poison affaiblissant",
        "Réduit les soins reçus par la cible.",
        6, 0.8, 3, 0,
        [createEffect("Affaiblissement", "Soins reçus -50%", "MALUS_HEAL", "target", 2, 0.5)]
      ),
    ],
  });
}
