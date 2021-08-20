const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') })

const axios = require('axios').default
const queries = require('./queries')
const Mongo = require('./database')
const models = require('./models')

const mongoUrl = process.env.MONGO_URL

const delay = (seconds) => new Promise(resolve => setTimeout(resolve, seconds * 1000))

async function run () {
  console.info('STARTING AXIE MARKETPLACE MONITOR...')
  console.info('Connecting to Database...')
  const database = new Mongo(mongoUrl)

  try {
    await database.connect()
    console.info('Database Connected. Creating Client...')

    const client = axios.create({
      baseURL: 'https://axieinfinity.com',
      headers: {
        Host: 'axieinfinity.com',
        'content-type': 'application/json'
      },
      timeout: 30000
    })

    for (let i = 1; i <= 100; i++) {
      console.info('Getting Last Axies Sold...')
      const axiesSoldResponse = await client.post(
        'graphql-server-v2/graphql',
        queries.getRecentlyAxiesSoldWithDetails(0, 100)
      )

      if (!axiesSoldResponse) {
        console.log('problem retrieving axies history')
        process.exit(-1)
      }

      console.info('Generating SalesHistory Model...')
      const salesHistoryMongo = models['SalesHistory'](axiesSoldResponse)

      try {
        await database.insertSalesHistory(salesHistoryMongo)
      } catch (error) {
        console.log(`Ignoring duplicate id(s) (${error.writeErrors.length}): ${error.writeErrors.map((writeError) => writeError.err.op._id)}`)
      }

      console.log(`Run number ${i} done. Delaying 40s...`)
      await delay(40)
    }

  } finally {
    await database.close()
  }
}


run().then(() => {
  process.exit(0)
}, err => {
  console.error(err)
  process.exit(-1)
})

