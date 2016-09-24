TILE_CLASS = 'tile';
TILE_GREY_CLASS = 'tile--grey';
TILE_BLACK_CLASS = 'tile--black';
TILE_RED_CLASS = 'tile--red';

function buildElement(type, options) {
  var element = document.createElement(type);
  options = options || {};
  if (options.classes) {
    element.className = options.classes;
  }
  if (options.innerHTML) {
    element.innerHTML = options.innerHTML;
  }
  if (options.children) {
    options.children.forEach(function(child) {
      element.appendChild(child);
    });
  }
  return element;
}

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
  var button = buildElement('button', {classes: 'start-button button', innerHTML: 'Start!'});
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
  var restartButton = buildElement('button',
                                   {classes: 'button restart-button', innerHTML: 'Play Again?'});
  restartButton.onclick = options.buttonCallback;
  var topScores = buildElement('dl', {classes: 'top-scores'});
  for (var i = 0; i < 10; i++) {
    var date = buildElement('dt', {innerHTML: options.topScores[i].dateString});
    var score = buildElement('dd', {innerHTML: options.topScores[i].score});
    topScores.appendChild(date);
    topScores.appendChild(score);
  }
  this.endScreen = buildElement('div',
                                {
                                  classes: 'message-box',
                                  children: [
                                    buildElement('div',
                                                 {innerHTML: 'Your score: ' + options.score}),
                                    buildElement('div', {innerHTML: 'Top Scores:'}),
                                    topScores,
                                    restartButton
                                  ]
                                });
  this.element.appendChild(this.endScreen);
  restartButton.focus();
}

Board.prototype.hideEndScreen = function() {
  this.element.removeChild(this.endScreen);
}

module.exports = Board;
