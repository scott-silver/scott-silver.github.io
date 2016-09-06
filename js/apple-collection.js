var AppleCollection = function() {
  this.coordinates = [
    { x: 10, y: 10, color: 'red' },
    { x: 15, y: 15, color: 'red' },
    { x: 20, y: 20, color: 'red' }
  ];
}

AppleCollection.prototype.appleAtCoordinate = function(coordinate) {
  return this.coordinates.find(function(appleCoordinate) {
    return appleCoordinate.x == coordinate.x && appleCoordinate.y == coordinate.y;
  });
}

AppleCollection.prototype.removeApple = function(apple) {
  this.coordinates.splice(this.coordinates.indexOf(apple), 1);
}

module.exports = AppleCollection;
