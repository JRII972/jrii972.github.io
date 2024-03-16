import { TextObject } from "./TextObject.js";

const ON_HOVER = "ON_HOVER";
const ON_CLIC = "ON_CLIC";
const SCREENRESIZE = 'SCREENRESIZE';

class Events {
  callbacks = [];
  nextId = 0;

  // emit event
  emit(eventName, value) {
    this.callbacks.forEach(stored => {
      if (stored.eventName === eventName) {
        try {
          stored.caller[stored.callback.name](value)
        } catch (error) {
          stored.callback(value)
        }
      }
    })
  }

  // subscribe to something happening
  on(eventName, caller, callback) {
    if ( caller instanceof TextObject ){
      console.log('yolo')
    }
    for (const event in this.callbacks) {
      if ((event.caller == caller) && (event.eventName == eventName) && (event.callback == callback) ) {
        return event.id;
      }
    }
    this.nextId += 1;
    this.callbacks.push({
      id: this.nextId,
      eventName,
      caller,
      callback,
    });

    if ( callback.name == "checkClick" && eventName == ON_HOVER){
      console.log("false added")
    }
    return this.nextId;
  }

  // remove the subscription
  off(id) {
    this.callbacks = this.callbacks.filter((stored) => stored.id !== id);
  }

  unsubscribe(caller) {
    this.callbacks = this.callbacks.filter(
        (stored) => stored.caller !== caller,
    );
  }
  unsubscribeFromEvent(caller, eventName) {
    this.callbacks = this.callbacks.filter(
        (stored) => !((stored.caller == caller) && (stored.eventName == eventName)),
    );
  }

  onHover( caller, callback ){
    this.on(ON_HOVER, caller, callback)
  }
  onClick( caller, callback ){
    this.on(ON_CLIC, caller, callback)
  }
  
  emitOnHover(value) {
    this.callbacks.forEach(stored => {
      if (stored.eventName === ON_HOVER) {
        stored.caller[stored.callback.name](value)
      }
    })
  }
  emitOnClick(value) {
    this.callbacks.forEach(stored => {
      if (stored.eventName === ON_CLIC) {
        stored.caller[stored.callback.name](value)
      }
    })
  }

}

export const events = new Events();
export { ON_CLIC, ON_HOVER, SCREENRESIZE}