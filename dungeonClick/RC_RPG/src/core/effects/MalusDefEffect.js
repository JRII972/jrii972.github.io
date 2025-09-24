import BaseEffect from "./BaseEffect.js";

export default class MalusDefEffect extends BaseEffect {
  constructor(opts = {}) { super(opts); this.type = "MALUS_DEF"; this.amount = Number(opts.amount || 0); }
  modifyIncomingDamage(value) { return Math.max(0, value + this.amount); }
  onApply() { return `${this.name}: +${this.amount} dégâts subis (${this.remaining} tour(s)).`; }
  is(t) { return t === "MALUS_DEF"; }
}
