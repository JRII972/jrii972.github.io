import {Vector2} from "./Vector2.js";
import {events} from "./Events.js";
import { Clickable } from "./helpers/HoverHelper.js";
import { Sprite } from "./Sprite.js";
import { resources, wordResources } from "./Resource.js";

export class GameObject extends Clickable {
  constructor({ position, checkHover = false, scale = 1 }) {
    super({checkHover});
    this.position = position ?? new Vector2(0, 0);
    this.children = [];
    this.parent = null;
    this.hasReadyBeenCalled = false;
    this.width = 0;
    this.height = 0;
    this.scale = scale;
    this.drawPosX = this.position.x
    this.drawPosY = this.position.y
    this.autoSize = true
  }

  updateScale(scale){
    this.children.forEach(child => {
      child.scale = child.scale / this.scale * scale
    });
    this.scale = scale
  }

  // First entry point of the loop
  stepEntry(delta, root) {
    // Call updates on all children first
    this.children.forEach((child) => child.stepEntry(delta, root));

    // Call ready on the first frame
    if (!this.hasReadyBeenCalled) {
      this.hasReadyBeenCalled = true;
      this.ready();
    }

    // Call any implemented Step code
    this.step(delta, root);
  }

  // Called before the first `step`
  ready() {
    // ...
  }

  // Called once every frame
  step(_delta) {
    // ...
  }

  /* draw entry */
  draw(ctx, x, y) {
    this.drawPosX = x + this.position.x;
    this.drawPosY = y + this.position.y;

    // Do the actual rendering for Images
    this.drawImage(ctx, this.drawPosX, this.drawPosY);

    // Pass on to children
    this.children.forEach((child) => child.draw(ctx, this.drawPosX, this.drawPosY));
  }

  drawImage(ctx, drawPosX, drawPosY) {
    //...
  }

  // Remove from the tree
  destroy() {
    this.children.forEach(child => {
      child.destroy();
    })
    this.parent.removeChild(this)
  }

  /* Other Game Objects are nestable inside this one */
  addChild(gameObject) {
    gameObject.parent = this;
    this.children.push(gameObject);
    if ((gameObject instanceof Sprite) && (this.autoSize)){
      if ( (gameObject.position.x + gameObject.frameSize.x * gameObject.scale) > this.width) {
        this.width = gameObject.position.x + gameObject.frameSize.x * gameObject.scale
      }
      if ( (gameObject.position.y + gameObject.frameSize.y * gameObject.scale) > this.height) {
        this.height = gameObject.position.y + gameObject.frameSize.y * gameObject.scale
      }
    }
  }

  removeChild(gameObject) {
    events.unsubscribe(gameObject);
    this.children = this.children.filter(g => {
      return gameObject !== g;
    })
  }

  checkHover({mouseX, mouseY, toFalse}) {
    this.isHovered = false
    if ( this.children ){
      this.children.forEach((child) => {
        if ( child.checkHover({mouseX, mouseY, toFalse}) ) {
          if (!this.isHovered && child.isHovered) {
            this.isHovered = true
          }
        }
      }); 
    }
    if (toFalse) {
      this.isHovered = false
    } else if (!this.isHovered){
        if (
          (this.drawPosX < mouseX) && (mouseX < (this.drawPosX + this.width )) &&
          (this.drawPosY < mouseY) && ( mouseY < (this.drawPosY + this.height))
        ) {
          this.isHovered = true
        } 
    }
    if (this.isHovered) {
      this.onHover()
    }
    
  }
  
}