var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/weather', function(err, db) {
	if(err) throw err;
	
	var query = {};
	
	var projection = { 'State': 1, 'Temperature': 1, _id: 0};
	
	var sort = [['State', 1], [ 'Temperature', -1 ]];
	
	var state = '';
	db.collection('data').find(query).sort(sort).each(function(err, doc) {
		if (doc == null) {
			return;
		} else {
			if (state != doc.State)
			{
				doc.month_high = true;
				db.collection('data').update({'_id': doc._id}, {$set: {'month_high': true}}, function(err, updated){
					if (err) throw err;
					
					console.log(updated + ' doc updated')
					console.dir(doc);
				})
				state = doc.State;			
			}
		}
	});
});