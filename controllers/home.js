const MongoClient = require('mongodb').MongoClient;

module.exports = {
  index: (req, res) => {
    const url = 'mongodb://localhost:27017/oxifood';

    // Use connect method to connect to the server
   	MongoClient.connect(url, function(err, db) {

     	const collection = db.collection('eventos');
     	collection.find({}).toArray(function(err, docs) {
        for (let i = 0; i < docs.length; i++) {
     			let day = docs[i].time.getDate();
     			if (day < 10) {
     			  day = '0' + day;
     			}
     			let month = docs[i].time.getMonth()+1;
     			if (month < 10) {
     				month = '0' + month;
     			}
     			let hours = docs[i].time.getHours() + 3;
     			if (hours < 10) {
     				hours = '0' + hours;
     			}
     			let minutes = docs[i].time.getMinutes();
     			if (minutes < 10) {
     				minutes = '0' + minutes;
     			}
          docs[i].timeAsString = day + '/' + month + ' ' + 'às' + ' ' + hours+ ':'+ minutes;
     		}
     	  res.render('index', {eventos:docs});
     	});

     	db.close();
   	});
  }
};
