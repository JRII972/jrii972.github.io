import { Animations } from "./Animations.js"
import { events } from "./Events.js"
import { GameObject } from "./GameObject.js"
import { resources } from "./Resource.js"
import { Sprite } from "./Sprite.js"
import { Vector2 } from "./Vector2.js"
import { ENVENT_IMPRESSION, WordInterface } from "./objects/Word/Word.js"

export class GameRender {
    constructor(canvas){
        this.wordInterface = new WordInterface({
            canvas: canvas
          })
        this.canvas = canvas
        this.descktopView = new GameObject({})
        this.initDescktopView()
        this.state = "word" // descktop, animation_descktop
        this.descktopViewAnimation = new Animations({
            sec: 1.2
        })
        this.translateAnimation = new Animations({
            sec: 1.2    
        })
        this.printerAnimation = new Animations({
            sec: .4    
        })
        events.on(ENVENT_IMPRESSION, this, this.onImpression)
        this.printer = new Sprite({
            resource: resources.images.printer,
            frameSize: new Vector2(440, 530),
            hFrames: 8,
            scale: .85
        })
        
    }

    initDescktopView() {
        this.descktopView.addChild(
            new Sprite({
                resource: resources.images.skyView,
                frameSize: new Vector2(2048, 1024),
                hFrames: 5,
            })
        )
    }

    draw(ctx, x, y){
        if (this.state == "word") {   
            this.wordInterface.draw(ctx, x, y)
        } else if ( this.state == 'descktop') {
            this.descktopViewAnimation.step()
            this.wordInterface.updateScale(1 - .86 * this.descktopViewAnimation.actualStep / this.descktopViewAnimation.nbStep )
            this.wordInterface.position.x = 640 * this.descktopViewAnimation.actualStep / this.descktopViewAnimation.nbStep
            this.wordInterface.position.y =405 * this.descktopViewAnimation.actualStep / this.descktopViewAnimation.nbStep
            this.descktopView.updateScale( 7.5*(this.descktopViewAnimation.nbStep - this.descktopViewAnimation.actualStep) / this.descktopViewAnimation.nbStep + 1)
            this.descktopView.position.x = -4800*(this.descktopViewAnimation.nbStep - this.descktopViewAnimation.actualStep) / this.descktopViewAnimation.nbStep
            this.descktopView.position.y = -3100*(this.descktopViewAnimation.nbStep - this.descktopViewAnimation.actualStep) / this.descktopViewAnimation.nbStep
            this.descktopView.draw(ctx, x, y)
            ctx.globalAlpha = (this.descktopViewAnimation.nbStep - this.descktopViewAnimation.actualStep) / this.descktopViewAnimation.nbStep + 0.1
            this.wordInterface.draw(ctx, x, y)
            ctx.globalAlpha = 1
            if (this.descktopViewAnimation.ended){
                this.state = "printer"
                this.translateAnimation.start()
            }
        } else if ( this.state == 'printer') {
            this.translateAnimation.step()
            this.wordInterface.updateScale(0.14)
            var translateX = -1010 * this.translateAnimation.ratio;
            var translateY = 0;
            this.descktopView.draw(ctx, x + translateX, y + translateY)
            this.printer.draw(ctx, 1310 + translateX, 450)
            ctx.globalAlpha = 0.1
            this.wordInterface.draw(ctx, x + translateX, y + translateY)
            ctx.globalAlpha = 1
            if (this.translateAnimation.ended){
                this.state = "print"
                this.printerAnimation.start()
            }
        } else if ( this.state == 'print') {
            this.descktopView.draw(ctx, x -1010, y)
            switch (this.printer.frame) {
                case 1:
                    this.printer.draw(ctx, 272, 450)
                    break;
                case 2:
                    this.printer.draw(ctx, 273, 449)
                    break;
                case 3:
                    this.printer.draw(ctx, 275, 449)
                    break;
                case 4:
                    this.printer.draw(ctx, 273, 450)
                    break;
            
                default:
                    this.printer.draw(ctx, 270, 450)
                    break;
            }
            
            this.printerAnimation.step()
            if (this.printerAnimation.ended){
                this.printer.frame += 1
                this.printerAnimation.reset()
                this.printerAnimation.start()
                if (this.printer.frame > 7){
                    this.printer.frame = 4
                }
            }
        }
    }

    onImpression() {
        this.descktopViewAnimation.start()
        this.state = "descktop"
    }

}