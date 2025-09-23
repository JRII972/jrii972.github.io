export default class CooldownManager {
  constructor(actors = []) {
    this.actors = actors;
  }
  tickAll() {
    for (const actor of this.actors) {
      for (const action of actor.actions) action.tickCooldown();
    }
  }
}
