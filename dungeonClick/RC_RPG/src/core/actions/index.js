import Action from "./Action.js"; // fallback generic if needed
import AttackAction from "./AttackAction.js";
import HealAction from "./HealAction.js";
import DefendAction from "./DefendAction.js";
import StatusAction from "./StatusAction.js";
export { createEffect } from "../effects/Effect.js";
import { createFocus } from "../effects/index.js";

function normalizeName(name){
  return (name||"action").toString().toLowerCase().replace(/\s+/g, "_");
}

export const ActionRegistry = {
  attack(cfgOrName, description, baseDamage, accuracy, cooldown = 0, costMP = 0, effects = [], aiWeight){
    if (typeof cfgOrName === "object") {
      const cfg = cfgOrName;
  return new AttackAction({
        id: normalizeName(cfg.name),
        kind: "attack",
        target: cfg.target || "enemy",
        baseDamage: cfg.baseDamage ?? 0,
        accuracy: cfg.accuracy ?? 1,
        cooldown: cfg.cooldown ?? 0,
        costMP: cfg.costMP ?? 0,
        effects: cfg.effects || [],
        aiWeight: cfg.aiWeight ?? 1,
        name: cfg.name,
        description: cfg.description || "",
      });
    }
    // Legacy path
  return new AttackAction({
      id: normalizeName(cfgOrName),
      name: cfgOrName,
      description,
      kind: "attack",
      baseDamage,
      accuracy,
      cooldown,
      costMP,
      effects,
      target: "enemy",
      aiWeight
    });
  },
  defend(cfgOrName, description, defendFlat = null, cooldown = 1, effects = [], aiWeight){
    if (typeof cfgOrName === "object") {
      const cfg = cfgOrName;
  return new DefendAction({
        id: normalizeName(cfg.name),
        kind: "defend",
        name: cfg.name,
        description: cfg.description || "",
        defendFlat: cfg.defendFlat ?? null,
        cooldown: cfg.cooldown ?? 1,
        effects: cfg.effects || [],
        aiWeight: cfg.aiWeight ?? 1,
      });
    }
  return new DefendAction({
      id: normalizeName(cfgOrName),
      name: cfgOrName,
      description,
      kind: "defend",
      defendFlat,
      cooldown,
      effects,
      aiWeight
    });
  },
  heal(cfgOrName, description, healAmount, accuracy = 1, cooldown = 0, costMP = 0, target = "self", effects = [], aiWeight){
    if (typeof cfgOrName === "object") {
      const cfg = cfgOrName;
  return new HealAction({
        id: normalizeName(cfg.name),
        kind: "heal",
        name: cfg.name,
        description: cfg.description || "",
        healAmount: cfg.healAmount ?? 0,
        accuracy: cfg.accuracy ?? 1,
        cooldown: cfg.cooldown ?? 0,
        costMP: cfg.costMP ?? 0,
        target: cfg.target || "self",
        effects: cfg.effects || [],
        aiWeight: cfg.aiWeight ?? 1,
      });
    }
  return new HealAction({
      id: normalizeName(cfgOrName),
      name: cfgOrName,
      description,
      kind: "heal",
      healAmount,
      accuracy,
      cooldown,
      costMP,
      target,
      effects,
      aiWeight
    });
  },
  focus(cfgOrName, description, amount = 0.15, duration = 1, accuracy = 1, cooldown = 3, aiWeight){
    if (typeof cfgOrName === "object") {
      const cfg = cfgOrName;
  return new StatusAction({
        id: normalizeName(cfg.name),
        kind: "status",
        name: cfg.name,
        description: cfg.description || "",
        cooldown: cfg.cooldown ?? 3,
        accuracy: 1,
        target: "self",
        effects: [ createFocus(cfg.name, cfg.description, cfg.duration ?? 1, cfg.amount ?? 0.15, cfg.aiWeight ?? 1) ],
        aiWeight: cfg.aiWeight ?? 1,
      });
    }
  return new StatusAction({
      id: normalizeName(cfgOrName),
      name: cfgOrName,
      description: description || "",
      kind: "status",
      cooldown,
      accuracy,
      target: "self",
      effects: [ createFocus(cfgOrName, description, duration, amount, aiWeight ?? 1) ],
      aiWeight: aiWeight ?? 1,
    });
  }
};

