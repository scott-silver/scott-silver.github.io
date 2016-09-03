(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
TILE_CLASS = 'tile';
TILE_GREY_CLASS = 'tile--grey';

var Board = function(options) {
  this.dimension = 50;
  this.element = options.element;
}

Board.prototype.build = function() {
  for (var i = 0; i < this.dimension; i++) {
    var row = document.createElement('div');
    row.classList.add('row');
    for (var j = 0; j < this.dimension; j++) {
      var tile = document.createElement('div');
      tile.classList.add(TILE_CLASS);
      row.appendChild(tile);
    }
    this.element.appendChild(row);
  }
}

Board.prototype.clear = function() {
  var tiles = document.getElementsByClassName(TILE_GREY_CLASS);
  console.log(tiles.length);
  for (var i = 0; i < tiles.length; i++) {
    tiles[i].classList.remove(TILE_GREY_CLASS);
  }
}

Board.prototype.addStartButton = function(startFunction) {
  var button = document.createElement('button');
  button.classList.add('start-button');
  button.innerHTML = "Start";
  button.onclick = function() {
    button.parentElement.removeChild(button);
    startFunction();
  }
  this.element.appendChild(button);
}

Board.prototype.render = function(renderableObject) {
  var that = this;
  renderableObject.coordinates.forEach(function(coordinate) {
    that.addClassToCoordinate(coordinate.x, coordinate.y, TILE_CLASS + '--' + coordinate.color);
  });
}

Board.prototype.addClassToCoordinate = function(x, y, className) {
  var elementIndex = (this.dimension * ((this.dimension) - y)) - (this.dimension - x);
  document.getElementsByClassName(TILE_CLASS)[elementIndex].classList.add(className);
}

module.exports = Board;

},{}],2:[function(require,module,exports){
var Board = require('./board.js');
var Snake = require('./snake.js');

STEP_INTERVAL = 100;

window.SnakeGame = function(element) {
  this.board = new Board({
    element: element
  });
  this.snake = new Snake();
}

SnakeGame.prototype.setup = function() {
  this.board.build();
  this.addEventListeners();
  this.addStartButton();
}

SnakeGame.prototype.addEventListeners = function() {
  document.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
      case 37:
        event.preventDefault();
        this.snake.changeDirection('w');
        break;
      case 38:
        event.preventDefault();
        this.snake.changeDirection('n');
        break;
      case 39:
        event.preventDefault();
        this.snake.changeDirection('e');
        break;
      case 40:
        event.preventDefault();
        this.snake.changeDirection('s');
        break;
    }
  }.bind(this));
}

SnakeGame.prototype.addStartButton = function() {
  this.board.addStartButton(this.start.bind(this));
}

SnakeGame.prototype.start = function() {
  setInterval(this.step.bind(this), STEP_INTERVAL);
}

SnakeGame.prototype.step = function() {
  this.board.clear();
  this.advanceBoardItems();
  this.renderBoardItems();
}

SnakeGame.prototype.advanceBoardItems = function() {
  this.snake.advance();
}

SnakeGame.prototype.renderBoardItems = function() {
  this.board.render(this.snake);
}

},{"./board.js":1,"./snake.js":3}],3:[function(require,module,exports){
DIRECTION_NORTH = 'n';
DIRECTION_EAST = 'e';
DIRECTION_SOUTH = 's';
DIRECTION_WEST = 'w';

var Snake = function() {
  this.direction = DIRECTION_NORTH;
  this.coordinates = [
    {x: 0, y: 2, color: 'grey'},
    {x: 0, y: 1, color: 'grey'},
    {x: 0, y: 0, color: 'grey'}
  ];
}

Snake.prototype.changeDirection = function(direction) {
  this.direction = direction;
}

Snake.prototype.advance = function() {
  var lastCoordinate = this.coordinates[0];
  var newCoordinate = {};
  newCoordinate.color = 'grey'
  switch (this.direction) {
    case DIRECTION_NORTH:
      newCoordinate.x = lastCoordinate.x;
      newCoordinate.y = lastCoordinate.y + 1;
      break;
    case DIRECTION_EAST:
      newCoordinate.x = lastCoordinate.x + 1;
      newCoordinate.y = lastCoordinate.y;
      break;
    case DIRECTION_SOUTH:
      newCoordinate.x = lastCoordinate.x;
      newCoordinate.y = lastCoordinate.y - 1;
      break;
    case DIRECTION_WEST:
      newCoordinate.x = lastCoordinate.x - 1;
      newCoordinate.y = lastCoordinate.y;
      break;
  }
  this.coordinates.unshift(newCoordinate);
  this.coordinates.pop();
}

module.exports = Snake;

},{}]},{},[2]);
