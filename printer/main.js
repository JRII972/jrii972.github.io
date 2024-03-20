// import './style.css'
import {resources, wordResources} from "./src/Resource.js";
import {Sprite} from "./src/Sprite.js";
import {Vector2} from "./src/Vector2.js";
import {GameLoop} from "./src/GameLoop.js";
import {Input} from "./src/Input.js";
import {gridCells} from "./src/helpers/grid.js";
import {GameObject} from "./src/GameObject.js";
import {Hero} from "./src/objects/Hero/Hero.js";
import {Camera} from "./src/Camera.js";
import {Rod} from "./src/objects/Rod/Rod.js";
import {Inventory} from "./src/objects/Inventory/Inventory.js";
import { ON_CLIC, ON_HOVER, SCREENRESIZE, events } from "./src/Events.js";
import { WordInterface } from './src/objects/Word/Word.js'
import { GameRender } from "./src/GameRender.js";
import { Bubble } from "./src/objects/Bubble/Bubble.js";
import { Dialogue } from "./src/objects/Bubble/Dialogue.js";

Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}


// Grabbing the canvas to draw to
const splash = document.getElementById('game-splash');
const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth
canvas.height = window.innerHeight

addEventListener("resize", (event) => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  events.emit(SCREENRESIZE, {
    width : window.innerWidth,
    height : window.innerHeight,
  })
});

// Establish the root scene
const mainScene = new GameObject({
  position: new Vector2(0,0)
})


const gameRender = new GameRender(canvas)

// mainScene.addChild(WordMenuTest);

const inventory = new Inventory();


// Add an Input class to the main scene
mainScene.input = new Input();

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


const d = new Dialogue({
  dialogueJson: './public/scénario/service informatique.json',
  canvas: canvas
})

// d.init()

// Establish update and draw loops
const update = (delta) => {
  mainScene.stepEntry(delta, mainScene)

  
};
const draw = () => {

  // Clear anything stale
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the sky

  // Save the current state (for camera offset)
  // ctx.save();

  // //Offset by camera position

  // // Draw objects in the mounted scene
  // // Restore to original state
  // ctx.restore();
  
  // Draw anything above the game world
  gameRender.draw(ctx, 0, 0)

  // // const ctx = canvas.getContext("2d");
  // ctx.fillStyle = "rgb(200 0 0)";
  // ctx.fillRect(10, 10, 50, 50);

  // ctx.fillStyle = "rgb(0 0 200 / 50%)";
  // ctx.fillRect(30, 30, 50, 50);

  d.draw(ctx, 0, 0)

}

// Start the game!
const gameLoop = new GameLoop(update, draw);
gameLoop.start();

async function setupGame(dialogueJson) {
  const data = await fetch(dialogueJson)
      .then(response => {
          if (!response.ok) {
              throw new Error("HTTP error " + response.status);
          }
          return response.json();
      })
  
  data.forEach(dialogue => {
    // <div class="games">
    //     <div class="title">NOM DU JEU</div>
    //     <hr>
    //     <div class="description">
    //        <p>Proident aliqua Lorem magna ea. Amet sint quis id qui eu. Ipsum aliquip dolor consectetur pariatur officia magna. Sit amet proident pariatur velit commodo pariatur pariatur elit veniam ex mollit magna laboris ut.
    //       </p>
    //     </div>
    //   </div>
    let game = document.createElement('div')
    game.classList.add('games')
    let title = document.createElement('div')
    title.classList.add('title')
    title.append(dialogue.nom)
    game.appendChild(title)
    game.appendChild(document.createElement('hr'))
    let description = document.createElement('div')
    description.classList.add('description')
    description.append(dialogue.description);
    game.appendChild(description)
    game.appendChild(document.createElement('hr'))
    dialogue.auteurs.forEach(_a => {
      let auteur = document.createElement('div')
      auteur.classList.add('auteur')
      auteur.append(_a)
      game.appendChild(auteur)
    })
    game.onclick = function () {
      startGame(dialogue.file)
    }
    document.getElementsByClassName('game-holder')[0].appendChild(game);
  });
}

async function startGame(file) {
  splash.style.display = 'none'
  canvas.style.display = 'block'
  console.log(file)
  d.dialogueJson = file
  await d.init()
  d.start()
} 

setupGame('./public/scénario/dialogues.json')