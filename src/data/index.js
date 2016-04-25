const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

function getDb(callback) {
  MongoClient.connect('mongodb://localhost:27017/auth0-api-referral-program', (err, db) => {
    if (err) throw err;

    callback(db);
  });
}

module.exports = getDb;
