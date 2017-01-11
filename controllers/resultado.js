const MongoClient = require('mongodb').MongoClient;
const calcular = require('../services/calcular');

module.exports = {
  index: (req, res) => {
    const url = 'mongodb://localhost:27017/oxifood';

    const result = {foods: [], total: 0};

  	MongoClient.connect(url, function(err, db) {
      db.collection('eventos').find({_id: req.params.id}).toArray((err, eventos) => {
        db.collection('comedorias').find({_id: eventos[0].restaurant}).toArray((err, comedorias) => {
          db.collection('participar').find({eventid: req.params.id}).toArray((err, participants) => {
            participants.forEach(participant => {
              const foundFood = result.foods.find(food => food.name === participant.flavor);
              if (foundFood) {
                foundFood.quantity++;
              } else {
                result.foods.push({name: participant.flavor, quantity: 1});
              }

              const foodFromComedoria = comedorias[0].foods.find(food => food.name === participant.flavor);
              result.total += foodFromComedoria.price;
            });

            const guaranas = calcular.getGuarana(participants.length);
            result.total += guaranas.total;
            result.sodaTotal = guaranas.total;
            result.sodaQuantity = guaranas.numGuarana;

            db.close();
            res.render('tabeladecalculo', {result: result});
          });
        });
      });
   });
  }
};
