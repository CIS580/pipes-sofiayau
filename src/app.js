"use strict";

/* Classes */
const Game = require('./game');
const Pipe = require('./pipe');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var image = new Image();
image.src = 'assets/pipes.png';
var backgroundMusic = new Audio();
backgroundMusic.src = 'assets/backgroundMusic.mp3'
var connect = new Audio();
connect.src = 'assets/connect.wav';
var disconnect = new Audio();
disconnect.src = 'assets/disconnect.wav';
var win = new Audio();
win.src = "assets/win.wav";
var lose = new Audio();
lose.src = "assets/lose.wav";

var score = 0;
var level = 1;
var state = "waiting for connect";

var startPipe = new Pipe({x:10, y:79},'assets/startPipe.png',0);
var endPipe = new Pipe({x: canvas.width - 50, y:79},'assets/endPipe.png',0);
var currentPipe = new Pipe({x: 10 ,y:10},'assets/pipes.png',0);

var pipes = [];
currentPipe.start = true;

var rotateX, rotateY;
var startX, startY;
var currentX, currentY, currentIndex;

backgroundMusic.play();

//left-clicking
canvas.onclick = function(event) {
  event.preventDefault();
  var x = Math.floor((event.clientX + 3)/75);
  var y = Math.floor((event.clientY + 3)/75);
  currentX = event.offsetX;
  currentY = event.offsetY;

  var tempX = x * 75 + 8;
  var tempY = y * 75 + 8;
  switch(state){
    case "waiting for connect":
      pipes.forEach(function(pipes){
        if(pipes.x == tempX && pipes.y == tempY){
          state = 'disconnected';
        }
      });
      case "connected":
        backgroundMusic.pause();
        connect.play();
        currentPipe.x = tempX;
        currentPipe.y = tempY;
        pipes.push(new Pipe({
          x:currentPipe.x,
          y:currentPipe.y
        },'assets/curvePipe.png',0));
        score += 100;
        //level ++;

    }

  // TODO: Place or rotate pipe tile
}


//Right-clicking
canvas.oncontext

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {

  // TODO: Advance the fluid
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.fillStyle = "#777777";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for(var y =0; y < 12; y++){
    for(var x = 0; x < 16; x++){
      ctx.fillStyle = "lightblue";
      ctx.fillRect(x * 75 + 3, y * 75 + 3, 69,69);
    }
  }
  ctx.fillStyle = "black";
  ctx.fillText("Score:"+score, 100,20);
  ctx.fillText("Level:"+level, 10, 20);

  // TODO: Render the board
  startPipe.render(elapsedTime,ctx);
  endPipe.render(elapsedTime, ctx);
  currentPipe.render(elapsedTime, ctx);
  pipes.forEach(function(pipe){
    pipe.render(elapsedTime,ctx);
  });
}
