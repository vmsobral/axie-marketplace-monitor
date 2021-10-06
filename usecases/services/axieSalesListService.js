const models = require('../models')
const queries = require('../queries')
const axieGeneticsHandler = require('../axieGeneticsHandler')

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
  async retrieveLastAxiesListed (context) {
    const { logger } = context
    logger.info('Getting latest axies listed...')
    const latestAxiesListedResponse = await client.post(
      'graphql-server-v2/graphql',
      queries.getRecentlyAxiesListed(0, 100, 'Latest', 'Sale', {})
    )
    if (!latestAxiesListedResponse) {
      logger.error('problem retrieving latest axies listed')
      throw new Error()
    }

    return models.LatestAxiesListed(latestAxiesListedResponse)
  },

  async retrieveBestMatchListed (context, wantedClasses, wantedParts, size, priceCapUSD) {
    return this.retrieveBestMatchFromId(context, wantedClasses, wantedParts, size, priceCapUSD, null)
  },

  async retrieveBestMatchFromId (context, wantedClasses, wantedParts, size, priceCapUSD, matchId) {
    const { logger } = context
    logger.info('Getting best match from marketplace list..')
    const criteria = {
      parts: wantedParts,
      classes: wantedClasses,
      breedCount: 0
    }

    const currentListings = []
    let responseSize = 100
    let from = 0
    while (responseSize === 100) {
      logger.info(`Making GerAxieBriefList Request [iteration ${(from / 100) + 1}]...`)
      const axiesCurrentListingResponse = await client.post(
        'graphql-server-v2/graphql',
        queries.getAxieBriefList(from, 100, 'PriceAsc', 'Sale', criteria)
      )
      if (!axiesCurrentListingResponse) {
        logger.error('problem retrieving axies current listing')
        throw new Error()
      }

      logger.info(`Generating SalesHistory Model [iteration ${(from / 100) + 1}]...`)
      const currentListingsModel = models.CurrentListing(axiesCurrentListingResponse)
      currentListings.push(...currentListingsModel)
      from += 100
      responseSize = currentListingsModel.length
    }

    if (matchId === null) {
      return axieGeneticsHandler.findBestMatchPair(currentListings, wantedClasses, wantedParts, size, priceCapUSD)
    }
    const axieDetailResponse = await client.post(
      'graphql-server-v2/graphql',
      queries.getAxieDetail(matchId)
    )
    currentListings.push(models.AxieDetail(axieDetailResponse))
    return axieGeneticsHandler.findBestMatchGivenId(currentListings, wantedClasses, wantedParts, size, priceCapUSD, matchId)
  }
}

module.exports = axieSalesHistoryService
