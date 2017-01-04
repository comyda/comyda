
const express = require('express');
const bodyParser = require('body-parser');
const calcular = require('./services/calcular');
const comedoriaController = require('./controllers/comedoria');
const homeController = require('./controllers/home');
const app = express();
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const uuid = require('uuid');
const ObjectId = require('mongodb').ObjectID;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}));

app.use(function(req, res, next){
  if(req.query._method == 'DELETE'){
    req.method = 'DELETE';
    req.url = req.path;
  }
  next();
});

app.get('/', homeController.index);

app.get('/eventos/:id', function (req, res) {
 	const url = 'mongodb://localhost:27017/oxifood';

 // Use connect method to connect to the server
 	MongoClient.connect(url, function(err, db) {

 	const collection = db.collection('participar');
 		collection.find({eventid:req.params.id}).toArray(function(err, docs) {

 							res.render('participar', {participar:docs, eventid:req.params.id});
 				   });

 					 db.close();
 	});
 });


 app.get('/calcular/event/:id', function(req, res) {
   const url = 'mongodb://localhost:27017/oxifood';

  // Use connect method to connect to the server
  	MongoClient.connect(url, function(err, db) {

  	   const collection = db.collection('participar');
       collection.aggregate([{$match: {'eventid': req.params.id} }, {$group : {_id : "$eventid", subscribers : {$sum : 1 }}}]).toArray(function(err, docs) {
        const pizzas = calcular.getPizzas(docs[0].subscribers);
        const guarana = calcular.getGuarana(docs[0].subscribers);
        const valorTotal = pizzas.total + guarana.total;
          res.render('tabeladecalculo', {pizzas: pizzas, guarana: guarana, valor: valorTotal});
  	   });

  		 db.close();
  	});
  });

  app.delete('/event/:id', function(req,res) {
  const url = 'mongodb://localhost:27017/oxifood';
    MongoClient.connect(url, function(err, db) {

  			const collection = db.collection('eventos');
      collection.remove({"_id": req.params.id});
        res.redirect('/');

        db.close();
    });
  });

  app.delete('/participar/:id', function(req,res) {
  const url = 'mongodb://localhost:27017/oxifood';
    MongoClient.connect(url, function(err, db) {

  			const collection = db.collection('participar');
      collection.remove({"_id": req.params.id});
        res.redirect('/');

        db.close();
    });
  });

 app.get('/evento', function(req, res) {
 const url = 'mongodb://localhost:27017/oxifood';

  // Use connect method to connect to the server
  	MongoClient.connect(url, function(err, db) {

  	   const collection = db.collection('comedoria');
       collection.find({}).toArray(function(err, docs){

         res.render('criarevento', {comedorias: docs});
       })

  		 db.close();
  	});
 });

 app.post('/eventos', function (req, res) {
 	const url = 'mongodb://localhost:27017/oxifood';

 // Use connect method to connect to the server
 MongoClient.connect(url, function(err, db) {
   const collection = db.collection('eventos');

 		const event = {
 			_id: uuid.v4(),
      restaurant: req.body.restaurant,
      name: req.body.name,
 			ownername: req.body.ownername,
 			time: new Date(req.body.time),
      timeFinished: new Date(req.body.timeFinished)
 		};

 					collection.insertOne(event);
 					res.redirect('/');

 				db.close();

 	});
 });

 app.post('/participar', function (req, res) {
 	const url = 'mongodb://localhost:27017/oxifood';

 		// Use connect method to connect to the server
 		MongoClient.connect(url, function(err, db) {

 			const collection = db.collection('participar');

 				const dados = {
	 		    _id: uuid.v4(),
	 				eventid: req.body.eventid,
	 				firstname: req.body.firstname,
	 				restriction: req.body.restriction,
          flavor: req.body.flavor
        };

        collection.insertOne(dados);
				res.redirect('/');

 			  db.close();
 		});
 });

 app.get('/restaurante', function(req, res) {
  res.render('addrestaurante');
 });

app.post('/comedorias', comedoriaController.create);

app.listen(3000, function () {
 	console.log('Example app listening on port 3000!');
 });
