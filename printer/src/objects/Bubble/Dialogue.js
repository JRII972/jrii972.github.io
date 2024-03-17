import { ON_CLIC, SCREENRESIZE, events } from "../../Events.js"
import { AUDIO, BACKGROUND, PERSONNAGE, resources } from "../../Resource.js"
import { Sprite } from "../../Sprite.js"
import { Vector2 } from "../../Vector2.js"
import { Clickable } from "../../helpers/HoverHelper.js"
import { Question } from "../../helpers/QuizzHelper.js"
import { Bubble } from "./Bubble.js"

function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

const READY = "READY"
const STARTED = "STARTED"
const LOADING = "LOADING"
const HOLD = "HOLD"

export class Dialogue extends Clickable {
    constructor({
        dialogueJson,
        canvas
    }){
        super({checkHover: false})

        this.dialogueJson = dialogueJson
        this.status = LOADING
        this.canvas = canvas

        this.bubble = new Bubble({
            text : "",
            canvas: this.canvas,
            title: "",
            strokeStyle: "#B4E1FF",
            fillStyle: "#FFF1D7",
            lineWidth: 5,
            textColor: "#1B4079",
            dialogue: this,
            
          })
        
        this.width = this.canvas.width
        this.height = this.canvas.height

        // events.on(SCREENRESIZE, )
    }

    async getjson() {
        this.data = await fetch(this.dialogueJson)
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP error " + response.status);
                }
                return response.json();
            })
        
        if ( this.data.audio ){
            if ( this.data.audio in AUDIO.audio ){
                while ( AUDIO.audio[this.data.audio].audio.readyState < 3 ) { // FIX: Wait all audio loading
                    console.log('loadind audio')
                    await delay(1000);
                }
            }
        }  
        this.status = HOLD
    }

    async init() {
        await this.getjson()
        console.log(this.data)
        this.updateDialogue(this.data.start)
        this.status = READY  
        this.initOnClick()   
        this.updateBackground()
    }

    start() {
        this.status = STARTED
        if ( this.data.audio ){
            if ( this.data.audio in AUDIO.audio ){
                AUDIO.audio[this.data.audio].audio.play()
            }
        }   
        
    }

    updateDialogue(tag) {
        this.actualDialogue = tag ?? this.actualDialogue
        
        this.updateBubble(0)
    }

    updateBubble(id) {
        this.diagStep = id ?? this.diagStep
        this.bubble.updateText( this.data.dialogues[this.actualDialogue].dialogue[this.diagStep].text ?? "" )
        this.bubble.updateTitle( this.data.dialogues[this.actualDialogue].dialogue[this.diagStep].title ?? this.data.dialogues[this.actualDialogue].dialogue[this.diagStep].personne + ' :' )

        if ( !this.data.dialogues[this.actualDialogue].dialogue[this.diagStep].personne ){
            this.bubble.updateTitle( "Vous" )
            this.bubble.personne = new Sprite({
                resource: PERSONNAGE.get(this.data.dialogues[this.actualDialogue].dialogue[this.diagStep].personne ?? 'vous'),
                frameSize: new Vector2(1024,1024)
            })
            this.bubble.update( {
                side: 'left'
            } )
        } else {
            this.bubble.personne = new Sprite({
                resource: PERSONNAGE.get(this.data.dialogues[this.actualDialogue].dialogue[this.diagStep].personne),
                frameSize: new Vector2(1024,1024)
            })
            this.bubble.update( {
                side: 'right'
            } )
        }

        switch (this.data.dialogues[this.actualDialogue].dialogue[this.diagStep].type) {
            case "quizz":
                this.bubble.question = new Question(this.data.dialogues[this.actualDialogue].dialogue[this.diagStep])
                this.bubble.setupQuizz()
                break;
        
            default:
                this.bubble.state = "text"
                break;
        }

        this.updateBackground()
    }

    updateBackground(name) {
        if ( name ){
            this.background = BACKGROUND.get(name)
        } else if ( this.data.dialogues[this.actualDialogue].dialogue[this.diagStep].background ){
            this.background = BACKGROUND.get(this.data.dialogues[this.actualDialogue].dialogue[this.diagStep].background)
        } else if ( this.data.dialogues[this.actualDialogue].background ){
            this.background = BACKGROUND.get(this.data.dialogues[this.actualDialogue].background)
        } else if ( this.data.background ){
            this.background = BACKGROUND.get(this.data.background)
        }

        this.background = new Sprite({
            resource: this.background,
            size: new Vector2(this.canvas.width, this.canvas.height)
        })
    }

    draw(ctx, x, y) {
        if ( this.status == READY ) {
            this.background.draw(ctx, 0, 0)
        } else if ( this.status == STARTED ) {
            this.background.draw(ctx, 0, 0)
            this.bubble.draw(ctx, 0, 0)
        }
    }

    nextTalk() {
        if ( this.data.dialogues[this.actualDialogue].dialogue.length <= this.diagStep + 1 ){
            if ( this.data.dialogues[this.actualDialogue].next ) {
                this.actualDialogue = this.data.dialogues[this.actualDialogue].next
                this.updateDialogue()
            }
        } else {
            this.updateBubble(this.diagStep + 1)
        }
    }

    checkClick({mouseX, mouseY}){
        this.start()
    }

}