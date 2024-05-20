import {GameObject} from "../../GameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from "../../Sprite.js";
import {wordResources} from "../../Resource.js";
import {ON_CLIC, events} from "../../Events.js";
import {FillText} from "../../TextObject.js"
import { ArrowBottom } from "../helpers/Arrow.js";

export class WordPrinterButton extends GameObject {
  constructor({x, y, scale, image, main_text, second_text,isSmallMenu=false}) {
    super({
      name: "WordPrinterButton",
      position: new Vector2(x,y)
    });
    this.isSmallMenu = isSmallMenu
    this.scale = scale ?? 1
    this.image = image ?? null
    this.main_text = main_text ?? "Hello your forgot the text"
    this.second_text = second_text ?? "Hello your forgot the text"
    this.toButton()
    
  }

  updateScale(scale){
    this.children.forEach(child => {
      child.scale = child.scale / this.scale * scale
    });
    this.scale = scale
    this.toButton()
    
  }

  toButton() {
    this.children.forEach( child => this.removeChild(child))
    this.width = 0;
    this.height = 0;
    this.box = new Sprite({
      resource: wordResources.images.word_box,
      position: new Vector2(0, 0), // nudge upwards visually
      frameSize : new Vector2(174,34),
      scale : 1.8 * this.scale,
      onHoverResource: wordResources.images.word_box_hover
    })
    this.picture = new Sprite({
      resource: this.image,
      position: new Vector2((this.box.frameSize.x * this.box.scale) * 0.04 * this.scale, ((this.box.frameSize.y * this.box.scale) - (36*1.2*this.scale)) / 2), // nudge upwards visually
      frameSize : new Vector2(29,36),
      scale : 1.2 * this.scale
    })
    this.main_text_obj = new FillText({ 
      text : this.main_text, 
      position : new Vector2(
        this.picture.frameSize.x * this.picture.scale + this.picture.position.x + (this.box.frameSize.x * this.box.scale) * 0.06 * this.scale, 
        this.picture.position.y),
      font : 17*this.scale + "px Aptos"
    })
    this.second_text_obj = new FillText({ 
      text : this.second_text, 
      position : new Vector2(
        this.picture.frameSize.x * this.picture.scale + this.picture.position.x + (this.box.frameSize.x * this.box.scale) * 0.06 * this.scale, 
        (this.box.frameSize.y * this.box.scale) - (20 * this.scale)),
      font : 16*this.scale + "px Aptos",
      maxWidth: this.box.width*.7
    })
    this.arrow = new ArrowBottom({
      position : new Vector2(this.box.width - 25 * this.scale, this.box.height/2), 
      scale : this.scale * 0.5
    })
    this.addChild(this.box);
    this.addChild(this.picture);
    this.addChild(this.main_text_obj)
    this.addChild(this.second_text_obj)
    this.addChild(this.arrow)
  }

  toMenuItem() {
    this.children.forEach( child => this.removeChild(child))
    this.width = 0;
    this.height = 0;
    this.box = new Sprite({
      resource: this.isSmallMenu ? wordResources.images.word_box_menu : wordResources.images.word_menu_item,
      position: new Vector2(0, 0), // nudge upwards visually
      frameSize : this.isSmallMenu ? new Vector2(174,34) : new Vector2(174*2,34),
      scale : 1.8 * this.scale,
      onHoverResource: wordResources.images.word_menu_item_hover,
      checkHover: true
    })
    this.picture = new Sprite({
      resource: this.image,
      position: new Vector2((this.box.frameSize.x * this.box.scale) * 0.04 * this.scale, ((this.box.frameSize.y * this.box.scale) - (36*1.2*this.scale)) / 2), // nudge upwards visually
      frameSize : new Vector2(29,36),
      scale : 1.2 * this.scale
    })
    this.second_text_obj = new FillText({ 
      text : this.second_text, 
      position : new Vector2(
        this.picture.frameSize.x * this.picture.scale + this.picture.position.x + (this.box.frameSize.x * this.box.scale) * 0.02 * this.scale, 
        (this.box.frameSize.y * this.box.scale) - (20 * this.scale)),
      font : 16*this.scale + "px Aptos",
      maxWidth: this.box.width*.9
    })
    this.addChild(this.box);
    this.addChild(this.picture);
    this.addChild(this.main_text_obj)
    this.addChild(this.second_text_obj)
  }
  

  ready() {
    // events.on("HERO_POSITION", this, pos => {
    //   // detect overlap...
    //   // const roundedHeroX = Math.round(pos.x);
    //   // const roundedHeroY = Math.round(pos.y);
    //   if (roundedHeroX === this.position.x && roundedHeroY === this.position.y) {
    //     this.onCollideWithHero();
    //   }
    // })
  }

  // First entry point of the loop
  stepEntry(delta, root) {

    // Call ready on the first frame
    // if (!this.hasReadyBeenCalled) {
    //   this.hasReadyBeenCalled = true;
    //   this.ready();
    // }

    // // Call any implemented Step code
    // this.step(delta, root);
  }

  // Called once every frame
  step(_delta) {
    // ...
  }

  onHover() {
  }
  
  // drawImage(ctx) {
    
  //   ctx.fillStyle = "rgb(245 245 245)";
  //   ctx.fillRect(this.position.x, this.position.y, this.box.height, this.box.width);
  // } 

}

var WORD_RECTOVERSO_MENU = new WordPrinterButton({
  x: 0, 
  y: 0, 
  scale: 1, 
  image: wordResources.images.word_recto, 
  main_text: "Impression Recto", 
  second_text: "Imprimer uniquement sur..."
})
var WORD_RECTOVERSO_MENU_1 = new WordPrinterButton({
  x: 0, 
  y: 0, 
  scale: 1, 
  image: wordResources.images.word_recto, 
  main_text: "Impression Recto", 
  second_text: "Imprimer uniquement sur..."
})
export {WORD_RECTOVERSO_MENU, WORD_RECTOVERSO_MENU_1}