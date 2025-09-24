import BaseEffect from "./BaseEffect.js";

export default class StunEffect extends BaseEffect {
  constructor(opts = {}) { super(opts); this.type = "STUN"; }
  blocksAction() { return true; }
  onApply() { return `${this.name}: étourdi ${this.remaining} tour(s).`; }
  is(t) { return t === "STUN"; }
}
