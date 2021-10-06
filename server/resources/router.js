const axieSalesHistoryController = require('./controller/axieSalesHistoryController')
const axieSalesListController = require('./controller/axieSalesListController')

const router = async function (server, options) {
  server.route({
    method: 'POST',
    url: '/sales-history',
    handler: axieSalesHistoryController.produce
  })

  server.route({
    method: 'POST',
    url: '/sales-history/list',
    handler: axieSalesHistoryController.list
  })

  server.route({
    method: 'POST',
    url: '/sales/list',
    handler: axieSalesListController.list
  })

  server.route({
    method: 'POST',
    url: '/sales/best-match',
    handler: axieSalesListController.bestMatch
  })
}

module.exports = router
