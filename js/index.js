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
    topScores: this.scoreKeeper.getScores(),
    buttonCallback: this.restart.bind(this)
  });
}

SnakeGame.prototype.restart = function() {
  this.board.hideEndScreen();
  this.start();
}
