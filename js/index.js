var Board = require('./board.js');
var Snake = require('./snake.js');
var Directions = require('./directions.js');

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
