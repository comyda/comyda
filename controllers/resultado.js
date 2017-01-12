const MongoClient = require('mongodb').MongoClient;
const resultado = require('../services/resultado');
const eventoRepository = require('../repositories/evento');
const comedoriaRepository = require('../repositories/comedoria');

module.exports = {
  index: (req, res) => {
    const url = 'mongodb://localhost:27017/oxifood';

  	MongoClient.connect(url, function(err, db) {
      eventoRepository.findOne(req.params.id, evento => {
        comedoriaRepository.findOne(evento.restaurant, comedoria => {
          db.collection('participar').find({eventid: req.params.id}).toArray((err, participants) => {
            res.render('tabeladecalculo', {result: resultado.calcular(participants, comedoria)});
            db.close();
          });
        });
      });
   });
  }
};
