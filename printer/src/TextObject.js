import { Animations } from "./Animations.js";
import {Vector2} from "./Vector2.js";
import { Clickable } from "./helpers/HoverHelper.js";
import { measureText } from "./helpers/helper.js";

export class TextObject extends Clickable {
    constructor({ text, position, font, textAlign, textBaseline, direction, fillStyle, strokeStyle, lineHeight, maxWidth, maxLine, startLine = 0, underline = false, surlignage, surlignageStyle, trim = true, wrapText = false, animation}) {
        super({
          checkHover: false
        });
        this.text = text ??  "Hello World"
        this.position = position ?? new Vector2(0, 0);
        this.font = font ?? "48px serif";
        this.textAlign = textAlign ?? "start";
        this.textBaseline = textBaseline ?? "top";
        this.direction = direction ?? "ltr";
        this.fillStyle = fillStyle ?? "black"
        this.strokeStyle = strokeStyle ?? "black"
        this.underline = underline
        this.maxLine = maxLine
        this.maxWidth = maxWidth
        this.trim = trim
        this.wrapText = wrapText
        this.startLine = startLine
        this.stopNextSection = false
        this.surlignage = surlignage
        this.surlignageStyle = surlignageStyle
        this.animation = animation
        this._text = this.text
        this.animationNewStep = 0;

        if ( lineHeight == undefined) {
          if ( this.font.includes("px") ) {
            this.lineHeight = parseInt(this.font.split("px")[0]) * 1.3
          } else {
            this.lineHeight = 25
          }
        }

        this.width = 0
        this.height = 0
      }


    draw(ctx, x, y) {
      this.drawPosX = x + this.position.x;
      this.drawPosY = y + this.position.y;

      if ( this.animation ) {
        this.animation.step()
        this.text = this._text.substr(0, this.animationNewStep + Math.round(this._text.length * this.animation.actualStep / this.animation.nbStep) )

        if ( this.animation.actualStep / this.animation.nbStep < 1 ) {
          this.stopNextSection = false
        }
      }

      if ( this.text == "" ) {
        this.width = 0
        this.height = 0
        return
      }

        ctx.font = this.font
        ctx.textAlign = this.textAlign
        ctx.textBaseline = this.textBaseline
        ctx.direction = this.direction
        ctx.strokeStyle = this.strokeStyle;
        ctx.fillStyle = this.fillStyle;
        // Do the actual rendering for Images
        if ( this.maxWidth ) {
          if ( this.wrapText ){
            var words = this.text.split(' ');
            var line = '';
            var actualLine = 0;
            for(var n = 0; n < words.length; n++) {
              var testLine = line + words[n] + ' ';
              var metrics = ctx.measureText(testLine);
              var testWidth = metrics.width;
              if (testWidth > this.maxWidth && n > 0) {
                if (actualLine >= this.startLine){
                  if ( metrics.width > this.width) { 
                    this.width = metrics.width
                  }
                  if ( this.underline ){ this.underlineText(ctx, this.drawPosX, this.drawPosY, line) }
                  if ( this.surlignage ){ this.surlignageText(ctx, this.drawPosX, this.drawPosY, line) }
                  this.drawText(ctx, line, this.drawPosX, this.drawPosY);
                  this.drawPosY += this.lineHeight;
                }
                actualLine += 1
                line = words[n] + ' ';
              }
              else {
                line = testLine;
              }
              
              if ( this.maxLine ){
                if ( this.drawPosY > (y + this.position.y + this.lineHeight * this.maxLine) ) {
                this.drawText(ctx, "...", this.drawPosX, this.drawPosY);
                this.drawPosX = x + this.position.x;
                this.drawPosY = y + this.position.y;
                this.animationNewStep = words.slice(0, n).join(' ').length;
                this.animation.ended = true
                return
                }
              }
            }
            
            actualLine += 1
            var metrics = measureText(ctx, this.text);
            if ( !actualLine ) { actualLine = 1 }
            if ( metrics.width > this.width) { 
              this.width = metrics.width
            }
            this.height = metrics.height * (actualLine-this.startLine) // + (this.lineHeight ?? 25) * (actualLine-this.startLine-1)
            if ( this.underline ){ this.underlineText(ctx, this.drawPosX, this.drawPosY, line) }
            if ( this.surlignage ){ this.surlignageText(ctx, this.drawPosX, this.drawPosY, line) }
            this.drawText(ctx, line, this.drawPosX, this.drawPosY);
            this.stopNextSection = true
            this.drawPosX = x + this.position.x;
            this.drawPosY = y + this.position.y;
            return;
          }
          
          
          if ( ctx.measureText(this.text).width > this.maxWidth ){
            let text = this.text
            while (ctx.measureText(text + '...').width > this.maxWidth){
              text = text.slice(0, -1);
              if ( text.length == 0 ){
                this.drawText(ctx, this.text, x, y, this.maxWidth);
              }
            }
            var metrics = measureText(ctx, text + '...');
            this.width = metrics.width
            this.height = metrics.height
            if ( this.underline ){ this.underlineText(ctx, this.drawPosX, this.drawPosY, text + '...') }
            if ( this.surlignage ){ this.surlignageText(ctx, this.drawPosX, this.drawPosY) }
            if ( this.trim ) {
              this.drawText(ctx, text + '...', this.drawPosX, this.drawPosY);
              return;
            } else {
              this.drawText(ctx, this.text, this.drawPosX, this.drawPosY, this.maxWidth);
              return;
            }
          }

        }
        var metrics = measureText(ctx, this.text);
        this.width = metrics.width
        this.height = metrics.height
        if ( this.underline ){ this.underlineText(ctx, this.drawPosX, this.drawPosY) }
        if ( this.surlignage ){ this.surlignageText(ctx, this.drawPosX, this.drawPosY) }
        this.drawText(ctx, this.text, this.drawPosX, this.drawPosY);
      }

    drawText(ctx, text, x, y, maxWidth){
    }

    surlignageText(ctx, x, y, text) {
      switch (this.textAlign) {
        case "end":
          var metrics = measureText(ctx, text ?? this.text);
          ctx.beginPath(); 
          ctx.fillStyle = this.surlignageStyle;
          ctx.rect(x + 5, y-metrics.height*.1, - metrics.width - 10, metrics.height); 
          ctx.fill();
          ctx.fillStyle = this.fillStyle;
          break;
      
        default:
          var metrics = measureText(ctx, text ?? this.text);
          ctx.beginPath(); 
          ctx.fillStyle = this.surlignageStyle;
          ctx.rect(x - 5, y, metrics.width + 10, metrics.height); 
          ctx.fill();
          ctx.fillStyle = this.fillStyle;
          break;
      }
    }

    underlineText(ctx, x, y, text) {
      let metrics = measureText(ctx, text ?? this.text)
      let fontSize = Math.floor(metrics.actualHeight * 1.4) // 140% the height 
      switch (ctx.textAlign) {
        case "center" : x -= (metrics.width / 2) ; break
        case "right"  : x -= metrics.width       ; break
        case "end"  : x -= metrics.width       ; break
      }
      switch (ctx.textBaseline) {
        case "top"    : y += (fontSize) *.85    ; break
        case "middle" : y += (fontSize / 2) ; break
      }
      
      ctx.save()
      ctx.beginPath()
      ctx.strokeStyle = ctx.fillStyle
      ctx.lineWidth = Math.ceil(fontSize * 0.08)
      ctx.moveTo(x, y)
      ctx.lineTo(x + metrics.width, y)
      ctx.stroke()
      ctx.restore()
    }

    checkHover({mouseX, mouseY, toFalse}) {
      this.isHovered = false
      if (toFalse) {
        this.isHovered = false
      } else if (!this.isHovered){
          switch (this.textAlign) {
            case "end":
              if (
                ((this.drawPosX - this.width ) < mouseX) && (mouseX < this.drawPosX) &&
                (this.drawPosY < mouseY) && ( mouseY < (this.drawPosY + this.height))
              ) {
                this.isHovered = true
              } 
              break;
          
            default:
              if (
                (this.drawPosX < mouseX) && (mouseX < (this.drawPosX + this.width )) &&
                (this.drawPosY < mouseY) && ( mouseY < (this.drawPosY + this.height))
              ) {
                this.isHovered = true
              } 
              break;
          }
      }
      if (this.isHovered) {
        this.onHover()
      } else {
        this.loseHover()
      }
    }

    loseHover() {

    }

    nextSection() {
      if ( this.animation ) {
        if ( !this.animation.ended ) {
          this.animation.actualStep = this.animation.nbStep
          this.stopNextSection = false
          return true
        }
      }
      if ( !this.stopNextSection) {
        this.startLine += this.maxLine 
        this.animation.reset() //TODO: animation not working with multiple step
        this.animation.start()
        return true
      }
      return false
    }
}

export class FillText extends TextObject {
    constructor({ text, position, font, textAlign, textBaseline, direction, fillStyle, strokeStyle, underline = false, maxWidth, trim = true, wrapText = false, lineHeight, surlignage = false, surlignageStyle, maxLine, startLine = 0, animation}) {
        super({ text, position, font, textAlign, textBaseline, direction, fillStyle, strokeStyle, lineHeight, maxWidth, maxLine, startLine, underline, surlignage, surlignageStyle, trim, wrapText, animation});
      }

    drawText(ctx, text, x, y, maxWidth){
        ctx.fillText(text, x, y, maxWidth);
    }
}
export class StrokeText extends TextObject {
    constructor({ text, position, font, textAlign, textBaseline, direction, fillStyle, strokeStyle, underline = false, maxWidth, trim = true, wrapText = false, lineHeight, surlignage = false, surlignageStyle, maxLine, startLine = 0, animation}) {
      super({ text, position, font, textAlign, textBaseline, direction, fillStyle, strokeStyle, lineHeight, maxWidth, maxLine, startLine, underline, surlignage, surlignageStyle, trim, wrapText, animation});
      }

    drawText(ctx, text, x, y, maxWidth){
        ctx.strokeText(text, x, y, maxWidth);
    }
}
