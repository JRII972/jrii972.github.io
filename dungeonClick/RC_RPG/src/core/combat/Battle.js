export default class Battle {
  constructor({ hero, enemies = [], allies = [], rng, cooldowns, eventBus }) {
    this.hero = hero;
    this.enemies = enemies;
    this.allies = allies;
    this.rng = rng;
    this.cooldowns = cooldowns;
    this.eventBus = eventBus;
  }

  // ------- Utils effets -------
  applyEffect(effect, target) {
    if (!target.activeEffects) target.activeEffects = [];
    target.activeEffects.push(effect);
    const log = effect.onApply?.(this, target);
    if (log) this.eventBus?.emit("log", log);
  }

  computeIncomingDamage(target, baseValue) {
    const flat = target?.statuses?.get?.("defend_flat") || 0;
    let v = baseValue;
    if (flat > 0) {
      v = Math.max(0, v - flat);
      target.statuses.delete("defend_flat");
    }
    if (target?.activeEffects) {
      for (const eff of target.activeEffects) {
        if (eff.remaining > 0) v = eff.modifyIncomingDamage?.(v, this, target) ?? v;
      }
    }
    return v;
  }

  computeHealReceived(target, baseHeal) {
    let v = baseHeal;
    if (target?.activeEffects) {
      for (const eff of target.activeEffects) {
        if (eff.remaining > 0) v = eff.modifyHealReceived?.(v, this, target) ?? v;
      }
    }
    return v;
  }

  /**
   * Vérifie si une entité est étourdie.
   */
  hasStun(entity) {
    if (!entity?.activeEffects || entity.activeEffects.length === 0) return false;
    return entity.activeEffects.some(
      (e) =>
        (typeof e.blocksAction === "function" && e.blocksAction()) ||
        (e.type === "STUN" && (e.remaining ?? 0) > 0)
    );
  }

  // ------- Ciblage par défaut -------
  defaultTargetFor(action, user) {
    if (action.kind === "attack") {
      // Les ennemis ciblent toujours le héros
      if (user?.id?.startsWith?.("enemy")) return this.hero;
      // Les héros/alliés ciblent le premier ennemi vivant
      return this.enemies.find((e) => e.alive) || null;
    }
    if (action.kind === "defend") return user;

    if (action.kind === "heal") {
      if (action.target === "ally") return this.hero;
      if (action.target === "self") return user;
      if (action.target === "enemy") return this.enemies.find((e) => e.alive) || null;
      return this.hero;
    }
    return this.enemies.find((e) => e.alive) || null;
  }

  allAllies() { return [this.hero, ...(this.allies ?? [])].filter((a) => a?.alive); }
  allEnemies() { return (this.enemies ?? []).filter((e) => e?.alive); }

  // ------- Résolution -------
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
    const targets = isAllAllies ? this.allAllies() : [target ?? this.defaultTargetFor(action, user)];

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

  autoTurnCompanion(ally) {
    if (!ally?.alive) return;
    if (this.hasStun(ally)) {
      this.eventBus?.emit("log", `${ally.name} est étourdi et passe son tour !`);
      return;
    }
    const act = (ally.actions || []).find(a => a.canUse(ally, { battle: this }));
    if (!act) {
      this.eventBus?.emit("log", `${ally.name} n'a aucune action disponible.`);
      return;
    }
    this.resolve(act, ally, null);
  }

  endOfRound() {
    this.cooldowns?.tickRound?.();

    for (const actor of [this.hero, ...(this.allies ?? []), ...(this.enemies ?? [])]) {
      if (!actor?.activeEffects) continue;
      actor.activeEffects = actor.activeEffects.filter((e) => e.tick());
    }
  }

  isOver() {
    const anyEnemyAlive = (this.enemies ?? []).some((e) => e?.alive);
    return !this.hero.alive || !anyEnemyAlive;
  }
}
