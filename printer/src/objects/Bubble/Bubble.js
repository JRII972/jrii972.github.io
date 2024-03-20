import {Vector2} from "../../Vector2.js";
import { resources, wordResources } from "../../Resource.js";
import { GameObject } from "../../GameObject.js";
import { FillText, TextObject } from "../../TextObject.js";
import { Sprite } from "../../Sprite.js";
import { ON_CLIC, events } from "../../Events.js";
import { Question } from "../../helpers/QuizzHelper.js";
import { readYaml } from "../../helpers/Yaml.js";
import { Animations } from "../../Animations.js";

export class Bubble extends GameObject{
  constructor({
      text,
      title, 
      canvas, 
      height, 
      width, 
      position = null,
      fillStyle = null,
      lineWidth = null,
      strokeStyle = null,
      name = "New Sprite",
      checkHover = false,
      radius = 30,
      side = 'left',
      textColor = "black",
      state,
      question,
      dialogue, personne,
    }) {

    super({
      name,
      checkHover,
      scale: 1
    });
    
    this.text = text;
    this.title = title;
    this.canvas = canvas
    this.textColor = textColor
    
    this.width = height;  
    this.height = width;

    this.fillStyle = fillStyle
    this.lineWidth = lineWidth
    this.strokeStyle = strokeStyle
    this.radius = radius
    this.side = side
    this.anwser = []
    this.textAnimation = new Animations({ sec: 3 })

    this.state = state ?? "text"
    this.dialogue = dialogue
    this.question = question 
    // new Question({
    //     "id" : 1,
    //     "question" : "4% des gaz à effet de serre du monde sont émis par le numérique. D’ici 2025, les prévisions estiment que le numérique représentera…",
    //     "type"  : "Informatique",
    //     "image" : "https://greenmetrics.io/wp-api/wp-content/uploads/2023/08/Illu-1-12-Quizz-La-pollution-numerique.jpg",
    //     "réponse" : [
    //         {
    //             "text" : "5 % des émissions de gaz à effet de serre mondiales"
    //         },
    //         {
    //             "text" : "6,5% des émissions de gaz à effet de serre mondiales"
    //         },
    //         {
    //             "text" : "8% des émissions de gaz à effet de serre mondiales",
    //             "réponse" : true,
    //             "value" : 5
    //         }
    //     ] ,
    //     "content" : "Si actuellement le numérique émet environ 4% des gaz à effet de serre dans le monde, les projections suggèrent que cette proportion augmentera à mesure que la technologie et l'utilisation des appareils numériques continuent de croître. Les estimations pour l'avenir varient en fonction de divers facteurs tels que l'adoption de technologies plus efficaces sur le plan énergétique, les politiques gouvernementales, les changements dans les comportements des consommateurs, etc. <br/> Certains rapports et études suggèrent que la part des émissions de gaz à effet de serre attribuables au numérique pourrait augmenter significativement d'ici là, peut-être atteindre 8% à 10% ou même plus, selon les scénarios et les tendances observées."
    // })

    
    this.personne = personne ?? new Sprite({
        resource: resources.images.anne,
        frameSize: new Vector2(1024,1024)
    })
    
    
    
    this.update({width, height})
    this.initOnClick()
   
  }

  update({width, height, position, side, reset = false}){

    this.width = height ?? this.width;  
    this.height = width ?? this.height;
    this.side = side ?? this.side ?? 'left'
    
    if ( 
       ( (this.height == undefined) &&
        (this.width == undefined) ) || reset
    ){
        this.height = this.canvas.height * .35
        this.width = this.canvas.width * .8
    } 

    if ( this.personne ){
        this.personne.scale = this.height / this.personne.frameSize.x 

        if ( ! this.personne.resource ) {
            this.width = this.canvas.width - 10
        }
        
    } else {
        this.width = this.canvas.width - 10
    }

    switch (this.side) {
        case 'left':
            this.position = position ?? new Vector2(
                this.canvas.width - this.width -5
                , this.canvas.height - this.height - 5);
            this.personne.position = new Vector2(
                0,
                0
            )
            break;
    
        default:
            this.position = position ?? new Vector2(
                5
                , this.canvas.height - this.height - 5);
            this.personne.position = new Vector2(
                this.width + 5,
                0
            )
            break;
    }

    

    this.marginText = this.canvas.height * 0.04 + this.lineWidth
    this.updateText(this.text)
    this.updateTitle(this.title)
  }

  updateText(text) {
    this.text = text ?? this.text ;
    if ( this.state == "quizz" ) {
        this.textAnimation = undefined
        this.textObject = new FillText({
            text: this.text,
            position: new Vector2(
                this.marginText,
                this.marginText * 1.5
            ),
            maxWidth: this.width - this.marginText * 1.5,
            wrapText: true,
            font: this.canvas.height * 0.025 + "px Aptos",
            maxLine: 4,
            startLine: 0,
            fillStyle: this.textColor,
            animation: this.textAnimation
        })
    }else{
        this.textAnimation = new Animations({ sec: this.text.length * 0.03 })
        this.textObject = new FillText({
            text: this.text,
            position: new Vector2(
                this.marginText,
                this.marginText * 2
            ),
            maxWidth: this.width - this.marginText * 2.5,
            wrapText: true,
            font: this.canvas.height * 0.03 + "px Aptos",
            maxLine: 4,
            startLine: 0,
            fillStyle: this.textColor,
            animation: this.textAnimation
        })
    }
  }

  updateTitle(title) {
    this.title = title;

    this.titleObject = new FillText({
        text: this.title,
        position: new Vector2(
            this.marginText,
            this.marginText * .5
        ),
        trim: false,
        maxWidth: this.width - this.marginText * 2,
        font: this.canvas.height * 0.035 + "px Aptos bold", //TODO: FIX font
        maxLine: 4,
        startLine: 0,
        underline: true,
        fillStyle: this.textColor
    })

  }

  addAnwser(gameObject) {
    gameObject.parent = this;
    this.anwser.push(gameObject);
  }

  setupDialog() {

  }

  setupQuizz() {
    this.state = "quizz"
    this.updateText( this.question.text )
    this.updateTitle(this.question.question ?? this.title ?? "Question : ");
    this.anwser.forEach((anwser) => {
        events.unsubscribe(anwser)
    })
    this.anwser = []
    
    this.question.réponse.forEach((réponse, i) => {
        let text = réponse.text
        let anwser = new FillText({
            text: "▶ " + text,
            position: new Vector2(
                this.marginText * 2,
                this.marginText * 1.5
            ),
            // maxWidth: this.width - this.marginText * 2,
            wrapText: true,
            font: this.canvas.height * 0.03 + "px Aptos bold", //TODO: FIX font
            maxWidth: this.width - this.marginText * 3,
            surlignageStyle: "#1B4079",
            fillStyle: "#1B4079"
        })
        anwser.id = réponse.id
        anwser.onClick = function() { 
            if ( this.parent ){
                this.parent.OnSelectItem(this.id)
            }
        };
        // anwser.onHover = function() { 
        //     if ( this.parent ){
        //         this.parent.OnSelectItem(this.id)
        //         console.log()
        //     }
        // };
        this.addAnwser(anwser)
        anwser.initOnClick()
    });

    this.anwser.forEach((anwser) => {
        // child.initOnHover()
    });

    var BTNContinuer = new FillText({
        text: "Continuer",
        textAlign: "end", fillStyle: "#1B4079",
        font: this.canvas.height * 0.035 + "px Aptos",
        surlignageStyle: "#1B4079",
        position: new Vector2(
            this.width - this.marginText, this.height - this.marginText
        )
    })
    BTNContinuer.onHover = function() { 
        this.surlignage = true
        this.fillStyle = "#B4E1FF"
    };
    BTNContinuer.loseHover = function() { 
        this.surlignage = false
        this.fillStyle = "#1B4079"
    };
    BTNContinuer.onClick = function() { 
        if ( this.parent ){
            this.parent.valideQuizz()
        }
        this.surlignage = ! this.surlignage
    };
    events.unsubscribeFromEvent(this, ON_CLIC)
    this.initOnClick()

    BTNContinuer.initOnClick()
    BTNContinuer.initOnHover()
    this.addChild(BTNContinuer)

  }

  OnSelectItem(id) {
    this.anwser.forEach((anwser) => {
        if ( anwser.id == id ) {
            anwser.surlignage = ! anwser.surlignage
            // if ( this.question.bonneRéponseID == id ){ console.log("bonne réponse") }
        } else {
            anwser.surlignage = false
        }

        if ( anwser.surlignage ){
            anwser.fillStyle = "#B4E1FF"
        } else {
            anwser.fillStyle = "#1B4079"
        }
        
    });
  }

  step(delta) {
    if (!this.animations) {
      return;
    }
    this.animations.step(delta);
    this.frame = this.animations.frame;
  }

  drawImage(ctx, x, y) {


    if ( this.strokeStyle ){ ctx.strokeStyle = this.strokeStyle }
    if ( this.lineWidth ){ ctx.lineWidth = this.lineWidth }
    if ( this.fillStyle ){ ctx.fillStyle = this.fillStyle }

    ctx.beginPath();
    ctx.roundRect(
        x, 
        y, 
        this.width, 
        this.height, 
        [this.radius]);
    if ( this. fillStyle ){ 
        ctx.fill()
        if ( this.lineWidth > 0 ){
            ctx.beginPath();
            ctx.roundRect(
                x,
                y,
                this.width, 
                this.height, 
                [this.radius]);
            ctx.stroke();
        }
    } else { 
        ctx.stroke();
    }

    switch (this.state) {
        case "quizz":
            this.drawQuizz(ctx, x, y)
            break;
    
        default:
            this.drawText(ctx, x, y)
            break;
    }

    this.personne.draw(ctx, 0, y)
  }

  drawText(ctx, x, y){
    this.titleObject.draw(ctx, x,y)
    this.textObject.draw(ctx, x,y)
    this.textAnimation.start()
  }
  
  drawQuizz(ctx, x, y) {
    this.titleObject.draw(ctx, x,y)
    this.textObject.draw(ctx, x,y)
    var space = (this.textObject.height + this.textObject.lineHeight *.5) ?? 0
    this.anwser.forEach((anwser) => {
        anwser.draw(ctx, x , y + space)
        space += anwser.height + this.textObject.lineHeight *.2
    });
  }

  checkAnwser() {
    let a = null

    for (const anwser of this.anwser) {
        for (const _anwser of this.question.réponse) {
            if (anwser.surlignage && (anwser.id == _anwser.id)) {
                if ( _anwser.next ) {
                    this.dialogue.updateDialogue(_anwser.next.random())
                }
                return _anwser
            }
        }
    }
    this.anwser.forEach((anwser) => {
        this.question.réponse.forEach((_anwser) => {

        })
        if ( (this.question.bonneRéponseID == anwser.id) && (anwser.surlignage) ){
            a = true
        } 
        if ( (a == null) && anwser.surlignage) {
            a = false
        }
    })
    return a
  }

  valideQuizz() {
    if ( this.state == "quizz" ) {
        switch (this.checkAnwser().good) {
            case true:
            case false:
                this.state = "anwser"
                if ( this.question.conten ) {
                    this.updateText(this.question.content)
                } else if (this.checkAnwser().next) {
                    //
                } else {
                    this.dialogue.nextTalk()
                }
                this.children = []
                break;
        
            default:
                console.log("pas de réponse");
                break;
        }
    }
  }

  checkClick(){
    this.onClick()
  }

  onClick() {
    if ( this.state == "quizz" ) {
        // switch (this.checkAnwser()) {
        //     case true:
        //     case false:
        //         // this.state = "anwser"
        //         // this.updateText(this.question.content)
        //         break;
        
        //     default:
        //         console.log("pas de réponse");
        //         break;
        // }
    } else if ( this.state == "anwser" ) {
        this.dialogue.nextTalk()
    } else {
        if ( !this.textObject.nextSection() ) {
            if ( this.dialogue ) {
                this.dialogue.nextTalk()
            }
        }
    }
  } 

}


console.log(await readYaml('./public/yaml/dialogue.yaml'))