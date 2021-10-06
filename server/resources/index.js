const marketplaceMonitorRouter = require('./router')

const resources = {
  async register (server, options) {
    server.register(marketplaceMonitorRouter, { prefix: '/api/axie/v1' })
  }
}

module.exports = resources
