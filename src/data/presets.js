import Character from "../core/entities/Character.js";
import { ActionRegistry, createEffect } from "../core/actions/index.js";

const stunEffect = createEffect("Stun", "Ne peut pas agir", "STUN", "target", 2, 2);
export function createHero() {
  return new Character({
    id: "hero",
    name: "Héros",
    maxHP: 100,
    maxMP: 40,
    atk: 18,
    def: 10,
    speed: 10,
    actions: [
      // Attaque de base (pas d'effets)
      ActionRegistry.attack(
        "Coup d'épée",
        "Attaque physique standard.",
        12,    // baseDamage
        0.90   // accuracy
      ),

      // Étourdissement sur la cible pendant 1 tour
      ActionRegistry.attack(
        "Coup étourdissant",
        "Étourdît la cible pendant 1 tour.",
        8,       // dmg
        1,    // acc
        2,       // cooldown
        0,
        [stunEffect]
      ),

      // Malus de DEF sur la cible (+4 dégâts reçus) pendant 2 tours
      ActionRegistry.attack(
        "Brise-armure",
        "La cible prend +4 dégâts supplémentaires (2 tours).",
        10,
        0.60,
        3, 
        0,
        [createEffect("Brise-Armure", "Dégâts subis +4", "MALUS_DEF", "target", 2, 4)]
      ),

      // Défense : réduction plate = DEF du lanceur pour la prochaine attaque subie
      ActionRegistry.defend(
        "Garde",
        "Réduit la prochaine attaque subie d’un montant égal à votre DEF."
      ),

      // Soin auto (réussite garantie), coûte 12 MP, cooldown 2
      ActionRegistry.heal(
        "Soin",
        "Restaure des PV au lanceur.",
        22,   // heal
        1,    // accuracy
        2,    // cooldown
        12,   // MP
        "self"
      ),
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
    actions: [
      ActionRegistry.attack("Griffe", "Attaque de base du gobelin.", 10, 0.85),

      ActionRegistry.defend("Parade", "Se met en défense."),

      // Soin perso sans MP, cooldown 3
      ActionRegistry.heal("Léchage de plaies", "Récupère un peu de PV.", 12, 0.9, 3, 0, "self"),

      // Exemple d'effet DEG immédiat : brûlure de 6 sur la cible
      ActionRegistry.attack(
        "Brûlure",
        "Inflige des dégâts immédiats supplémentaires.",
        7,
        0.8,
        2,
        0,
        [createEffect("Brûlure", "Dégâts immédiats", "DEG", "target", 1, 6)]
      ),

      // Exemple MALUS_HEAL : la cible reçoit -50% des soins pdt 2 tours
      ActionRegistry.attack(
        "Poison affaiblissant",
        "Réduit les soins reçus par la cible.",
        6,
        0.8,
        3,
        0,
        [createEffect("Affaiblissement", "Soins reçus -50%", "MALUS_HEAL", "target", 2, 0.5)]
      ),
    ],
  });
}
