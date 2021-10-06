const pinoms = require('pino-multi-stream')
const os = require('os')
const hostname = os.hostname()

function createNewLogger (name, streams = []) {
  streams.push(pinoms.prettyStream())
  const logger = pinoms({
    name,
    level: 'debug',
    streams
  })
  return logger.child({
    hostname
  })
}

module.exports = { createNewLogger }
