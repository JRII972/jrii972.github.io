import { Vector2 } from "./Vector2.js";

class Resources {
  constructor(toLoad) {
    // Everything we plan to download
    this.toLoad = toLoad

    // A bucket to keep all of our images
    this.images = {};

    // Load each image
    Object.keys(this.toLoad).forEach(key => {
      const img = new Image();
      if ( typeof this.toLoad[key] === "string" ){
        img.src = this.toLoad[key];
        this.images[key] = {
          image: img,
          isLoaded: false
        }
      }else {
        img.src = this.toLoad[key].src;
        this.images[key] = this.toLoad[key];
        this.images[key].image = img;
        this.images[key].isLoaded = false;
      }      
      img.onload = () => {
        this.images[key].isLoaded = true;
      }
    })
  }
}

class ResourcesAudio {
  constructor(toLoad) {
    // Everything we plan to download
    this.toLoad = toLoad

    // A bucket to keep all of our audio
    this.audio = {};
    

    // Load each image
    Object.keys(this.toLoad).forEach(key => {
      if ( typeof this.toLoad[key] === "string" ){
        const audio = new Audio(this.toLoad[key]);
        audio.volume = 0.08;
        this.audio[key] = {
          audio: audio,
          isLoaded: false
        }
      }else {
        const audio = new Audio(this.toLoad[key].url);
        audio.volume = this.toLoad[key].volume ?? 0.08;
        this.audio[key] = this.toLoad[key];
        this.audio[key].audio = audio;
        this.audio[key].isLoaded = false;
      }    
      
    })
  }
}




// Create one instance for the whole app to use
export const resources = new Resources({
  sky: "./public/sprites/sky.png",
  ground: "./public/sprites/ground.png",
  hero: "./public/sprites/hero-sheet.png",
  shadow: "./public/sprites/shadow.png",
  rod: "./public/sprites/rod.png",
  printer: "./1x/printer_sprite.png",
  skyView: "./picture/background_v1.png",

  anne: "./public/asset/personnage/anne.png",
  patrick: "./public/asset/personnage/patrick.png",

  loader: "./public/asset/load-loading.gif",
});

const WORD_ASSET_PATH = "./public/asset/word/"
export const wordResources = new Resources({
  //Word
  word_box : WORD_ASSET_PATH + "1x/box.png", //new Vector2(174,34)
  word_box_hover : WORD_ASSET_PATH + "1x/box-hover.png", //new Vector2(174,34)
  word_box_menu : WORD_ASSET_PATH + "1x/box-menu.png", //new Vector2(174,34)
  word_box_menu_hover : WORD_ASSET_PATH + "1x/box-menu-hover.png", //new Vector2(174,34)
  word_menu_item : WORD_ASSET_PATH + "1x/box-menu-item.png", //new Vector2(174,34)
  word_menu_item_hover : WORD_ASSET_PATH + "1x/box-menu-item-hover.png", //new Vector2(174,34)
  word_recto : WORD_ASSET_PATH + "recto.png", //new Vector2(174,34)

  //ICON
  iconAcceuil: WORD_ASSET_PATH + "1x/BTNAcceuil.png",
  iconNew: WORD_ASSET_PATH + "1x/BTNNew.png",
  iconOpenFile: WORD_ASSET_PATH + "1x/BTNOpenFile.png",
  iconRetour: WORD_ASSET_PATH + "1x/BTNRetour.png",
  LogoWord: WORD_ASSET_PATH + "1x/LogoWord.png",
  btnImprimer: './capture/btn imprimer.png',

  //Page
  pageNumResp: WORD_ASSET_PATH + "page/Qu’est-ce que le numérique responsable.png"
});


// Personnage
class Personnage extends Resources{
  constructor(toLoad, default_image = null) {
    super(toLoad)
    this.default_image = default_image
  }

  get(name) {
    if ( name in this.images ) {
      return this.images[name]
    } else if ( name.toLowerCase() in this.images ) {
      return this.images[name.toLowerCase()]
    } else {
      if ( this.default_image in this.images ) { 
        return this.images[this.default_image]
      }
      return this.default_image
    }
  }


}

export const PERSONNAGE = new Personnage({
  anne: "./public/asset/personnage/anne.png",
  patrick: "./public/asset/personnage/patrick.png",
})

export const BACKGROUND = new Personnage({
  skyview: {
    src: "./picture/background_v1.png",
    frameSize: new Vector2(2048,1024),
    offset : new Vector2()
  },
  laptop: {
    src: "./public/asset/background/laptop.png",
    frameSize: new Vector2(1792,1024),
  },
  laptop_plugin: {
    src: "./public/asset/background/laptop_plugin.png",
    frameSize: new Vector2(1792,1024),
  },
  laptop_no_battery: {
    src: "./public/asset/background/laptop_no_battery.png",
    frameSize: new Vector2(1792,1024),
  },
})

export const AUDIO = new ResourcesAudio({
  above: {
    url: "./public/audio/popcorn/abovve.mp3"
  }
})