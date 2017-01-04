const MongoClient = require('mongodb').MongoClient;
const uuid = require('uuid');

module.exports= {
  add: (body, callback) => {
    const url = 'mongodb://localhost:27017/oxifood';

    MongoClient.connect(url, (err, db) => {
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
    const url = 'mongodb://localhost:27017/oxifood';

    MongoClient.connect(url, (err, db) => {
      db.collection('comedorias').find({'_id': {'$in': ids}}).toArray((err, comedorias) => {
        callback(comedorias);
      });
    });
  }
}
