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

const dbConnect = (err) => {
  assert.strictEqual(null, err)
  console.log('Connected successfully to server')
  const db = mongoClient.db(dbName)
  return db
}

const findDocuments = function (db, data, callback) {
  // Get the documents collection
  const collection = db.collection(tableName)
  // Find some documents
  collection.find(data).toArray(function (err, docs) {
    assert.strictEqual(err, null)
    console.log('Found the following records')
    console.log(docs)
    callback(docs)
  })
}

const insertDocuments = function (db, data, callback) {
  // Get the documents collection
  const collection = db.collection(tableName)
  // Insert some documents
  collection.insertMany(data, (err, result) => {
    assert.strictEqual(err, null)
    console.log('Inserted ' + result.result.n + ' documents into the collection')
    callback(result)
  })
}

const updateDocument = function (db, data, index, callback) {
  // Get the documents collection
  const collection = db.collection(tableName)
  // Update document where a is 2, set b equal to 1
  collection.updateOne(index, { $set: data }, function (err, result) {
    assert.strictEqual(err, null)
    assert.strictEqual(1, result.result.n)
    console.log('Updated transation ' + index)
    callback(result)
  })
}

const deleteDocument = function (db, data, callback) {
  // Get the documents collection
  const collection = db.collection(tableName)
  collection.deleteOne(data, function (err, result) {
    assert.strictEqual(err, null)
    assert.strictEqual(1, result.result.n)
    console.log('Deleted ' + data)
    callback(result)
  })
}

app.post('/transactions', (req, res) => {
  // Use connect method to connect to the server
  mongoClient.connect(err => {
    insertDocuments(dbConnect(err), req.data, function () {
      mongoClient.close()
      res.sendStatus(200)
    })
  })
})

app.get('/transactions', (req, res) => {
  // Use connect method to connect to the server
  mongoClient.connect(err => {
    findDocuments(dbConnect(err), req.data, function () {
      mongoClient.close()
      res.sendStatus(200)
    })
  })
})

app.delete('/transactions', (req, res) => {
  mongoClient.connect(err => {
    deleteDocument(dbConnect(err), req.data, function () {
      mongoClient.close()
      res.sendStatus(200)
    })
  })
})

app.put('/transactions', (req, res) => {
  mongoClient.connect(err => {
    updateDocument(dbConnect(err), req.data.data, req.data.index, function () {
      mongoClient.close()
      res.sendStatus(200)
    })
  })
})

app.listen(port, () => console.log(`Homework listening on port ${port}!`))
