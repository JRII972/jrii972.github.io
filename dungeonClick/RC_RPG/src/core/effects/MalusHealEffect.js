import BaseEffect from "./BaseEffect.js";

export default class MalusHealEffect extends BaseEffect {
  constructor(opts = {}) { super(opts); this.type = "MALUS_HEAL"; this.amount = Math.max(0, Math.min(1, Number(opts.amount || 0))); }
  modifyHealReceived(value) { return Math.floor(value * Math.max(0, 1 - this.amount)); }
  onApply() { return `${this.name}: soins -${Math.round(this.amount * 100)}% (${this.remaining} tour(s)).`; }
  is(t) { return t === "MALUS_HEAL"; }
}
