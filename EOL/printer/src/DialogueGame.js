import {resources, wordResources} from "./Resource.js";
import {Sprite} from "./Sprite.js";
import {Vector2} from "./Vector2.js";
import {GameLoop} from "./GameLoop.js";
import {Input} from "./Input.js";
import {gridCells} from "./helpers/grid.js";
import {GameObject} from "./GameObject.js";
import {Hero} from "./objects/Hero/Hero.js";
import {Camera} from "./Camera.js";
import {Rod} from "./objects/Rod/Rod.js";
import {Inventory} from "./objects/Inventory/Inventory.js";
import { ON_CLIC, ON_HOVER, SCREENRESIZE, events } from "./Events.js";
import { WordInterface } from './objects/Word/Word.js'
import { GameRender } from "./GameRender.js";
import { Bubble } from "./objects/Bubble/Bubble.js";
import { Dialogue } from "./objects/Bubble/Dialogue.js";

export class DialogueGame {
    constructor() {
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


        const bubble = new Bubble({
        text : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        canvas: canvas,
        title: "Boubamda",
        strokeStyle: "#B4E1FF",
        fillStyle: "#FFF1D7",
        lineWidth: 5,
        textColor: "#1B4079",
        })

        const d = new Dialogue({
        dialogueJson: './public/scénario/service informatique.json',
        canvas: canvas
        })

        d.init()

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
    }
}