import { Animations } from "./Animations.js";
import { events } from "./Events.js";
import { QuizzRender } from "./QuizzRender.js";
import { resources } from "./Resource.js";
import { Sprite } from "./Sprite.js";
import { Vector2 } from "./Vector2.js";

class Réponse {
    constructor({text, réponse, value, id}){
        this.text = text
        this.réponse = réponse
        this.value = value
        this.id = id
    }
}

export class Question {
    constructor({
        id, question, type, réponse, content
    }){
        this.id = id
        this.question = question
        this.type = type
        this.réponse = []
        for (let index = 0; index < réponse.length; index++) {
            réponse[index].id = index;
            const element = new Réponse(réponse[index])
            this.réponse.push(element)
            if ( element.réponse ) {
                this.bonneRéponseID = index
            }
        }
    }
}

export class QuizzEngine {
    constructor({
        quizzRender
    }){
        this.actualQuestion = new Question({
            "id" : 1,
            "question" : "4% des gaz à effet de serre du monde sont émis par le numérique. D’ici 2025, les prévisions estiment que le numérique représentera…",
            "type"  : "Informatique",
            "image" : "https://greenmetrics.io/wp-api/wp-content/uploads/2023/08/Illu-1-12-Quizz-La-pollution-numerique.jpg",
            "réponse" : [
                {
                    "text" : "5 % des émissions de gaz à effet de serre mondiales"
                },
                {
                    "text" : "6,5% des émissions de gaz à effet de serre mondiales"
                },
                {
                    "text" : "8% des émissions de gaz à effet de serre mondiales",
                    "réponse" : true,
                    "value" : 5
                }
            ] ,
            "content" : "Si actuellement le numérique émet environ 4% des gaz à effet de serre dans le monde, les projections suggèrent que cette proportion augmentera à mesure que la technologie et l'utilisation des appareils numériques continuent de croître. Les estimations pour l'avenir varient en fonction de divers facteurs tels que l'adoption de technologies plus efficaces sur le plan énergétique, les politiques gouvernementales, les changements dans les comportements des consommateurs, etc. <br/> Certains rapports et études suggèrent que la part des émissions de gaz à effet de serre attribuables au numérique pourrait augmenter significativement d'ici là, peut-être atteindre 8% à 10% ou même plus, selon les scénarios et les tendances observées."
        })

        
        this.background = new Sprite({
            resource: resources.images.empty,
            frameSize: new Vector2(1024, 768)
          })
        this.animation = new Animations({})
        this.quizzRender = quizzRender ?? new QuizzRender(this.actualQuestion)
        this.quizzRender.update(this.actualQuestion)
        events.onClick(this, this.onClick)
    }

    onClick(_v){
        console.log(_v)
        if ( (_v.mouseX > 96) && (_v.mouseY > 419) && (_v.mouseX < (96+823)) && (_v.mouseY < (419+56))){
            console.log('BTNA')
            this.checkAnwser(0)
        }
        if ( (_v.mouseX > 96) && (_v.mouseY > 510) && (_v.mouseX < (96+823)) && (_v.mouseY < (510+56))){
            console.log('BTNB')
            this.checkAnwser(1)
        }
        if ( (_v.mouseX > 96) && (_v.mouseY > 603) && (_v.mouseX < (96+823)) && (_v.mouseY < (603+56))){
            console.log('BTNC')
            this.checkAnwser(2)
        }
        if ( (_v.mouseX > 96) && (_v.mouseY > 696) && (_v.mouseX < (96+823)) && (_v.mouseY < (696+56))){
            console.log('BTND')
            this.checkAnwser(3)
        }
    }

    draw(ctx) {
        this.animation.step()
        this.quizzRender.draw(ctx)
        ctx.globalAlpha = 0 + this.animation.actualStep/this.animation.nbStep;
        console.log(this.animation.actualStep/this.animation.nbStep)
        this.background.draw(ctx, 0,0)
        ctx.globalAlpha = 1;
    }

    checkAnwser(n){
        if ( this.actualQuestion.réponse[n].réponse ) {
            console.log("Bonne réponse")
            this.addPoint(this.actualQuestion.réponse[n].value)
        }else{
            console.log("Mauvaise réponse")
        }
        this.showAnwser()
    }

    addPoint(value){

    }

    showAnwser(){
        this.animation.updateSec(.3)
        this.animation.start()

    }

    nextQuestion(){
        this.actualQuestion = new Question({
            "id" : 2,
            "question" : "Les émissions du numérique sont…",
            "type"  : "Informatique",
            "image" : "https://greenmetrics.io/wp-api/wp-content/uploads/2023/08/Illu-2-12-Quizz-La-pollution-numerique.jpg",
            "réponse" : [
                {
                    "text" : "plus importantes que celles de l’aviation civile"
                },
                {
                    "text" : "moins importantes que celles de l’aviation civile",
                    "réponse" : true,
                    "value" : 2
                },
                {
                    "text" : "égales à celles de l’aviation civile"
                }
            ] ,
            "content" : "Actuellement, les émissions du numérique sont généralement inférieures à celles de l'aviation civile. Cependant, leur impact environnemental peut augmenter rapidement avec la croissance de la technologie numérique."
        })
        this.quizzRender.update(this.actualQuestion)
    }
}