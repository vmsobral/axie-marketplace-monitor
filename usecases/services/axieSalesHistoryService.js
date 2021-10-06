const models = require('../models')
const queries = require('../queries')
const analytics = require('../analytics')

const { DateTime } = require('luxon')
const axios = require('axios').default

const client = axios.create({
  baseURL: 'https://axieinfinity.com',
  headers: {
    Host: 'axieinfinity.com',
    'content-type': 'application/json'
  },
  timeout: 30000
})

const axieSalesHistoryService = {
  async generateSalesHistory (context) {
    const { logger, db } = context
    logger.info('Getting last axies sold...')
    const axiesSoldResponse = await client.post(
      'graphql-server-v2/graphql',
      queries.getRecentlyAxiesSoldWithDetails(0, 100)
    )
    if (!axiesSoldResponse) {
      logger.error('problem retrieving axies history')
      throw new Error()
    }
    const salesHistory = models.SalesHistory(axiesSoldResponse)

    logger.info('Saving sales history to database...')

    try {
      await db.insertSalesHistory(salesHistory)
    } catch (error) {
      logger.warn(`Ignoring duplicate id(s) (${error.writeErrors.length}): ${error.writeErrors.map((writeError) => writeError.err.op._id)}`)
    }
  },

  async retrieveMostSoldPartsConfigs (context, timeFrame, size) {
    const { logger, db } = context
    logger.info('Getting most sold parts configs...')

    const salesList = await db.retrieveSalesHistory({
      dateTime: {
        $gte: DateTime.utc().minus(timeFrame)
          .toJSDate()
      }
    })

    return analytics.mostSoldPartsConfigs(salesList, size)
  },

  async retrieveCheapestPartsConfig (context, timeFrame, size) {
    const { logger, db } = context
    logger.info('Getting cheapest parts configs...')

    const salesList = await db.retrieveSalesHistory({
      dateTime: {
        $gte: DateTime.utc().minus(timeFrame)
          .toJSDate()
      }
    })

    return analytics.salesListByPrice(salesList, size, true)
  },

  async retrieveMostExpensivePartsConfig (context, timeFrame, size) {
    const { logger, db } = context
    logger.info('Getting most expensive parts configs...')

    const salesList = await db.retrieveSalesHistory({
      dateTime: {
        $gte: DateTime.utc().minus(timeFrame)
          .toJSDate()
      }
    })

    return analytics.salesListByPrice(salesList, size)
  }
}

module.exports = axieSalesHistoryService
