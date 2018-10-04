const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const express = require('express')

const app = express()
const port = 3000

// Mongo
const connectionUrl = 'mongodb://localhost:27017'
const dbName = 'wgvs'
const tableName = 'transactions'
const mongoClient = new MongoClient(connectionUrl)

const findDocuments = function (db, callback) {
  // Get the documents collection
  const collection = db.collection('documents')
  // Find some documents
  collection.find({ a: 3 }).toArray(function (err, docs) {
    assert.strictEqual(err, null)
    console.log('Found the following records')
    console.log(docs)
    callback(docs)
  })
}

const insertDocuments = function (db, callback) {
  // Get the documents collection
  const collection = db.collection(tableName)
  // Insert some documents
  collection.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }], (err, result) => {
    assert.strictEqual(err, null)
    assert.strictEqual(3, result.result.n)
    assert.strictEqual(3, result.ops.length)
    console.log('Inserted 3 documents into the collection')
    callback(result)
  })
}

const updateDocument = function (db, callback) {
  // Get the documents collection
  const collection = db.collection('documents')
  // Update document where a is 2, set b equal to 1
  collection.updateOne({ a: 2 }, { $set: { b: 1 } }, function (err, result) {
    assert.strictEqual(err, null)
    assert.strictEqual(1, result.result.n)
    console.log('Updated the document with the field a equal to 2')
    callback(result)
  })
}

const removeDocument = function (db, callback) {
  // Get the documents collection
  const collection = db.collection('documents')
  // Delete document where a is 3
  collection.deleteOne({ a: 3 }, function (err, result) {
    assert.strictEqual(err, null)
    assert.strictEqual(1, result.result.n)
    console.log('Removed the document with the field a equal to 3')
    callback(result)
  })
}

// respond with "hello world" when a GET request is made to the homepage
app.post('/transactions', (req, res) => {
  // Use connect method to connect to the server
  mongoClient.connect(err => {
    assert.strictEqual(null, err)
    console.log('Connected successfully to server')

    const db = mongoClient.db(dbName)

    insertDocuments(db, function () {
      mongoClient.close()
      res.sendStatus(200)
    })
  })
})

app.get('/transactions', (req, res) => {
  const findDocuments = function (db, callback) {
    // Get the documents collection
    const collection = db.collection(tableName)
    // Find some documents
    collection.find({}).toArray((err, docs) => {
      assert.strictEqual(err, null)
      console.log('Found the following records')
      console.log(docs)
      callback(docs)
    })
  }

  // Use connect method to connect to the server
  mongoClient.connect(err => {
    assert.strictEqual(null, err)
    console.log('Connected successfully to server')

    const db = mongoClient.db(dbName)

    findDocuments(db, function () {
      mongoClient.close()
      res.sendStatus(200)
    })
  })
})

app.listen(port, () => console.log(`Homework listening on port ${port}!`))
