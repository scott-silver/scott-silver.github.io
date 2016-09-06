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
