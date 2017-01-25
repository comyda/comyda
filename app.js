
const express = require('express');
const bodyParser = require('body-parser');
const comedoriaController = require('./controllers/comedoria');
const homeController = require('./controllers/home');
const resultadoService = require('./services/resultado');
const dateService = require('./services/date');
const app = express();
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const uuid = require('uuid');
const ObjectId = require('mongodb').ObjectID;
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/oxifood';
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


app.get('/eventos/:id/:status*?', function (req, res) {
  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, db) {
    db.collection('eventos').find({_id: req.params.id}).toArray(function(err, eventos) {
      if (eventos.length === 0) {
        res.redirect('/');
        db.close();
        return;
      }
      db.collection('comedorias').find({_id: eventos[0].restaurant}).toArray(function(err, comedorias) {
        db.collection('participar').find({eventid: req.params.id}).toArray(function(err, participants) {
          const sortedFoods = comedorias[0].foods.sort(function(food1, food2) {
            const nameFood1 = food1.name.toUpperCase();
            const nameFood2 = food2.name.toUpperCase();
            if (nameFood1 < nameFood2) return -1;
            if (nameFood1 > nameFood2) return 1;
            return 0;
          });
          res.render('participar', {
            participar: participants,
            eventid: req.params.id,
            foods: sortedFoods,
            status: req.params.status,
            result: resultadoService.calcular(participants, comedorias[0]),
            comedorias: comedorias[0]
          });
        db.close();
        });
      });
    });
  });
});

  app.delete('/event/:id', function(req,res) {
    MongoClient.connect(url, function(err, db) {

  			const collection = db.collection('eventos');
      collection.remove({"_id": req.params.id});
        res.redirect('/');

        db.close();
    });
  });

  app.delete('/participar/:id', function(req,res) {
    MongoClient.connect(url, function(err, db) {

  			const collection = db.collection('participar');
      collection.remove({"_id": req.params.id});
        res.redirect('/');

        db.close();
    });
  });

 app.get('/evento', function(req, res) {
  // Use connect method to connect to the server
  	MongoClient.connect(url, function(err, db) {

  	   const collection = db.collection('comedorias');
       collection.find({}).toArray(function(err, docs){

         res.render('criarevento', {comedorias: docs});
       })

  		 db.close();
  	});
 });

app.post('/eventos', function (req, res) {
  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, db) {
    const collection = db.collection('eventos');

    const event = {
      _id: uuid.v4(),
      restaurant: req.body.restaurant,
      name: req.body.name,
      ownername: req.body.ownername,
      time: dateService.createFromString(req.body.time)
    };

 		collection.insertOne(event);
 		res.redirect('/');

 		db.close();
  });
 });

app.post('/participar', function (req, res) {
 	// Use connect method to connect to the server
 	MongoClient.connect(url, function(err, db) {
 	  const collection = db.collection('participar');

		const dados = {
	    _id: uuid.v4(),
			eventid: req.body.eventid,
			firstname: req.body.firstname,
      lastname: req.body.lastname,
      flavor: req.body.flavor
    };

    collection.insertOne(dados);
		res.redirect(`/eventos/${req.body.eventid}`);

	  db.close();
	});
});

app.post('/comedorias', comedoriaController.create);

app.listen(process.env.PORT || 3000, () => console.log('Oxifood rodando!'));

module.exports = app;
