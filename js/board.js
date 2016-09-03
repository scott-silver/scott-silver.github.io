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
