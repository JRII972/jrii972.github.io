import Action from "./Action.js";
export { createEffect } from "../effects/Effect.js";


export const ActionRegistry = {
  attack(name, description, baseDamage, accuracy, cooldown = 0, costMP = 0, effects = []) {
    return new Action({
      id: name.toLowerCase().replace(/\s+/g, "_"),
      name,
      description,
      kind: "attack",
      baseDamage,
      accuracy,
      cooldown,
      costMP,
      effects,
      target : "enemy"
    });
  },

  defend(name, description, defendFlat = null, cooldown = 1, effects = []) {
    return new Action({
      id: name.toLowerCase().replace(/\s+/g, "_"),
      name,
      description,
      kind: "defend",
      defendFlat,
      cooldown,
      effects,
    });
  },

  heal(name, description, healAmount, accuracy = 1, cooldown = 0, costMP = 0, target = "self", effects = []) {
    return new Action({
      id: name.toLowerCase().replace(/\s+/g, "_"),
      name,
      description,
      kind: "heal",
      healAmount,
      accuracy,
      cooldown,
      costMP,
      target,
      effects,
    });
  },
};
