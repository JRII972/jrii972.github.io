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
    // DEFEND
    defendFlat = null, // si null => DEF du lanceur ; sinon valeur numérique
    // HEAL
    healAmount = 0,
    target = "self", // "self" | "ally" | "enemy"
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

    this._remainingCD = 0;
  }

  canUse(user) {
    if (this._remainingCD > 0) return false;
    if (user.mp < this.costMP) return false;
    return true;
  }

  startCooldown() { this._remainingCD = this.cooldown; }
  tickCooldown() { if (this._remainingCD > 0) this._remainingCD -= 1; }
  get remainingCooldown() { return this._remainingCD; }

  _computeAccuracy(user, target, rng) {
    let acc = this.accuracy;

    // Bonus de Focus (consommé à l'usage)
    const accBonus = user.statuses?.get?.("acc_bonus") || 0;
    if (accBonus) {
      acc += accBonus;
      user.statuses.delete("acc_bonus");
    }

    // Override pour ennemi -> héros
    if (user.id === "enemy" && target?.id === "hero" && settings.enemyToHeroHitChanceOverride != null) {
      acc = settings.enemyToHeroHitChanceOverride;
    }

    acc = Math.max(0, Math.min(1, acc));
    return rng.chance(acc);
  }

  apply(user, initialTarget, context) {
    const { rng, battle } = context;
    if (!this.canUse(user)) return { type: "fail", log: `${this.name} impossible.` };

    // Paiement MP
    if (this.costMP > 0 && !user.spendMP(this.costMP)) {
      return { type: "fail", log: "MP insuffisants." };
    }

    // Cible utilisée par défaut : self/ally/enemy → ici simplifié self/target
    let target = initialTarget;
    if (this.target === "self") target = user;

    if (this.kind === "attack") {
      const hit = this._computeAccuracy(user, target, rng);
      if (!hit) {
        this.startCooldown();
        return { type: "miss", log: `${user.name} rate avec ${this.name}.` };
      }
      const dmg = Math.max(0, this.baseDamage);

      // Application des effets, avec choix de cible selon eff.applyTo
      for (const eff of this.effects) {
        const effTarget = eff.applyTo === "self" ? user : target;
        battle.applyEffect(eff, effTarget);
      }

      this.startCooldown();
      // NB: application réelle des dégâts (DEF, malus, etc.) faite dans Battle.resolve
      return { type: "damage", value: dmg, log: `${user.name} utilise ${this.name} et inflige ${dmg} dégâts.` };
    }

    if (this.kind === "defend") {
      const flat = (this.defendFlat == null) ? user.def : Number(this.defendFlat || 0);
      user.statuses.set("defend_flat", flat);
      for (const eff of this.effects) {
        const effTarget = eff.applyTo === "self" ? user : target;
        battle.applyEffect(eff, effTarget);
      }
      this.startCooldown();
      return { type: "status", log: `${user.name} se met en défense (réduction ${flat}).` };
    }

    if (this.kind === "heal") {
      // heal peut avoir accuracy < 1 si voulu
      let ok = true;
      if (this.accuracy < 1) ok = this._computeAccuracy(user, target, rng);
      if (!ok) {
        this.startCooldown();
        return { type: "miss", log: `${user.name} échoue à lancer ${this.name}.` };
      }
      const raw = Math.max(0, this.healAmount + rng.range(0, 2));
      for (const eff of this.effects) {
        const effTarget = eff.applyTo === "self" ? user : target;
        battle.applyEffect(eff, effTarget);
      }
      this.startCooldown();
      // NB: application réelle du heal (modifs MALUS_HEAL) faite dans Battle.resolve
      return { type: "heal", value: raw, log: `${user.name} utilise ${this.name} et soigne ${target.name} de ${raw} PV.` };
    }

    return { type: "noop", log: `${user.name} tente ${this.name}.` };
  }
}
