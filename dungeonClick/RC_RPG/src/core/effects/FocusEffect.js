import BaseEffect from "./BaseEffect.js";

export default class FocusEffect extends BaseEffect {
  constructor({
    name = "Focus",
    description = "Augmente la précision.",
    applyTo = "self",
    duration = 1,
    amount = 0.1,
    aiWeight = 1,
  } = {}) {
    super({ name, description, applyTo, duration, aiWeight });
    this.type = "FOCUS";
    this.amount = amount;
  }
  onApply(_battle, target) { return `${target.name} se concentre (+${Math.round(this.amount * 100)}% précision, ${this.remaining} tour(s)).`; }
  modifyAccuracy(baseAcc) { return Math.min(1, baseAcc + this.amount); }
  is(t) { return t === "FOCUS"; }
}

