// import {resources} from "./src/Resource.js";
// import {Sprite} from "./src/Sprite.js";
// import {Vector2} from "./src/Vector2.js";
// import {GameLoop} from "./src/GameLoop.js";
// import {Input} from "./src/Input.js";
// import {gridCells} from "./src/helpers/grid.js";
// import {GameObject} from "./src/GameObject.js";
// import {Hero} from "./src/objects/Hero/Hero.js";
// import {Camera} from "./src/Camera.js";
// import {Rod} from "./src/objects/Rod/Rod.js";
// import {Inventory} from "./src/objects/Inventory/Inventory.js";
import {Word} from "./src/objects/Word/Word.js";

function draw() {
    const canvas = document.getElementById("tutorial");
    if (canvas.getContext) {
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "rgb(200 0 0)";
      ctx.fillRect(10, 10, 50, 50);

      ctx.fillStyle = "rgb(0 0 200 / 50%)";
      ctx.fillRect(30, 30, 50, 50);

        const background = new Image()
        background.onload = () => {
            ctx.save();
            ctx.drawImage(background, 0, 0, 2048, 1024);                
            ctx.restore();
        };
        background.src = "./background_v1.png";

        const printer = new Image()
        printer.onload = () => {                
            ctx.save();
            ctx.drawImage(printer, 0, 0, 80, 80);
            ctx.restore();
        };
        printer.src = "./printer.png";


    //   ctx.drawImage(img, 0, 0);
    }
  }
  window.addEventListener("load", draw);