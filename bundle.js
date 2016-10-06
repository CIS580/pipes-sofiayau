(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./game":2,"./pipe":3}],2:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],3:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Pipe class
 */
module.exports = exports = Pipe;
/**
 * @constructor Pipe
 * Creates a new pipe object
 * @param {Postition} position object specifying an x and y
 */
 function Pipe(position, spritesheet,frames){
  this.x = position.x;
  this.y = position.y;
  this.width  = 64;
  this.height = 64;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/pipes.png');
  this.timer = 0;
  this.frame = frames;

  var self = this;
  var speed = 1/16/1000;

  this.rotate = true;
  this.translate = false;
  this.start = false;
  this.end = false;
}

/**
 * @function updates the pipe object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Pipe.prototype.update = function(time) {

}

/**
 * @function renders the pipe into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
 Pipe.prototype.render = function(time, ctx) {
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 0, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
    );
  }

},{}]},{},[1]);
