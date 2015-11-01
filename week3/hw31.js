var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;


MongoClient.connect('mongodb://localhost:27017/school', function (err, db) {
	if (err) throw err;
	
	var data = db.collection('students');
	var cursor = data.find({});
	
	var highAvgScoreAfter = 0;
	cursor.each(function (err, doc) {
		if (err) throw err;
		if (doc == null) {
			return;
		} else {
			if (doc.scores.length > 0) {
				//console.log('Average score before: ' + averageScores(doc.scores));
				console.log("Before  ");
				console.dir(doc.scores);
				doc.scores = removeLowestHomeworkScore(doc.scores);
				console.dir("After ");
				console.dir(doc.scores);
				data.save(doc, function (err, saved) {
					if (err) throw err;
					console.dir("Successfully saved " + saved + " document!");
				});
				//console.dir(doc);
				var averageScore = averageScores(doc.scores);
				if (averageScore > highAvgScoreAfter) {
					highAvgScoreAfter = averageScore;
					console.log(doc._id + ' - New high: ' + highAvgScoreAfter);
				}
			}
		}
	});
});

var removeLowestHomeworkScore = function(scores) {
	scores.sort(scoreComparator);
	for (var i = 0; i < scores.length; i++) {
		if (scores[i].type == "homework") {
			scores.splice(i,1);
			break;
		}
	}
	return scores; 
}

var averageScores = function(scores) {
	var sum = 0;
	scores.forEach(function(score) {
		sum += score.score;
	}, this);
	return sum / scores.length;
}

var scoreComparator = function(a,b) {
	return a.score - b.score;
}