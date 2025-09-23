export default class EventBus {
  constructor() { this.map = new Map(); }
  on(evt, cb) {
    if (!this.map.has(evt)) this.map.set(evt, new Set());
    this.map.get(evt).add(cb);
    return () => this.map.get(evt).delete(cb);
  }
  emit(evt, payload) {
    (this.map.get(evt) || []).forEach(cb => cb(payload));
  }
}
