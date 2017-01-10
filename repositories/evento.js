const MongoClient = require('mongodb').MongoClient;
const comedoriaRepository = require('./comedoria');

module.exports = {
  all: (callback) => {
    const url = 'mongodb://localhost:27017/oxifood';

   	MongoClient.connect(url, (err, db) => {
     	db.collection('eventos').find({}).toArray((err, eventos) => {
        const restaurantIds = eventos.map(evento => evento.restaurant);

        comedoriaRepository.findMany(restaurantIds, comedorias => {
          eventos.forEach(evento => {
            comedorias.forEach(comedoria => {
              if (evento.restaurant === comedoria._id) {
                evento.restaurant = comedoria.nameplace;
              }
            });
          });

          callback(eventos);
        });
     	});

     	db.close();
   	});
  }
};
