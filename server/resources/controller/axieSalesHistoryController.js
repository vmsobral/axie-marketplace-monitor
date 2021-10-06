const axieSalesHistoryService = require('../../../usecases/services/axieSalesHistoryService')

const loggerUtils = require('../../utils/loggerUtils')
const logger = loggerUtils.createNewLogger('axie-marketplace-monitor')

const axieSalesHistoryController = {
  async produce (request, reply) {
    try {
      const context = { logger, db: this.db }
      const result = await axieSalesHistoryService.generateSalesHistory(context)
      reply.success(result)
    } catch (error) {
      logger.error(error)
      reply.error(error)
    }
  },

  async list (request, reply) {
    const { body } = request
    try {
      const context = { logger, db: this.db }
      const result = await axieSalesHistoryService.retrieveMostSoldPartsConfigs(
        context,
        body.timeFrame,
        body.size
      )
      reply.success(result)
    } catch (error) {
      logger.error(error)
      reply.error(error)
    }
  }
}

module.exports = axieSalesHistoryController
