const MongoClient = require('mongodb').MongoClient;
const uuid = require('uuid');

const ComedoriaRepository = {
  url: process.env.MONGODB_URI || 'mongodb://localhost:27017/oxifood',
  findOne: (id, callback) => {
    MongoClient.connect(ComedoriaRepository.url, (err, db) => {
      db.collection('comedorias').find({_id: id}).toArray((err, comedorias) => {
        callback(comedorias[0]);
        db.close();
      });
    });
  },
  add: (body, callback) => {
    MongoClient.connect(ComedoriaRepository.url, (err, db) => {
      const food = {
        _id: uuid.v4(),
        nameplace: body.nameplace,
        phone: body.phone,
        food1: body.food1,
        food2: body.food2,
        food3: body.food3,
        food4: body.food4,
        deliveryRate: parseFloat(body.deliveryRate)
      };

      db.collection('comedorias').insertOne(food, (err, result) => {
        callback();
      });

      db.close();
    });
  },
  findMany: (ids, callback) => {
    MongoClient.connect(ComedoriaRepository.url, (err, db) => {
      db.collection('comedorias').find({'_id': {'$in': ids}}).toArray((err, comedorias) => {
        callback(comedorias);
      });
    });
  }
}

module.exports = ComedoriaRepository;
