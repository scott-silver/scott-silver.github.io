(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function randomNumberBelow(max) {
  return Math.floor(Math.random() * max);
}

COLLECTION_LENGTH = 5;

var AppleCollection = function(options) {
  this.maxIndex = options.maxIndex;
  this.coordinates = [];
  this.generateRandomApples();
}

AppleCollection.prototype.appleAtCoordinate = function(coordinate) {
  return this.coordinates.find(function(appleCoordinate) {
    return appleCoordinate.x == coordinate.x && appleCoordinate.y == coordinate.y;
  });
}

AppleCollection.prototype.removeApple = function(apple) {
  this.coordinates.splice(this.coordinates.indexOf(apple), 1);
}

AppleCollection.prototype.generateRandomApples = function() {
  while (this.coordinates.length < COLLECTION_LENGTH) {
    var randomApple = this.generateRandomApple();
    if (!this.appleAtCoordinate(randomApple)) {
      this.coordinates.push(randomApple);
    }
  }
}

AppleCollection.prototype.generateRandomApple = function() {
  return {
    x: randomNumberBelow(this.maxIndex),
    y: randomNumberBelow(this.maxIndex),
    color: 'red'
  }
}

module.exports = AppleCollection;

},{}],2:[function(require,module,exports){
TILE_CLASS = 'tile';
TILE_GREY_CLASS = 'tile--grey';
TILE_BLACK_CLASS = 'tile--black';
TILE_RED_CLASS = 'tile--red';

var Board = function(options) {
  this.dimension = 50;
  this.element = options.element;
  this.tiles = [];
}

Board.prototype.build = function() {
  for (var i = 0; i < this.dimension; i++) {
    var row = document.createElement('div');
    row.classList.add('row');
    var rowArray = [];
    for (var j = 0; j < this.dimension; j++) {
      var tile = document.createElement('div');
      tile.classList.add(TILE_CLASS);
      row.appendChild(tile);
      rowArray.push(tile);
    }
    this.element.appendChild(row);
    this.tiles.unshift(rowArray);
  }
}

Board.prototype.clear = function() {
  // Note: can be made more precise by taking a set of coordinates to clear
  // js array flattening: http://stackoverflow.com/a/10865042
  var tiles = [].concat.apply([], this.tiles).filter(function(tile) {
    return tile.classList.contains(TILE_GREY_CLASS) ||
           tile.classList.contains(TILE_BLACK_CLASS) ||
           tile.classList.contains(TILE_RED_CLASS);
  });
  for (var i = 0; i < tiles.length; i++) {
    tiles[i].classList.remove(TILE_GREY_CLASS);
    tiles[i].classList.remove(TILE_BLACK_CLASS);
    tiles[i].classList.remove(TILE_RED_CLASS);
  }
}

Board.prototype.addStartButton = function(startFunction) {
  var button = document.createElement('button');
  button.classList.add('start-button');
  button.classList.add('button');
  button.innerHTML = "Start";
  button.onclick = function() {
    button.parentElement.removeChild(button);
    startFunction();
  }
  this.element.appendChild(button);
  button.focus();
}

Board.prototype.render = function(renderableObject) {
  var that = this;
  renderableObject.coordinates.forEach(function(coordinate) {
    that.addClassToCoordinate(coordinate.x, coordinate.y, TILE_CLASS + '--' + coordinate.color);
  });
}

Board.prototype.addClassToCoordinate = function(x, y, className) {
  this.tiles[y][x].classList.add(className);
}

Board.prototype.displayEndScreen = function(options) {
  this.endScreen = document.createElement('div');
  this.endScreen.classList.add('message-box');
  var header = document.createElement('h2');
  header.innerHTML = 'Congrats!';
  this.endScreen.appendChild(header);
  var scoreDisplay = document.createElement('div');
  scoreDisplay.innerHTML = 'You ate ' + options.score + ' apples';
  this.endScreen.appendChild(scoreDisplay);
  var restartButton = document.createElement('button');
  restartButton.classList.add('button');
  restartButton.classList.add('restart-button');
  restartButton.innerHTML = 'Play Again?';
  restartButton.onclick = options.buttonCallback;
  this.endScreen.appendChild(restartButton);
  this.element.appendChild(this.endScreen);
  restartButton.focus();
}

Board.prototype.hideEndScreen = function() {
  this.element.removeChild(this.endScreen);
}

module.exports = Board;

},{}],3:[function(require,module,exports){
module.exports = {
  NORTH: 'n',
  EAST: 'e',
  SOUTH: 's',
  WEST: 'w'
}

},{}],4:[function(require,module,exports){
var Board = require('./board.js');
var Snake = require('./snake.js');
var Directions = require('./directions.js');
var AppleCollection = require('./apple-collection.js');
var ScoreKeeper = require('./score-keeper.js');

STEP_INTERVAL = 70;
BOARD_DIMENSION = 50;

window.SnakeGame = function(element) {
  this.board = new Board({
    element: element
  });
  this.scoreKeeper = new ScoreKeeper();
}

SnakeGame.prototype.setup = function() {
  this.board.build();
  this.addStartButton();
}

SnakeGame.prototype.addStartButton = function() {
  this.board.addStartButton(this.start.bind(this));
}

SnakeGame.prototype.start = function() {
  this.score = 0;
  this.snake = new Snake();
  this.appleCollection = new AppleCollection({
    maxIndex: BOARD_DIMENSION - 1
  });
  this.addEventListeners();

  this.gameLoop = setInterval(this.step.bind(this), STEP_INTERVAL);
}

SnakeGame.prototype.addEventListeners = function() {
  document.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
      case 37:
        event.preventDefault();
        this.snake.changeDirection(Directions.WEST);
        break;
      case 38:
        event.preventDefault();
        this.snake.changeDirection(Directions.NORTH);
        break;
      case 39:
        event.preventDefault();
        this.snake.changeDirection(Directions.EAST);
        break;
      case 40:
        event.preventDefault();
        this.snake.changeDirection(Directions.SOUTH);
        break;
    }
  }.bind(this));
}

SnakeGame.prototype.step = function() {
  this.board.clear();
  this.advanceBoardItems();
  if (this.snake.isBitingSelf()) {
    this.renderBoardItems();
    return this.endGame();
  }
  this.checkForEatenApples();
  if (this.appleCollection.coordinates.length == 0) {
    this.appleCollection.generateRandomApples();
  }
  this.renderBoardItems();
}

SnakeGame.prototype.advanceBoardItems = function() {
  var maxIndex = this.board.dimension - 1;
  this.snake.advance(maxIndex);
}

SnakeGame.prototype.checkForEatenApples = function() {
  var snakeHeadCoordinate = this.snake.coordinates[0];
  var appleAtCoordinate = this.appleCollection.appleAtCoordinate(snakeHeadCoordinate);

  if (appleAtCoordinate) {
    this.appleCollection.removeApple(appleAtCoordinate);
    this.score++;
    this.snake.growByOne();
  }
}

SnakeGame.prototype.renderBoardItems = function() {
  this.board.render(this.snake);
  // NOTE: may be possible not to re-render apples on each frame
  this.board.render(this.appleCollection);
}

SnakeGame.prototype.endGame = function() {
  clearInterval(this.gameLoop);
  this.scoreKeeper.saveScore(this.score);
  this.board.displayEndScreen({
    score: this.score,
    buttonCallback: this.restart.bind(this)
  });
}

SnakeGame.prototype.restart = function() {
  this.board.hideEndScreen();
  this.start();
}

},{"./apple-collection.js":1,"./board.js":2,"./directions.js":3,"./score-keeper.js":5,"./snake.js":6}],5:[function(require,module,exports){
var ScoreKeeper = function() {}

ScoreKeeper.prototype.saveScore = function(score) {
  window.localStorage.setItem(Date.now(), score);
}

module.exports = ScoreKeeper;

},{}],6:[function(require,module,exports){
var Directions = require('./directions.js');

var Snake = function() {
  this.direction = Directions.NORTH;
  this.coordinates = [
    {x: 0, y: 3, color: 'black'},
    {x: 0, y: 2, color: 'grey'},
    {x: 0, y: 1, color: 'grey'},
    {x: 0, y: 0, color: 'grey'}
  ];
  this.length = this.coordinates.length;
}

Snake.prototype.changeDirection = function(direction) {
  if (this._isValidDirectionChange(direction)) {
    this.direction = direction;
  }
}

Snake.prototype._isValidDirectionChange = function(direction) {
  switch (this.direction) {
    case Directions.NORTH: // fall-through
    case Directions.SOUTH:
      return [Directions.EAST, Directions.WEST].indexOf(direction) >= 0;
    case Directions.EAST: //fall-through
    case Directions.WEST:
      return [Directions.NORTH, Directions.SOUTH].indexOf(direction) >= 0;
  }
}

Snake.prototype.advance = function(maxIndex) {
  this.coordinates[0].color = 'grey';
  var proposedCoordinate = this.newCoordinateForDirection(this.direction);
  proposedCoordinate.color = 'black'
  var wrappedCoordinate = this.wrapCoordinateToBoardDimensions(proposedCoordinate, maxIndex);
  this.coordinates.unshift(wrappedCoordinate);
  if (this.coordinates.length > this.length) {
    this.coordinates.pop();
  }
}

Snake.prototype.growByOne = function() {
  this.length++;
}

Snake.prototype.newCoordinateForDirection = function(direction) {
  var lastCoordinate = this.coordinates[0];
  var newCoordinate = {};
  switch (direction) {
    case Directions.NORTH:
      newCoordinate.x = lastCoordinate.x;
      newCoordinate.y = lastCoordinate.y + 1;
      break;
    case Directions.EAST:
      newCoordinate.x = lastCoordinate.x + 1;
      newCoordinate.y = lastCoordinate.y;
      break;
    case Directions.SOUTH:
      newCoordinate.x = lastCoordinate.x;
      newCoordinate.y = lastCoordinate.y - 1;
      break;
    case Directions.WEST:
      newCoordinate.x = lastCoordinate.x - 1;
      newCoordinate.y = lastCoordinate.y;
      break;
  }
  return newCoordinate;
}

Snake.prototype.wrapCoordinateToBoardDimensions = function(coordinate, maxIndex) {
  if (coordinate.x > maxIndex) { coordinate.x = 0; };
  if (coordinate.x < 0) { coordinate.x = maxIndex; };
  if (coordinate.y > maxIndex) { coordinate.y = 0; };
  if (coordinate.y < 0) { coordinate.y = maxIndex; };
  return coordinate;
}

Snake.prototype.isBitingSelf = function() {
  var headCoordinate = this.coordinates[0];
  var bodyCoordinates = this.coordinates.slice(1, this.coordinates.length);
  return bodyCoordinates.some(function(bodyCoordinate) {
    return bodyCoordinate.x == headCoordinate.x && bodyCoordinate.y == headCoordinate.y;
  });
}

module.exports = Snake;

},{"./directions.js":3}]},{},[4]);
