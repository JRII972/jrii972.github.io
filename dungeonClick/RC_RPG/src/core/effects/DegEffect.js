import BaseEffect from "./BaseEffect.js";

export default class DegEffect extends BaseEffect {
  constructor(opts = {}) { super(opts); this.type = "DEG"; this.amount = Number(opts.amount || 0); }
  onApply(battle, target) {
    if (this.amount > 0) {
      const final = battle.computeIncomingDamage(target, this.amount);
      target.takeDamage(final);
      return `${target.name} subit ${final} dégâts (${this.name}).`;
    }
    return `${this.name} appliqué.`;
  }
  is(t) { return t === "DEG"; }
}
