const axieSalesListService = require('../../../usecases/services/axieSalesListService')

const loggerUtils = require('../../utils/loggerUtils')
const logger = loggerUtils.createNewLogger('axie-marketplace-monitor')

const axieSalesListController = {
  async list (request, reply) {
    try {
      const context = { logger, db: this.db }
      const result = await axieSalesListService.retrieveLastAxiesListed(context)
      reply.success(result)
    } catch (error) {
      logger.error(error)
      reply.error(error)
    }
  },

  async bestMatch (request, reply) {
    const { body } = request
    try {
      const context = { logger, db: this.db }
      let result
      if (body.matchId) {
        result = await axieSalesListService.retrieveBestMatchFromId(
          context,
          body.classes,
          body.parts,
          body.size || 10,
          body.priceCapUSD,
          body.matchId
        )
      } else {
        result = await axieSalesListService.retrieveBestMatchListed(
          context,
          body.classes,
          body.parts,
          body.size || 10,
          body.priceCapUSD
        )
      }
      reply.success(result)
    } catch (error) {
      logger.error(error)
      reply.error(error)
    }
  }
}

module.exports = axieSalesListController
