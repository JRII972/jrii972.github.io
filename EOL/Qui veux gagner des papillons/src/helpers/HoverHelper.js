import { events } from "../Events.js";


export class HoverHelper {
    constructor({  checkHover = false }) {
      this.isHovered = false
      if (checkHover) {
        events.onHover(this, this.checkHover)
      }
    }

    initOnHover() {
      events.onHover(this, this.checkHover)
    }
    
    checkHover({mouseX, mouseY, toFalse}) {
        // this.isHovered = false
        this.children.forEach((child) => {
          if ( child.checkHover({mouseX, mouseY, toFalse}) ) {
            if (!this.isHovered && child.isHovered) {
              this.isHovered = true
            }
          } else {
            this.isHovered = false
          }
        });
        if (toFalse) {
          this.isHovered = false
        }
        if (this.isHovered) {
          this.onHover()
        }
      }
    
      onHover() {
        //
      }
      
}

export class Clickable extends HoverHelper {
  constructor({  checkHover = false }) {
    super({ checkHover })
    // events.onClick(this, this.checkClick)
  } 

  checkClick({mouseX, mouseY}){
    this.checkHover({mouseX, mouseY})
    if (this.isHovered){
      this.onClick()
    }
  }
  
  
  onClick() {
    console.log(this)
  }
}