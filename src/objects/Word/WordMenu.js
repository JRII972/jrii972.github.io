import { ON_CLIC, ON_HOVER, events } from "../../Events.js";
import { GameObject } from "../../GameObject.js";
import { wordResources } from "../../Resource.js";
import { Vector2 } from "../../Vector2.js";
import { WORD_RECTOVERSO_MENU, WORD_RECTOVERSO_MENU_1, WordPrinterButton } from "./WordPrinterButton.js";

class WordMenu extends GameObject {
    constructor({x, y, scale, items, isSmallMenu = false}) {
        super({
          name: "WordPrinterMenu",
          position: new Vector2(x,y),
        });
        
        this.scale = scale
        this.isSmallMenu = isSmallMenu
        // this.items.forEach(wordPrinterButton => {
        //   wordPrinterButton.parent = this
        // });
        
        this.open = false
        var index = 1
        this.items = items
        this.items.forEach( item => {
          item.index = index
          index += 1
          item.x = 0
          item.y = 0
          item.scale = this.scale
          item.isSmallMenu = this.isSmallMenu
          item.button = new WordPrinterButton(item)
          item.menu = new WordPrinterButton(item)
          
          item.button.initOnHover();
          
          events.unsubscribeFromEvent(item.menu, ON_HOVER) // TODO: FIX on hove on first open
          item.menu.toMenuItem();
          item.menu.onClick = function(value) {
            if ( this.parent ){
              this.parent.selectItem(this)
            }
          }
          item.menu.parent = this
          item.button.onClick = function(value) {
            if ( this.parent ){
              this.parent.openMenu(this)
            }
          }
          item.button.parent = this
        })
        this.items.forEach( item => {
          events.unsubscribeFromEvent(item.button, ON_CLIC)
          if (item.selected){
            item.button.initOnClick()
          } 
        })

        events.onClick(this, this.clickOutside)
      }   


    updateScale(scale){
      this.children = []
      this.scale = scale
      this.items.forEach(item => {
        item.button.updateScale(this.scale)
        item.button.toButton()
        item.menu.updateScale(this.scale)
        item.menu.toMenuItem()
      });
    }
    
    close() {
      this.children.forEach( child => this.removeChild(child))
      this.items[0].toButton()
      this.addChild(this.items[0])
    }
    
    open() {
      this.children.forEach( child => this.removeChild(child))
      this.items.forEach(wordPrinterButton => {
        
      });
      this.items[0].button.toButton()
    }

    draw(ctx, x, y) {
      this.drawPosX = x + this.position.x;
      this.drawPosY = y + this.position.y;
      
      this.items.forEach( item => {
        if (item.selected){
          item.button.draw(ctx, this.drawPosX, this.drawPosY)
        }
      })
      
      if (this.open){
        this.items.forEach((item) => {
          events.onClick(item.menu, item.menu.checkClick)
          ctx.fillStyle = "rgb(226 225 229)";
          ctx.fillRect(this.drawPosX-1, this.drawPosY + (item.menu.height) * item.index -2, item.menu.width +2, item.menu.height +2);
          item.menu.initOnHover()
          item.menu.draw(ctx, this.drawPosX, this.drawPosY + (item.menu.height) * item.index-1)

          
        });
      } else {
        this.items.forEach((item) => {
          events.unsubscribeFromEvent(item.menu, ON_CLIC)
          events.unsubscribeFromEvent(item.menu, ON_HOVER)
        })
      }
    }

    selectItem(selected) {
      this.items.forEach( item => {
        if ( item.menu == selected ){
          item.selected = true
          events.unsubscribeFromEvent(item.button, ON_CLIC)
          events.onClick(item.button, item.button.checkClick)
        } else {
          item.selected = false
          events.unsubscribeFromEvent(item.button, ON_CLIC)
        }
      })
    }

    openMenu() {
      this.open = !this.open
    }

    clickOutside() {
      this.items.forEach( item => {
        if ( !item.button.isHovered ){
          if ( !item.menu.isHovered ) {
            this.open = false;
          }
        }
        events.unsubscribeFromEvent(item.button, ON_CLIC)
        if (item.selected){
          events.onClick(item.button, item.button.checkClick)
        } 
      })
      
    }
  

}


export const WordMenuImprimante = new WordMenu({
  x : 0,
  y : 0,
  scale : 0.75,
  isSmallMenu: true,
  items: [
    {
      image: wordResources.images.word_recto, 
      main_text: "Adobe PDF", 
      second_text: "Prête",
    },
    {
      image: wordResources.images.word_recto, 
      main_text: "Microsoft Print to PDF", 
      second_text: "Prête",
      selected: true
    },
    {
      image: wordResources.images.word_recto, 
      main_text: "OneNote Desctop", 
      second_text: "Prête",
    }
  ]
})
export const WordMenuAssemblage = new WordMenu({
  x : 0,
  y : 0,
  scale : 0.75,
  isSmallMenu: true,
  items: [
    {
      image: wordResources.images.word_recto, 
      main_text: "Assemblées", 
      second_text: "1,2,3    1,2,3      1,2,3",
      selected: true
    },
    {
      image: wordResources.images.word_recto, 
      main_text: "Non assemblées", 
      second_text: "1,1,1    2,2,2      3,3,3",
    }
  ]
})
export const WordMenuRectoVerso = new WordMenu({
  x : 0,
  y : 0,
  scale : 0.75,
  items: [
    {
      image: wordResources.images.word_recto, 
      main_text: "Impression recto", 
      second_text: "Imprimer uniquement sur un côté de la page",
      selected: true
    },
    {
      image: wordResources.images.word_recto, 
      main_text: "Imprimer recto verso", 
      second_text: "...",
    },
    {
      image: wordResources.images.word_recto, 
      main_text: "Imprimer manuellement en recto verso", 
      second_text: "Recharger le papier lorsque le systême vous invite à imprimer le verso",
    }
  ]
})
export const WordMenuNombrePage = new WordMenu({
  x : 0,
  y : 0,
  scale : 0.75,
  items: [
    {
      image: wordResources.images.word_recto, 
      main_text: "Impression toutes les pages", 
      second_text: "L'ensemble du document",
      selected: true
    },
    {
      image: wordResources.images.word_recto, 
      main_text: "Imprimer la selection", 
      second_text: "Seulement le contenu sélectionné",
    },
    {
      image: wordResources.images.word_recto, 
      main_text: "Imprimer la page active", 
      second_text: "Seulement cette page",
    },
    {
      image: wordResources.images.word_recto, 
      main_text: "Impression personnalisée", 
      second_text: "Enter des pages, des sections, ou des plages spécifiques"
    }
  ]
})
