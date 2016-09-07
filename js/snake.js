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
  this.direction = direction;
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
  if (coordinate.x > maxIndex) {
    coordinate.x = 0;
  }
  if (coordinate.x < 0) {
    coordinate.x = maxIndex;
  }
  if (coordinate.y > maxIndex) {
    coordinate.y = 0;
  }
  if (coordinate.y < 0) {
    coordinate.y = maxIndex;
  }
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
