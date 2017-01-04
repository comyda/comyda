const MongoClient = require('mongodb').MongoClient;

module.exports = {
  all: (callback) => {
    const url = 'mongodb://localhost:27017/oxifood';

    // Use connect method to connect to the server
   	MongoClient.connect(url, function(err, db) {

     	const collection = db.collection('eventos');
     	collection.find({}).toArray(function(err, docs) {
        callback(docs);
     	});

     	db.close();
   	});
  }
};
