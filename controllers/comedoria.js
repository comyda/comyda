const MongoClient = require('mongodb').MongoClient;
const uuid = require('uuid');

module.exports = {
  create: (req, res) => {
    const url = 'mongodb://localhost:27017/oxifood';

    // Use connect method to connect to the server
    MongoClient.connect(url, (err, db) => {
      const food = {
        _id: uuid.v4(),
        nameplace: req.body.nameplace,
        phone: req.body.phone,
        food1: req.body.food1,
        food2: req.body.food2,
        food3: req.body.food3,
        food4: req.body.food4,
        deliveryRate: parseFloat(req.body.deliveryRate)
      };

      db.collection('comedorias').insertOne(food);
      db.close();

      res.redirect('/');
    });
  }
};
