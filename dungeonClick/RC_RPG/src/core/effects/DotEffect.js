import BaseEffect from "./BaseEffect.js";

// DoT périodique : applique dégâts au début de chaque tour du porteur.
// Options supplémentaires possibles: decay (réduction linéaire de l'amount chaque tick, min 0)
export default class DotEffect extends BaseEffect {
  constructor(opts = {}) {
    super(opts);
    this.type = "DOT";
    this.amount = Number(opts.amount || 0);
    this.decay = Number(opts.decay || 0); // ex: 1 => diminue de 1 / tour
  }
  onApply(_battle, target) {
    return `${this.name} appliqué sur ${target.name} (${this.remaining}t).`;
  }
  onTurnStart(battle, target) {
    if (this.amount <= 0) return null;
    const final = battle.computeIncomingDamage(target, this.amount);
    target.takeDamage(final);
    const log = `${target.name} subit ${final} dégâts (${this.name}).`;
    // decay après application
    if (this.decay > 0) {
      this.amount = Math.max(0, this.amount - this.decay);
    }
    // décrément durée (tick) ici ou laisser Battle -> tick à fin de round? On conserve tick standard séparé
    return log;
  }
  is(t) { return t === "DOT" || t === "DEG"; }
}