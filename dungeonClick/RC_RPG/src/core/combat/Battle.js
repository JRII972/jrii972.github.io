import logs from '../state/LogManager.js';
import settings from '../../config/settings.js';
import AIController from '../../adapters/AIController.js';

class Battle {
  constructor({ hero, enemies = [], allies = [], rng, cooldowns, onStateChange }) {
    this.hero = hero;
    this.enemies = enemies;
    this.allies = allies;
    this.rng = rng;
    this.cooldowns = cooldowns;

    // Orchestration d'état des tours
    this.round = 1;
    this.clicksLeftGlobal = Math.max(0, Number(settings.clicksTotal ?? 0));
    this.perTurn = Math.max(1, Number(settings.clicksPerTurn ?? 1));
    this.clicksLeftTurn = this.perTurn;
    this._turnLock = false;
    this._aborted = false;
    this._aiDelay = Math.max(0, Number(settings.aiAutoDelay ?? 0));

    this.ai = new AIController(this.rng);

    // Callback UI (facultatif)
    this.onStateChange = typeof onStateChange === 'function' ? onStateChange : null;
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
    return { type: "ok" };
  }


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

  // ================= Orchestration des tours =================
  _notify() {
    this.onStateChange?.({
      round: this.round,
      clicksLeftGlobal: this.clicksLeftGlobal,
      clicksLeftTurn: this.clicksLeftTurn,
      heroStunned: this.hasStun(this.hero),
      battleOver: this.isOver(),
    });
  }

  canPlayerAct() {
    if (this.isOver()) return false;
    if (!this.hero?.alive) return false;
    if (this.clicksLeftGlobal <= 0) return false;
    if (this.clicksLeftTurn <= 0) return false;
    if (this.hasStun(this.hero)) return false;
    return true;
  }

  async _delay(ms) {
    if (ms <= 0) return;
    await new Promise((res) => setTimeout(res, ms));
  }

  async _runAIPhase() {
    // Compagnons
    for (const ally of this.allies) {
      if (this._aborted) return;
      if (this.isOver()) break;
      if (!ally.alive) continue;
      if (this.hasStun(ally)) {
        logs.log(`${ally.name} est étourdi et passe son tour !`);
        await this._delay(this._aiDelay);
        continue;
      }
      this.autoTurnCompanion(ally);
      await this._delay(this._aiDelay);
    }
    // Ennemis
    for (const foe of this.enemies) {
      if (this._aborted) return;
      if (this.isOver()) break;
      if (!foe.alive) continue;
      if (this.hasStun(foe)) {
        logs.log(`${foe.name} est étourdi et passe son tour !`);
        await this._delay(this._aiDelay);
        continue;
      }
      const pick = this.ai.chooseAction(foe, this);
      if (pick?.action) this.resolve(pick.action, foe, pick.target ?? null);
      await this._delay(this._aiDelay);
    }
    this.endOfRound();
  }

  async _endHeroTurnAndRunAI() {
    if (this._turnLock) return;
    this._turnLock = true;
    await this._runAIPhase();
    this.round += 1;
    this._startHeroTurn();
    this._turnLock = false;
    this._notify();
  }

  _startHeroTurn() {
    if (!this.hero.alive) return;
    this.clicksLeftTurn = this.perTurn;
    if (this.hasStun(this.hero)) {
      logs.log(`${this.hero.name} est étourdi et perd son tour !`);
      // Skipper directement vers la phase IA et chaîner le prochain tour
      // sans bloquer l'UI (pas d'attente ici, l'appelant peut await via start/passHeroTurn)
      // On lance de manière fire-and-forget pour garder le moteur autonome
      Promise.resolve(this._endHeroTurnAndRunAI());
    }
  }

  start() {
    this._notify();
    this._startHeroTurn();
    this._notify();
  }

  async passHeroTurn() {
    await this._endHeroTurnAndRunAI();
  }

  async playerUse(actionOrId, target = null) {
    if (this.isOver()) return;
    if (!this.hero.alive) return;

    if (this.clicksLeftGlobal <= 0) {
      logs.log(`Plus d'actions disponibles dans ce combat.`);
      await this._endHeroTurnAndRunAI();
      return;
    }
    if (this.clicksLeftTurn <= 0) {
      logs.log(`Limite atteinte pour ce tour.`);
      await this._endHeroTurnAndRunAI();
      return;
    }
    if (this.hasStun(this.hero)) {
      logs.log(`${this.hero.name} est étourdi et ne peut pas agir !`);
      await this._endHeroTurnAndRunAI();
      return;
    }

    const action = typeof actionOrId === 'string'
      ? (this.hero.actions || []).find(a => a.id === actionOrId)
      : actionOrId;
    if (!action) return;

    this.resolve(action, this.hero, target);
    if (this.isOver()) { this._notify(); return; }

    this.clicksLeftGlobal = Math.max(0, this.clicksLeftGlobal - 1);
    this.clicksLeftTurn = Math.max(0, this.clicksLeftTurn - 1);
    this._notify();

    if (this.clicksLeftGlobal <= 0 || this.clicksLeftTurn <= 0) {
      await this._endHeroTurnAndRunAI();
    }
  }

  getState() {
    return {
      round: this.round,
      clicksLeftGlobal: this.clicksLeftGlobal,
      clicksLeftTurn: this.clicksLeftTurn,
      heroStunned: this.hasStun(this.hero),
      battleOver: this.isOver(),
    };
  }

  dispose() {
    this._aborted = true;
  }
}

export default Battle;
