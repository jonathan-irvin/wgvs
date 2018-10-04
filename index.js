const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const express = require('express')
const app = express()
const port = 3000

//Mongo
const connectionUrl = 'mongodb://localhost:27017';
const dbName = 'myproject';
const mongoClient = new MongoClient(connectionUrl);

// Use connect method to connect to the Server
mongoClient.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  const db = mongoClient.db(dbName);
  mongoClient.close();
});

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Homework listening on port ${port}!`))