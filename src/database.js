const { MongoClient } = require('mongodb')

class Mongo {
  constructor (url) {
    this.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true })
  }

  connect () {
    return this.client.connect()
  }

  close () {
    return this.client.close()
  }

  insertMany ({ db, collection }, jsonList) {
    return this.client
    .db(db)
    .collection(collection)
    .insertMany(
      jsonList.map(json => json),
      { ordered: false }
    )
  }

  insertSalesHistory (salesHistory) {
    return this.insertMany({ db: 'axie', collection: 'saleshistory' }, salesHistory)
  }

  retrieveSalesHistory (query) {
    return this.client.db('axie').collection('saleshistory').find(query).toArray()
  }
}

module.exports = Mongo
