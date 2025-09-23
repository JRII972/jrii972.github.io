export default class TurnManager {
  constructor({ actors }) {
    this.turn = 1;
    this.actors = actors; // tri possible par speed si nécessaire
    this.currentIndex = 0;
  }
  currentActor() { return this.actors[this.currentIndex]; }
  nextActor() {
    this.currentIndex = (this.currentIndex + 1) % this.actors.length;
    if (this.currentIndex === 0) this.turn += 1; // nouveau tour
    return this.currentActor();
  }
}
