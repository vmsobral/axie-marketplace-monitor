const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../..', '.env') })

const { DateTime } = require('luxon')
const Mongo = require('../database')
const analytics = require('./analytics')

const mongoUrl = process.env.MONGO_URL

async function run () {
  console.info('GENERATING AXIE MARKETPLACE ANALYTICS...')
  console.info('Connecting to Database...')
  const database = new Mongo(mongoUrl)

  try {
    await database.connect()
    console.info('Database Connected. Creating Client...')

    const lastDaySales = await database.retrieveSalesHistory({
      dateTime: { '$gte': DateTime.utc().minus({ hours: 24 }).toJSDate() }
    })

    console.log('\nMost sold parts configs last 24h:')
    const mostSoldParts = analytics.mostSoldPartsConfig(lastDaySales, 5)
    for (let i = 0; i < mostSoldParts.length; i++) {
      const total = mostSoldParts[i][1].qtt
      console.log(`\n${i+1}) ${mostSoldParts[i][0]}`)
      console.log(`Quantity: ${total}`)
      console.log(`Avg Price (ETH): ${(mostSoldParts[i][1].price/total)/1000000000000000000}`)
      console.log(`Avg Price (USD): ${(mostSoldParts[i][1].priceUSD/total).toFixed(2)}`)
    }

    console.log('\nMost expensive parts configs last 24h:')
    const mostExpensiveParts = analytics.mostExpensivePartsConfig(lastDaySales, 5)
    for (let i = 0; i < mostExpensiveParts.length; i++) {
      console.log(`\n${i+1}) ${mostExpensiveParts[i][0]}`)
      console.log(`Price (ETH): ${(mostExpensiveParts[i][1].price)/1000000000000000000}`)
      console.log(`Price (USD): ${(mostExpensiveParts[i][1].priceUSD).toFixed(2)}`)
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
