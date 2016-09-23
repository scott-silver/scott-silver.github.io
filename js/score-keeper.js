var ScoreKeeper = function() {}

ScoreKeeper.prototype.saveScore = function(score) {
  window.localStorage.setItem(Date.now(), score);
}

ScoreKeeper.prototype.getScores = function() {
  var scores = [];
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    var value = localStorage[key];
    scores.push({
      score: value,
      date: new Date(Number(key))
    });
  }
  return scores.sort(function(previousScore, currentScore) {
    return Number(currentScore.score) - Number(previousScore.score);
  });
}

module.exports = ScoreKeeper;
