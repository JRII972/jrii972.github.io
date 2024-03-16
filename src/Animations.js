import { Vector2 } from "./Vector2.js"

export class Animations {
  constructor({
    startPosition, startScale, endPosition, endScale, object, sec=3
  }) {
    this.object = object
    this.startPosition = startPosition
    this.startScale = startScale
    this.endPosition = endPosition
    this.endScale = endScale
    this.nbStep = sec * 1000
    this.actualStep = 0
    this.ended = false
    this.ratio = 0
  }
  
  updateSec(sec){
    this.nbStep = sec * 1000
  }

  draw(ctx) {
    this.step()
    if ( self.object ){
      if ( this.timestampStart ){
        this.object.scale = this.startScale + (this.endScale - this.startScale )/this.nbStep*this.actualStep
        this.object.position = new Vector2(this.startPosition.x + (this.endPosition.x - this.startPosition.x )/this.nbStep*this.actualStep , this.startPosition.y + (this.endPosition.y - this.startPosition.y )/this.nbStep*this.actualStep)
      }
      this.object.draw(ctx, 0, 0)
    }
  }

  start(){
    let _a = new Date();
    this.timestampStart = _a.getTime();
    this.ended = false
  }

  step() {
    if (this.timestampStart){
      if (this.actualStep < this.nbStep){
        let _a = new Date();
        var delta = _a.getTime() - this.timestampStart
        this.actualStep = Math.round(delta)
        this.ratio = this.actualStep / this.nbStep
      } else {
        this.ended = true
      }
    }

  }

  reset(){
    this.timestampStart = undefined
    this.actualStep = 0
  }
}