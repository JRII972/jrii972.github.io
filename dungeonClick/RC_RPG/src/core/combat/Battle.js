import logs from '../state/LogManager.js';

class Battle {
  constructor({ hero, enemies = [], allies = [], rng, cooldowns, eventBus }) {
    this.hero = hero;
    this.enemies = enemies;
    this.allies = allies;
    this.rng = rng;
    this.cooldowns = cooldowns;
    this.eventBus = eventBus;
  }

  // Traitement début de tour : appliquer effets instantanés éventuels + purge des expirés
  processStartOfTurn(entity) {
    if (!entity?.activeEffects || entity.activeEffects.length === 0) return;
    const periodicLogs = [];

    for (const eff of entity.activeEffects) {
      if (eff.remaining > 0 && typeof eff.onTurnStart === "function") {
        const l = eff.onTurnStart(this, entity);
        if (l) periodicLogs.push(l);
      }
    }
    const expired = entity.activeEffects.filter(e => e.remaining <= 0);
    if (expired.length > 0 && entity === this.hero) {
      const names = expired.map(e => e.name).join(", ");
      logs.log(`Effets terminés sur ${entity.name}: ${names}.`);
    }
    entity.activeEffects = entity.activeEffects.filter(e => (e.remaining > 0));
    periodicLogs.forEach(l => l && logs.log(l));
  }

  // ------- Utils effets -------
  applyEffect(effect, target) {
    if (!target.activeEffects) target.activeEffects = [];
    target.activeEffects.push(effect);
    effect.onApply?.(this, target);
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
    // Début de tour : rafraîchir les effets du lanceur (sécurité si non géré ailleurs)
    this.processStartOfTurn(user);
    if (this.hasStun(user)) {
      logs.log(`${user.name} est étourdi et ne peut pas agir !`);
      this.eventBus?.emit("state:update");
      return { type: "stunned" };
    }

    if (!action.canUse(user, { battle: this })) {
      logs.log(`${user.name} ne peut pas utiliser ${action.name}`);
      return { type: "invalid" };
    }

    const isAllAllies = action.targetsAllAllies && action.target === "ally";
    const primaryTarget = (action.target === "self") ? user : (target ?? this.defaultTargetFor(action, user));
    const targets = isAllAllies ? this.allAllies() : [primaryTarget];

    let first = true;
    for (const tgt of targets) {
      action.apply(user, tgt, { battle: this, rng: this.rng, flags: first ? {} : { noCooldown: true, noCost: true } });
      first = false;
    }
    this.eventBus?.emit("state:update");
    return { type: "ok" };
  }

  // _applyOutcome supprimé (logique déplacée dans resolve)

  // buildActionLogLine supprimé, logs gérés directement par les actions

  autoTurnCompanion(ally) {
    if (!ally?.alive) return;
    if (this.hasStun(ally)) {
      logs.log(`${ally.name} est étourdi et passe son tour !`);
      return;
    }
    const act = (ally.actions || []).find(a => a.canUse(ally, { battle: this }));
    if (!act) {
      logs.log(`${ally.name} n'a aucune action disponible.`);
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

export default Battle;
