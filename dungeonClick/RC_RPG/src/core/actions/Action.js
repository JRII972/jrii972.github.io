import settings from "../../config/settings.js";

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
  canUse(user, { battle }) {
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

    acc = Math.max(0, Math.min(1, acc));
    return rng.chance(acc);
  }

  /**
   * apply(user, target, { rng, battle, flags })
   * flags: { noCost?: boolean, noCooldown?: boolean }
   * Retour: { type: "damage"|"heal"|"status"|"miss"|"fail"|"noop", value?, log }
   */
  apply(user, initialTarget, context = {}) {
    const { rng, battle, flags = {} } = context;
    if (!this.canUse(user, { battle })) return { type: "fail", log: `${this.name} impossible.` };

    // MP
    if (!flags.noCost && this.costMP > 0 && !user.spendMP(this.costMP)) {
      return { type: "fail", log: "MP insuffisants." };
    }

    // Cible self/ally/enemy (défaut local ; le moteur peut aussi recadrer)
    let target = initialTarget;
    if (this.target === "self") target = user;

    if (this.kind === "attack") {
      const hit = this._computeAccuracy(user, target, rng);
      if (!hit) {
        if (!flags.noCooldown) this.startCooldown();
        return { type: "miss", log: `${user.name} rate avec ${this.name}.` };
      }
      const dmg = Math.max(0, this.baseDamage);

      for (const eff of this.effects) {
        const effTarget = eff.applyTo === "self" ? user : target;
        battle.applyEffect(eff, effTarget);
      }

      if (!flags.noCooldown) this.startCooldown();
      return { type: "damage", value: dmg, log: `${user.name} utilise ${this.name} et inflige ${dmg} dégâts à ${target?.name ?? "la cible"}.` };
    }

    if (this.kind === "defend") {
      const flat = (this.defendFlat == null) ? user.def : Number(this.defendFlat || 0);
      user.statuses.set("defend_flat", flat);
      for (const eff of this.effects) {
        const effTarget = eff.applyTo === "self" ? user : target;
        battle.applyEffect(eff, effTarget);
      }
      if (!flags.noCooldown) this.startCooldown();
      return { type: "status", log: `${user.name} se met en défense (réduction ${flat}).` };
    }

    if (this.kind === "heal") {
      if (!this._computeAccuracy(user, target, rng)) {
        if (!flags.noCooldown) this.startCooldown();
        return { type: "miss", log: `${user.name} échoue à lancer ${this.name}.` };
      }
      const raw = Math.max(0, this.healAmount + rng.range(0, 2));
      for (const eff of this.effects) {
        const effTarget = eff.applyTo === "self" ? user : target;
        battle.applyEffect(eff, effTarget);
      }
      if (!flags.noCooldown) this.startCooldown();
      return { type: "heal", value: raw, log: `${user.name} utilise ${this.name} sur ${target?.name ?? "l'allié"} et rend ${raw} PV.` };
    }

    if (!flags.noCooldown) this.startCooldown();
    return { type: "noop", log: `${user.name} tente ${this.name}.` };
  }
}
