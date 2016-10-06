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
  this.curve = false;
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
