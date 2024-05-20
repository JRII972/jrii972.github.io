// import './style.css'
import {resources} from "./src/Resource.js";
import {Sprite} from "./src/Sprite.js";
import {Vector2} from "./src/Vector2.js";
import {GameLoop} from "./src/GameLoop.js";
import {Input} from "./src/Input.js";
import {GameObject} from "./src/GameObject.js";
import { events } from "./src/Events.js";
import { TextObject } from "./src/TextObject.js";
import { QuizzRender } from "./src/QuizzRender.js"
import { QuizzEngine } from "./src/QuizzEngine.js";
import { Animations } from "./src/Animations.js";

// Grabbing the canvas to draw to
const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");


// Build up the scene by adding a sky, ground, and hero

//{ text, position, font, textAlign, textBaseline, direction, fillStyle, strokeStyle }
const t = new QuizzEngine({
})

const anime = new Animations({
  startPosition: new Vector2(80,80), startScale: 0.1, 
  endPosition: new Vector2(580, 80), endScale: 0.1, 
  object: new Sprite({
    resource: resources.images.icon,
    frameSize: new Vector2(974,974)
  }),
  sec: 10
})

canvas.onmousemove = function(e) {
  var r = canvas.getBoundingClientRect(),
      x = e.clientX - r.left, y = e.clientY - r.top;
  events.emitOnHover({
    mouseX : x, mouseY : y, boundingClientRect: r, toFalse: false
  })
}
canvas.onclick = function(e) {
  var r = canvas.getBoundingClientRect(),
  x = e.clientX - r.left, y = e.clientY - r.top;
  events.emitOnClick({
    mouseX : x, mouseY : y
  })
};

// Establish update and draw loops
const update = (delta) => {
};  

const draw = () => {

  // Clear anything stale
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the sky
  t.draw(ctx)
  anime.draw(ctx)
  // Save the current state (for camera offset)
  ctx.save();

  // Restore to original state
  ctx.restore();

  // // const ctx = canvas.getContext("2d");
  // ctx.fillStyle = "rgb(200 0 0)";
  // ctx.fillRect(10, 10, 50, 50);

  // ctx.fillStyle = "rgb(0 0 200 / 50%)";
  // ctx.fillRect(30, 30, 50, 50);

}

// Start the game!
const gameLoop = new GameLoop(update, draw);
gameLoop.start();
