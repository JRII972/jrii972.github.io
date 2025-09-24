export default class CooldownManager {
  constructor(actors = []) {
    this.actors = actors;
  }

  _forEachAction(cb) {
    for (const actor of this.actors) {
      if (!actor || !actor.actions) continue;
      for (const a of actor.actions) cb(a, actor);
    }
  }

  // Compat historique
  tickAll() {
    this._forEachAction((a) => a.tickCooldown?.());
  }

  // Nouvelle sémantique explicite : à appeler **fin de round seulement**
  tickRound() {
    this.tickAll();
  }
}
