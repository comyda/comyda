const MongoClient = require('mongodb').MongoClient;
const calcular = require('../services/calcular');
const eventoRepository = require('../repositories/evento');
const comedoriaRepository = require('../repositories/comedoria');

module.exports = {
  index: (req, res) => {
    const url = 'mongodb://localhost:27017/oxifood';

    const result = {foods: [], total: 0};

  	MongoClient.connect(url, function(err, db) {
      eventoRepository.findOne(req.params.id, evento => {
        comedoriaRepository.findOne(evento.restaurant, comedoria => {
          db.collection('participar').find({eventid: req.params.id}).toArray((err, participants) => {
            participants.forEach(participant => {
              const foundFood = result.foods.find(food => food.name === participant.flavor);
              if (foundFood) {
                foundFood.quantity++;
              } else {
                result.foods.push({name: participant.flavor, quantity: 1});
              }

              const foodFromComedoria = comedoria.foods.find(food => food.name === participant.flavor);
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
