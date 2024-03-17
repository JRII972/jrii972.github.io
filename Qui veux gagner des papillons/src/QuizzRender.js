import { Question } from "./QuizzEngine.js";
import { resources } from "./Resource.js";
import { Sprite } from "./Sprite.js";
import { TextObject } from "./TextObject.js";
import { Vector2 } from "./Vector2.js";

export class QuizzRender {
    constructor(question) {
        this.question = question 
        this.random = Math.floor(Math.random() * 100)
        this.background = new Sprite({
          resource: resources.images.fond,
          frameSize: new Vector2(1024, 768)
        })
      }
      
    update(question){
      this.random = Math.floor(Math.random() * 100)
      this.question = question
    }

    draw(ctx) {
      this.background.draw(ctx, 0, 0)
        const text = new TextObject({
            maxWidth:800,
            wrapText:true,
            text: 'All the world\'s a stage, and all the men and women merely players. They have their exits and their entrances; And one man in his time plays many parts.',
            font: '15pt Calibri',
            fillStyle: '#FFF',
            textAlign: "center"
          })
          
        this.drawAnwser(ctx, 0)
        this.drawAnwser(ctx, 1)
        this.drawAnwser(ctx, 2)
        this.drawAnwser(ctx, 3)

        text.draw(ctx, 510, 304)
    }

    drawAnwser(ctx, n){
      if ( this.question.réponse.length > n ){
        var _i = ['A:', 'B:', 'C:', 'D:']
        let q = new TextObject({
          text: _i[n],
          font: '15pt Calibri',
          fillStyle: "#FFC300"
        })
        let text = new TextObject({
            text: this.question.réponse[n].text,
            font: '15pt Calibri',
            fillStyle: "#FFF",
            maxWidth: 800,
            trim: false
          })

        
        q.draw(ctx, 100, 437 + n*93)
        text.draw(ctx, 120, 437 + n*93)
      } else if ((n == 3) && (this.random < 10)){
        let q = new TextObject({
          text: "D:",
          font: '15pt Calibri',
          fillStyle: "#FFC300"
        })
        let text = new TextObject({
            text: "La réponse D",
            font: '15pt Calibri',
            fillStyle: "#FFF",
            maxWidth: 800,
            trim: false
          })
        q.draw(ctx, 100, 437 + n*93)
        text.draw(ctx, 120, 437 + n*93)
      }
    }

}