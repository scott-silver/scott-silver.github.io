var ScoreKeeper = function() {}

ScoreKeeper.prototype.saveScore = function(score) {
  window.localStorage.setItem(Date.now(), score);
}

module.exports = ScoreKeeper;
