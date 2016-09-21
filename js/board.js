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
