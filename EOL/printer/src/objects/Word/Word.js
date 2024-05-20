import {GameObject} from "../../GameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from "../../Sprite.js";
import {resources, wordResources} from "../../Resource.js";
import {ON_CLIC, events} from "../../Events.js";
import { FillText } from "../../TextObject.js";
import { ArrowBottom } from "../helpers/Arrow.js";
import { WordMenuAssemblage, WordMenuImprimante, WordMenuNombrePage, WordMenuRectoVerso } from "./WordMenu.js";

const blueLink = 'rgb(28 120 189)';
export const ENVENT_IMPRESSION = "IMPRIMIER"

export class WordInterface extends GameObject {
  constructor({x, y, scale, canvas}) {
    super({
      name: "WordInterface",
      position: new Vector2(x,y)
    });
    this.scale = scale ?? 1
    this.canvas = canvas
    this.height = this.canvas.height
    this.width = this.canvas.width
    this.autoSize = false
    this.marginleft = this.width*.15
    this.marginpaper = this.width*.4
    this.marginbtn = this.width*.18
    
    this.genPage()
    this.genText()
    this.genMenu()
    
  }

  updateScale(scale){
    this.children.forEach(child => {
      this.removeChild(this.children)
    });
    this.children = []
    this.scale = scale
    this.height = this.canvas.height * this.scale
    this.width = this.canvas.width * this.scale
    this.marginleft = this.width*.15
    this.marginpaper = this.width*.4
    this.marginbtn = this.width*.18
    this.genPage()
    this.genText()
    this.genMenu()
  }

  genPage(){
    this.addChild(
      new Sprite({
        resource: wordResources.images.pageNumResp,
        frameSize: new Vector2(911, (this.height-this.height*.1)/(.8*this.scale)),
        scale: 0.8*this.scale,
        position: new Vector2(this.marginpaper + 5, this.height*.12) // TODO: FIX THAT
      })
    )
  }

  genMenu() {
    WordMenuAssemblage.position = new Vector2(this.marginbtn, this.height*.55)
    WordMenuAssemblage.updateScale(0.75*this.scale)
    WordMenuRectoVerso.position = new Vector2(this.marginbtn, this.height*.49)
    WordMenuRectoVerso.updateScale(0.75*this.scale)
    WordMenuNombrePage.position = new Vector2(this.marginbtn, this.height*.395)
    WordMenuNombrePage.updateScale(0.75*this.scale)
    WordMenuImprimante.position = new Vector2(this.marginbtn, this.height*.275)
    WordMenuImprimante.updateScale(0.75*this.scale)
    
    this.addChild(WordMenuAssemblage)
    this.addChild(WordMenuRectoVerso)
    this.addChild(WordMenuNombrePage)
    this.addChild(WordMenuImprimante)
  }

  genText() {
    var imprimer = new FillText({
      text: "Imprimer",
      font: 22*this.scale + "px Aptos",
      position: new Vector2(this.marginbtn, this.height*.08)
    })
    this.addChild(imprimer)
    var imprimante = new FillText({
      text: "Imprimante",
      font: 16*this.scale + "px Aptos",
      position: new Vector2(this.marginbtn, this.height*.25)
    })
    this.addChild(imprimante)
    var paramêtres = new FillText({
      text: "Paramêtres",
      font: 16*this.scale + "px Aptos",
      position: new Vector2(this.marginbtn, this.height*.37)
    })
    this.addChild(paramêtres)
    var page = new FillText({
      text: "Pages :",
      font: 14*this.scale + "px Aptos",
      position: new Vector2(this.marginbtn, this.height*.465)
    })
    this.addChild(page)
    var mise_en_page = new FillText({
      text: "Mise en page",
      font: 12*this.scale + "px Aptos",
      fillStyle: blueLink,
      textAlign: "end",
      position: new Vector2(this.marginpaper - 95*this.scale, this.height*.8), //TODO: FIX Margin
      underline: true
    })
    this.addChild(mise_en_page)
    var propriete_imprimante = new FillText({
      text: "Propriétés de l'imprimante",
      font: 12*this.scale + "px Aptos",
      fillStyle: blueLink,
      textAlign: "end",
      position: new Vector2(this.marginpaper - 95*this.scale, this.height*.335),//TODO: FIX Margin
      underline: true
    })
    this.addChild(propriete_imprimante)


    const btnImprimer = new Sprite({
      resource: wordResources.images.btnImprimer,
      frameSize: new Vector2(112,116),
      position: new Vector2(this.marginbtn, this.height*.12),
      scale: 0.8*this.scale
    })
    btnImprimer.onClick = function () {
      events.emit(ENVENT_IMPRESSION)
    }
    btnImprimer.initOnClick()
    this.addChild(btnImprimer)

    // Menu
    var acceuilBTN = new Sprite({
      resource: wordResources.images.iconAcceuil,
      frameSize: new Vector2(19,20),
      scale: 1.5*this.scale,
      position: new Vector2(this.width*.01, this.height*.08)
    })
    var acceuil = new FillText({
      text: "Acceuil",
      font: 15*this.scale + "px Aptos",
      position: new Vector2(acceuilBTN.width, acceuilBTN.height/3) //TODO: FIX THAT
    })
    acceuilBTN.addChild(acceuil)
    this.addChild(acceuilBTN)

    var NewBTN = new Sprite({
      resource: wordResources.images.iconNew,
      frameSize: new Vector2(19,20),
      scale: 1.5*this.scale,
      position: new Vector2(this.width*.01, this.height*.14)
    })
    var New = new FillText({
      text: "Nouveau",
      font: 15*this.scale + "px Aptos",
      position: new Vector2(NewBTN.width, NewBTN.height/3) //TODO: FIX THAT
    })
    NewBTN.addChild(New)
    this.addChild(NewBTN)

    var OpenFileBTN = new Sprite({
      resource: wordResources.images.iconOpenFile,
      frameSize: new Vector2(19,20),
      scale: 1.5*this.scale,
      position: new Vector2(this.width*.01, this.height*.20)
    })
    var OpenFile = new FillText({
      text: "Ouvrir",
      font: 15*this.scale + "px Aptos",
      position: new Vector2(OpenFileBTN.width, OpenFileBTN.height/3) //TODO: FIX THAT
    })
    OpenFileBTN.addChild(OpenFile)
    this.addChild(OpenFileBTN)

    var ComplémentBTN = new Sprite({
      resource: wordResources.images.iconComplément,
      frameSize: new Vector2(19,20),
      scale: 1.5*this.scale,
      position: new Vector2(this.width*.01, this.height*.28)
    })
    var Complément = new FillText({
      text: "Télécharger des compléments",
      font: 15*this.scale + "px Aptos",
      maxWidth: this.width*0.1,
      wrapText: true,
      lineHeight: 20,
      position: new Vector2(ComplémentBTN.width, ComplémentBTN.height/3) //TODO: FIX THAT
    })
    ComplémentBTN.addChild(Complément)
    this.addChild(ComplémentBTN)
    
    var emptyBTN = new Sprite({
      frameSize: new Vector2(19,20),
      scale: 1.5*this.scale,
      position: new Vector2(this.width*.01, this.height*.36)
    })
    var Information = new FillText({
      text: "Informations",
      font: 15*this.scale + "px Aptos",
      maxWidth: this.width*0.1,
      wrapText: true,
      position: new Vector2(emptyBTN.width, emptyBTN.height/3) //TODO: FIX THAT
    })
    emptyBTN.addChild(Information)
    var Enregistrer = new FillText({
      text: "Enregistrer",
      font: 15*this.scale + "px Aptos",
      maxWidth: this.width*0.1,
      wrapText: true,
      position: new Vector2(emptyBTN.width, emptyBTN.height/3 + this.width*.035) //TODO: FIX THAT
    })
    emptyBTN.addChild(Enregistrer)
    var EnregistrerSous = new FillText({
      text: "Enregistrer sous",
      font: 15*this.scale + "px Aptos",
      maxWidth: this.width*0.1,
      wrapText: true,
      position: new Vector2(emptyBTN.width, emptyBTN.height/3 + this.width*.035*2) //TODO: FIX THAT
    })
    emptyBTN.addChild(EnregistrerSous)
    emptyBTN.addChild(Enregistrer)
    var Imprimer = new FillText({
      text: "Imprimer",
      font: 15*this.scale + "px Aptos",
      maxWidth: this.width*0.1,
      wrapText: true,
      fillStyle: blueLink,
      position: new Vector2(emptyBTN.width, emptyBTN.height/3 + this.width*.035*3) //TODO: FIX THAT
    })
    emptyBTN.addChild(Imprimer)
    var Partager = new FillText({
      text: "Partager",
      font: 15*this.scale + "px Aptos",
      maxWidth: this.width*0.1,
      wrapText: true,
      position: new Vector2(emptyBTN.width, emptyBTN.height/3 + this.width*.035*4) //TODO: FIX THAT
    })
    emptyBTN.addChild(Partager)
    var Exporter = new FillText({
      text: "Exporter",
      font: 15*this.scale + "px Aptos",
      maxWidth: this.width*0.1,
      wrapText: true,
      position: new Vector2(emptyBTN.width, emptyBTN.height/3 + this.width*.035*5) //TODO: FIX THAT
    })
    emptyBTN.addChild(Exporter)
    var Transformer = new FillText({
      text: "Transformer",
      font: 15*this.scale + "px Aptos",
      maxWidth: this.width*0.1,
      wrapText: true,
      position: new Vector2(emptyBTN.width, emptyBTN.height/3 + this.width*.035*6) //TODO: FIX THAT
    })
    emptyBTN.addChild(Transformer)
    var Fermer = new FillText({
      text: "Fermer",
      font: 15*this.scale + "px Aptos",
      maxWidth: this.width*0.1,
      wrapText: true,
      position: new Vector2(emptyBTN.width, emptyBTN.height/3 + this.width*.035*7) //TODO: FIX THAT
    })
    emptyBTN.addChild(Fermer)
    this.addChild(emptyBTN)
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
  
  draw(ctx, x, y) {
    this.drawPosX = x + this.position.x;
    this.drawPosY = y + this.position.y;

    // Do the actual rendering for Images
    this.drawImage(ctx, this.drawPosX, this.drawPosY);

    // Pass on to children
    this.children.forEach((child) => child.draw(ctx, this.drawPosX, this.drawPosY));
  }

  drawImage(ctx, x, y) {
    ctx.fillStyle = "rgb(236 235 239)";
    ctx.fillRect(x, y, this.width, this.height);
    // ctx.fillStyle = "rgb(0 0 200 / 50%)";
    ctx.fillStyle = "rgb(221 220 224)";
    ctx.fillRect(x + this.marginleft -1, y + this.height*.07, this.width - (this.marginleft), this.height - this.height*.07);
    ctx.fillStyle = "rgb(245 245 245)";
    ctx.fillRect(x + this.marginleft, y + this.height*.075, this.width - (this.marginleft), this.height - this.height*.075);
    ctx.fillStyle = "rgb(250 250 250)";
    ctx.fillRect(x + this.marginpaper, y + this.height*.1, this.width-this.marginpaper, this.height-this.height*.1);

    ctx.save()
    // Sépareur bouton menu
    ctx.beginPath()
    ctx.strokeStyle = "rgb(221 220 224)";
    ctx.lineWidth = 2*this.scale //Math.ceil(fontSize * 0.08)
    ctx.moveTo(x + this.width*.01, y + this.height*.26)
    ctx.lineTo(x + this.width*.14, y + this.height*.26)
    ctx.stroke()
    
    // Bar imprimer
    ctx.beginPath()
    ctx.strokeStyle = blueLink;
    ctx.moveTo(x + this.width*.005, y + this.height*.36 + this.width*.035*3)
    ctx.lineTo(x + this.width*.005, y + this.height*.36 + this.width*.035*3.8)
    ctx.stroke()
    ctx.restore()
  }

    

}
