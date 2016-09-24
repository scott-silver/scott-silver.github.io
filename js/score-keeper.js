var moment = require('moment');

var ScoreKeeper = function() {}

function formattedDateString(date) {
  return moment(date).format('MM/DD/YYYY, hh:mm:ss a')
}

ScoreKeeper.prototype.saveScore = function(score) {
  window.localStorage.setItem(Date.now(), score);
}

ScoreKeeper.prototype.getScores = function() {
  var scores = [];
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    var date = new Date(Number(key));
    var score = localStorage[key];
    scores.push({ score: score, dateString: formattedDateString(date) });
  }
  return scores.sort(function(previousScore, currentScore) {
    return Number(currentScore.score) - Number(previousScore.score);
  });
}

module.exports = ScoreKeeper;
