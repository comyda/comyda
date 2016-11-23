var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var uuid = require('uuid');
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

			for (var i = 0; i < docs.length; i++) {
				var day = docs[i].time.getDate();
				if (day < 10) {
					day = '0' + day;
				}
				var month = docs[i].time.getMonth()+1;
				if (month < 10) {
					month = '0' + month;
				}
				var hours = docs[i].time.getHours() + 3;
				if (hours < 10) {
					hours = '0' + hours;
				}
				var minutes = docs[i].time.getMinutes();
				if (minutes < 10) {
					minutes = '0' + minutes;
				}
				docs[i].timeAsString = day + '/' + month + ' ' + hours+ ':'+ minutes;
				}

							res.render('novaindex', {eventos:docs});
				   });

		db.close();
	});
});

app.get('/eventos/:id', function (req, res) {
	var url = 'mongodb://localhost:27017/oxifood';

// Use connect method to connect to the server
	MongoClient.connect(url, function(err, db) {

		var collection = db.collection('participar');
		collection.find({eventid:req.params.id}).toArray(function(err, docs) {

							res.render('planilha', {participar:docs, eventid:req.params.id});
				   });

					 db.close();
	});
});


app.get('/evento', function(req, res) {
	res.render('criar');
});

app.post('/eventos', function (req, res) {
	var url = 'mongodb://localhost:27017/oxifood';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {

	var collection = db.collection('eventos');

		var event = {
			_id: uuid.v4(),
			name: req.body.name,
			ownername: req.body.ownername,
			time: new Date(req.body.time)
		};

					collection.insertOne(event);
					res.redirect('/');

				db.close();

	});
});

app.post('/participar', function (req, res) {
	var url = 'mongodb://localhost:27017/oxifood';
		console.log(req);

		// Use connect method to connect to the server
		MongoClient.connect(url, function(err, db) {

var collection = db.collection('participar');

				var dados = {
		    _id: uuid.v4(),
				eventid: req.body.eventid,
				firstname: req.body.firstname,
				restriction: req.body.restriction
				};

							collection.insertOne(dados);
						res.redirect('/');

			  db.close();
		});
});


app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});
