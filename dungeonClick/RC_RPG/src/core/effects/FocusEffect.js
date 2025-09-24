export default class FocusEffect {
  constructor({
    name = "Focus",
    description = "Augmente la précision.",
    applyTo = "self",
    duration = 1,
    amount = 0.1, // +10% par défaut
  } = {}) {
    this.name = name;
    this.description = description;
    this.type = "FOCUS";
    this.applyTo = applyTo;
    this.remaining = duration;
    this.amount = amount;
  }

  onApply(battle, target) {
    return `${target.name} se concentre (+${Math.round(this.amount * 100)}% précision, ${this.remaining} tour(s)).`;
  }

  tick() {
    this.remaining -= 1;
    return this.remaining > 0;
  }

  blocksAction() { return false; }

  /** Bonus de précision appliqué aux attaques */
  modifyAccuracy(baseAcc /*, action, user */) {
    return Math.min(1, baseAcc + this.amount);
  }
}
