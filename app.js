var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}));
app.get('/', function (req, res) {
	var url = 'mongodb://localhost:27017/oxifood';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {

		var collection = db.collection('eventos');
		collection.find({}).toArray(function(err, docs) {
    	res.render('novaindex', {eventos:docs});
   });



	  db.close();
	});
});

app.get('/evento', function (req, res) {
		res.render('criar');
});
app.post('/eventos', function (req, res) {
	var url = 'mongodb://localhost:27017/oxifood';

// Use connect method to connect to the server
	MongoClient.connect(url, function(err, db) {

		var collection = db.collection('eventos');
		collection.insertOne(req.body);


	  db.close();
	});

res.render('novaindex');

});

app.listen(3000, function () {
	  console.log('Example app listening on port 3000!');
});
