import BaseEffect from "./BaseEffect.js";

export default class CompositeEffect extends BaseEffect {
  constructor(effects = [], opts = {}) { super({ name: "Composite", description: "Effets combinés", duration: 1, ...opts }); this.effects = effects; }
  onApply(battle, target) { return this.effects.map(e => e.onApply(battle, target)).filter(Boolean).join(" "); }
  modifyIncomingDamage(v, b, t) { return this.effects.reduce((acc, e) => e.modifyIncomingDamage(acc, b, t), v); }
  modifyHealReceived(v, b, t) { return this.effects.reduce((acc, e) => e.modifyHealReceived(acc, b, t), v); }
  modifyAccuracy(acc, action, user) { return this.effects.reduce((a, e) => e.modifyAccuracy ? e.modifyAccuracy(a, action, user) : a, acc); }
  blocksAction() { return this.effects.some(e => e.blocksAction && e.blocksAction()); }
  tick() { this.effects = this.effects.filter(e => e.tick()); return this.effects.length > 0; }
  is(t) { return this.effects.some(e => e.is && e.is(t)); }
}
