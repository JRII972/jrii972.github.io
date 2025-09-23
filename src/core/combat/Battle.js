export default class Battle {
  constructor({ hero, enemy, rng, cooldowns, eventBus }) {
    this.hero = hero;
    this.enemy = enemy;
    this.rng = rng;
    this.cooldowns = cooldowns;
    this.eventBus = eventBus;
  }

  applyEffect(effect, target) {
    if (!target.activeEffects) target.activeEffects = [];
    target.activeEffects.push(effect);

    const log = effect.onApply(this, target);
    if (log) this.eventBus?.emit("log", log);
  }

  preprocessDefenseFlat(target, value) {
    const flat = target.statuses.get("defend_flat") || 0;
    let out = value;
    if (flat > 0) {
      out = Math.max(0, out - flat);
      target.statuses.delete("defend_flat");
    }
    return out;
  }

  computeIncomingDamage(target, baseValue) {
    let v = this.preprocessDefenseFlat(target, baseValue);
    if (target.activeEffects) {
      for (const eff of target.activeEffects) {
        if (eff.remaining > 0) v = eff.modifyIncomingDamage(v, this, target);
      }
    }
    return v;
  }

  computeHealReceived(target, baseHeal) {
    let v = baseHeal;
    if (target.activeEffects) {
      for (const eff of target.activeEffects) {
        if (eff.remaining > 0) v = eff.modifyHealReceived(v, this, target);
      }
    }
    return v;
  }

  hasStun(entity) {
    if (!entity?.activeEffects) return false;
    return entity.activeEffects.some(e => e.remaining > 0 && e.blocksAction());
  }

  resolve(action, user, target) {
    const ctx = { rng: this.rng, battle: this };

    // Garde-fou absolu : si STUN actif, impossible d'agir
    if (this.hasStun(user)) {
      this.eventBus?.emit("log", `${user.name} est étourdi et ne peut pas agir !`);
      this.eventBus?.emit("state:update");
      return { type: "stunned" };
    }

    const res = action.apply(user, target, ctx);

    if (res?.type === "damage") {
      const finalDmg = this.computeIncomingDamage(target, res.value);
      target.takeDamage(finalDmg);
    }

    if (res?.type === "heal") {
      const finalHeal = this.computeHealReceived(target, res.value);
      target.heal(finalHeal);
    }

    this.eventBus?.emit("log", res?.log ?? `${user.name} agit.`);
    this.eventBus?.emit("state:update");
    return res;
  }

  endOfRound() {
    this.cooldowns.tickAll();
    for (const actor of [this.hero, this.enemy]) {
      if (!actor.activeEffects) continue;
      actor.activeEffects = actor.activeEffects.filter(e => e.tick());
    }
  }

  isOver() { return !this.hero.alive || !this.enemy.alive; }
}
