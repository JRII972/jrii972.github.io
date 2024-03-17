import {Vector2} from "../../Vector2.js";
import { HoverHelper } from "../../helpers/HoverHelper.js";


export class ArrowBottom extends HoverHelper {
    constructor({ scale, position}) {
        super({});
        this.scale = scale ?? 1;
        this.position = position ?? new Vector2(0,0)
      }


    draw(ctx, x, y) {
        this.drawPosX = x + this.position.x;
        this.drawPosY = y + this.position.y;
        ctx.beginPath();
        ctx.moveTo(this.drawPosX, this.drawPosY);
        ctx.lineTo(this.drawPosX + 10 * this.scale , this.drawPosY + 10 * this.scale);
        ctx.lineTo(this.drawPosX + 20 * this.scale, this.drawPosY);;
        ctx.lineWidth = 2 * this.scale;
        ctx.stroke();
      }

      checkHover({mouseX, mouseY, toFalse}) {
        this.isHovered = false
        if (toFalse) {
          this.isHovered = false
        }
        if (this.isHovered) {
          this.onHover()
        }
    }

}
