export default class GameState {
  constructor({ hero, enemy }) {
    this.hero = hero;
    this.enemy = enemy;
    this.log = [];
  }
  pushLog(line) { this.log.push(line); }
}
