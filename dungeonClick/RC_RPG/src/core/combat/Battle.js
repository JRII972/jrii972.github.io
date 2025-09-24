export default class Battle {
  constructor({ hero, enemies = [], allies = [], rng, cooldowns, eventBus }) {
    this.hero = hero;
    this.enemies = enemies;   // ➕ liste d’ennemis
    this.allies = allies;
    this.rng = rng;
    this.cooldowns = cooldowns;
    this.eventBus = eventBus;
  }

  // Ciblage par défaut
  defaultTargetFor(action, user) {
    if (action.kind === "attack") {
      if (user.id.startsWith("enemy")) return this.hero;
      return this.enemies.find(e => e.alive) || null;
    }
    if (action.kind === "defend") return user;
    if (action.kind === "heal") {
      if (action.target === "ally") return this.hero;
      if (action.target === "self") return user;
      if (action.target === "enemy") return this.enemies.find(e => e.alive) || null;
      return this.hero;
    }
    return this.enemies.find(e => e.alive) || null;
  }

  allAllies() {
    return [this.hero, ...(this.allies ?? [])].filter(a => a?.alive);
  }
  allEnemies() {
    return (this.enemies ?? []).filter(e => e?.alive);
  }

  resolve(action, user, target = null) {
    if (this.hasStun(user)) {
      this.eventBus?.emit("log", `${user.name} est étourdi et ne peut pas agir !`);
      this.eventBus?.emit("state:update");
      return { type: "stunned" };
    }

    if (!action.canUse(user, { battle: this })) {
      this.eventBus?.emit("log", `${user.name} ne peut pas utiliser ${action.name}`);
      return { type: "invalid" };
    }

    const isAllAllies = action.targetsAllAllies && action.target === "ally";
    const targets = isAllAllies ? this.allAllies() : [ (target ?? this.defaultTargetFor(action, user)) ];

    let first = true;
    for (const tgt of targets) {
      const res = action.apply(user, tgt, {
        rng: this.rng,
        battle: this,
        flags: first ? {} : { noCost: true, noCooldown: true },
      });
      this._applyOutcome(user, tgt, action, res);
      first = false;
    }

    this.eventBus?.emit("state:update");
    return { type: "ok" };
  }

  _applyOutcome(user, target, action, res) {
    if (!res) return;

    if (res.type === "damage") {
      const finalDmg = this.computeIncomingDamage(target, res.value);
      target.takeDamage(finalDmg);
      this.eventBus?.emit("log", res.log ?? `${user.name} inflige ${finalDmg} à ${target.name}.`);
      return;
    }

    if (res.type === "heal") {
      const finalHeal = this.computeHealReceived(target, res.value);
      target.heal(finalHeal);
      this.eventBus?.emit("log", res.log ?? `${user.name} soigne ${target.name} de ${finalHeal}.`);
      return;
    }

    if (res.log) this.eventBus?.emit("log", res.log);
  }

  isOver() {
    return !this.hero.alive || this.allEnemies().length === 0;
  }
}
