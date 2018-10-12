const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const express = require('express');

const app = express();
const port = 3000;
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Mongo
const connectionUrl = 'mongodb://localhost:27017';
const dbName = 'wgvs';
const tableName = 'transactions';
const mongoClient = new MongoClient(connectionUrl);

const dbConnect = err => {
  if (err) throw err;
  console.log('Connected successfully to server');
  const db = mongoClient.db(dbName);
  return db;
};

const findOne = function(db, data, callback) {
  // Get the documents collection
  const collection = db.collection(tableName);
  // Find some documents
  collection.find(data, function(error, docs) {
    if (error) callback(error);
    else {
      console.log('Found the following records');
      console.log(docs);
      callback(docs);
    }
  });
};

const insertDocument = function(db, data, callback) {
  // Get the documents collection
  const collection = db.collection(tableName);
  // Insert some documents
  collection.insertOne(data, (error, result) => {
    if (error) callback(error);
    else {
      console.log(
        'Inserted ' +
          result.result.n +
          ' document into the collection. id: ' +
          result.insertedId
      );
      callback(result);
    }
  });
};

const updateDocument = function(db, data, index, callback) {
  // Get the documents collection
  const collection = db.collection(tableName);
  // Update document where a is 2, set b equal to 1
  collection.updateOne(index, { $set: data }, function(err, result) {
    if (error) callback(error);
    else {
      console.log('Updated transation ' + index);
      callback(result);
    }
  });
};

const deleteDocument = function(db, data, callback) {
  // Get the documents collection
  const collection = db.collection(tableName);
  collection.deleteOne(data, function(error, result) {
    if (error) callback(error);
    else {
      console.log('Deleted ' + result.deletedId);
      callback(result);
    }
  });
};

app.post('/transaction', (req, res) => {
  mongoClient.connect(err => {
    insertDocument(dbConnect(err), req.body, function(data) {
      res.status(200).send(data);
    });
  });
  mongoClient.close();
});

app.get('/transaction/:id', (req, res) => {
  mongoClient.connect(err => {
    findOne(dbConnect(err), { '_id': req.params.id }, function(data) {
      res.status(200).send(data);
    });
  });
  mongoClient.close();
});

app.delete('/transaction/:id', (req, res) => {
  mongoClient.connect(err => {
    deleteDocument(dbConnect(err), { _id: req.params.id }, function(data) {
      res.status(200).send(data);
    });
  });
  mongoClient.close();
});

app.put('/transaction/:id', (req, res) => {
  mongoClient.connect(err => {
    updateDocument(dbConnect(err), { _id: req.params.id }, function(data) {
      res.status(200).send(data);
    });
  });
  mongoClient.close();
});

app.listen(port, () => console.log(`Homework listening on port ${port}!`));
