import settings from "../../config/settings.js";
import logs from "../state/LogManager.js";

/**
 * Action générique data-driven.
 * kind: "attack" | "defend" | "heal"
 */
export default class Action {
  constructor({
    id,
    name,
    description = "",
    kind = "attack",
    baseDamage = 0,
    accuracy = 1,
    cooldown = 0,
    costMP = 0,
    effects = [],
    defendFlat = null,
    healAmount = 0,
    target = "self",
    targetsAllAllies = false,
    aiWeight = 1,
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.kind = kind;

    this.baseDamage = baseDamage;
    this.accuracy = accuracy;
    this.cooldown = cooldown;
    this.costMP = costMP;
    this.effects = effects;

    this.defendFlat = defendFlat;
    this.healAmount = healAmount;
    this.target = target;
    this.targetsAllAllies = targetsAllAllies;

    this._remainingCD = 0;

    this.aiWeight = Math.max(0, Math.min(1, aiWeight));
  }
  canUse(user) {
    if (!user) return false;
    if (this._remainingCD > 0) return false;
    if ((user.mp ?? 0) < this.costMP) return false;
    return true;
  }

  startCooldown() { this._remainingCD = this.cooldown; }
  tickCooldown() { if (this._remainingCD > 0) this._remainingCD -= 1; }
  get remainingCooldown() { return this._remainingCD; }

  _computeAccuracy(user, target, rng) {
    let acc = this.accuracy;

    // Bonus de Focus ponctuel
    const accBonus = user.statuses?.get?.("acc_bonus") || 0;
    if (accBonus) {
      acc += accBonus;
      user.statuses.delete("acc_bonus");
    }

    // Forçage IA ennemi -> héros
    if (user.id === "enemy" && target?.id === "hero" && settings.enemyToHeroHitChanceOverride != null) {
      acc = settings.enemyToHeroHitChanceOverride;
    }

    // Effets actifs sur l'utilisateur pouvant modifier la précision
    if (user?.activeEffects) {
      for (const eff of user.activeEffects) {
        if (eff.remaining > 0 && typeof eff.modifyAccuracy === "function") {
          acc = eff.modifyAccuracy(acc, this, user);
        }
      }
    }

    acc = Math.max(0, Math.min(1, acc));
    return rng.chance(acc);
  }

  applyEffects(user, target, battle){
    if (!this.effects || this.effects.length === 0) return;
    for (const eff of this.effects){
      const effTarget = eff.applyTo === 'self' ? user : target;
      if (!effTarget) continue;
      if (!effTarget.activeEffects) effTarget.activeEffects = [];
      effTarget.activeEffects.push(eff);
      const log = eff.onApply?.(battle, effTarget);
      if (log) logs.log(log);
    }
  }
}
