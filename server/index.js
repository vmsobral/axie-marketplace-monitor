const fastify = require('fastify')
const fastifyPlugin = require('fastify-plugin')

const resources = require('./resources')
const config = require('./config')
const Database = require('../usecases/database')

const loggerUtils = require('./utils/loggerUtils')
const logger = loggerUtils.createNewLogger('axie-marketplace-monitor')
const server = fastify({ logger })

server.addHook('onError', async (request, reply, error) => {
  logger.error(error)
  reply.internalServerError('failed to process request')
})

const database = async function (server, options) {
  const db = new Database(options.url)
  await db.connect()
  server.decorate('db', db)
}
server.register(fastifyPlugin(database, { fastify: '>=3.3.0' }), { url: config.mongoURL })

server.decorateReply('sendSuccess', function ({ success = true, data = [] }) {
  this.send({ success, data })
})

server.decorateReply('success', function (data) {
  this.send({
    success: true,
    value: data
  })
})

server.register(resources.register)

const start = async () => {
  await server.listen(config.port, config.host)
}

let isShuttingDown = false
const cleanup = async signal => {
  try {
    if (signal) {
      logger.info(signal)
    }
    if (!isShuttingDown) {
      isShuttingDown = true
      logger.info('Exiting...')
      process.exit(0)
    }
  } catch (error) {
    logger.fatal(error)
    process.exit(1)
  }
}

process.on('uncaughtException', cleanup)
process.on('unhandledRejection', cleanup)
process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)

start()
  .catch(cleanup)
