class LogManager {
  constructor(){
    this.listeners = new Set();
  }
  subscribe(fn){
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
  log(message){
    if(!message) return;
    for(const l of this.listeners) l(message);
  }
  batch(lines){
    if(!Array.isArray(lines)) return;
    for(const l of lines){
      if(l) this.log(l);
    }
  }
}
const instance = new LogManager();
export default instance;
export { LogManager };
