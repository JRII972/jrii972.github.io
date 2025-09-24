export default class TurnManager {
  constructor({ actors = [] }) {
    this.actors = actors;
    this.currentIndex = 0;
    this.turn = 1; // correspond au numéro de **round** affiché dans l'UI

    // place le curseur sur le premier acteur vivant
    if (!this._isAlive(this.actors[this.currentIndex])) {
      this.currentIndex = this._findNextAliveFrom(this.currentIndex);
    }
  }

  _isAlive(a) {
    return !!a && a.alive !== false;
  }

  _findNextAliveFrom(i) {
    const n = this.actors.length;
    if (n === 0) return 0;
    let j = (i + 1) % n;
    let guard = 0;
    while (guard < n && !this._isAlive(this.actors[j])) {
      j = (j + 1) % n;
      guard++;
    }
    return j;
  }

  currentActor() {
    return this.actors[this.currentIndex];
  }

  /**
   * Avance au prochain acteur vivant.
   * Retourne { next, roundEnded } où roundEnded === true si on a bouclé au début.
   */
  advance() {
    const prevIndex = this.currentIndex;
    const nextIndex = this._findNextAliveFrom(prevIndex);

    // Détection de fin de round : on a "bouclé" si l'index diminue ou reste 0 après wrap
    const roundEnded = nextIndex <= prevIndex;

    this.currentIndex = nextIndex;
    if (roundEnded) this.turn += 1;

    return { next: this.currentActor(), roundEnded };
  }
}
