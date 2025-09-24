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

  defaultTargetFor(action, user) {
    if (action.kind === "attack") {
      // ⬇️ Ennemis : premier allié vivant (héros + compagnons)
      if (user?.id?.startsWith?.("enemy")) {
        return this.allAllies()[0] || null;
      }
      // Héros/alliés : premier ennemi vivant
      return this.allEnemies()[0] || null;
    }
    if (action.kind === "defend") return user;

    if (action.kind === "heal") {
      if (action.target === "ally") return user?.id?.startsWith?.("enemy") ? (this.allEnemies()[0] || null) : (this.allAllies()[0] || null);
      if (action.target === "self") return user;
      if (action.target === "enemy") return user?.id?.startsWith?.("enemy") ? (this.allAllies()[0] || null) : (this.allEnemies()[0] || null);
      return user;
    }
    return this.allEnemies()[0] || null;
  }

  allAllies() { return [this.hero, ...(this.allies ?? [])].filter((a) => a?.alive); }
  allEnemies() { return (this.enemies ?? []).filter((e) => e?.alive); }

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

    // 📝 Log d’intention (qui est ciblé)
    if (isAllAllies) {
      this.eventBus?.emit("log", `${user.name} utilise ${action.name} sur **tous les alliés**.`);
    } else if (targets[0]) {
      this.eventBus?.emit("log", `${user.name} cible ${targets[0].name} avec ${action.name}.`);
    }

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
    if (res.type === "damage") {
      let acc = action.accuracy ?? 1;
      if (user?.activeEffects) {
        for (const eff of user.activeEffects) {
          if (typeof eff.modifyAccuracy === "function") {
            acc = eff.modifyAccuracy(acc, action, user);
          }
        }
      }

      if (!this.rng.chance(acc)) {
        this.eventBus?.emit("log", `${user.name} rate ${action.name} sur ${target.name} !`);
        return;
      }

      const finalDmg = this.computeIncomingDamage(target, res.value);
      target.takeDamage(finalDmg);
      this.eventBus?.emit("log", res.log ?? `${user.name} inflige ${finalDmg} à ${target.name}.`);
      return;
    }
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
