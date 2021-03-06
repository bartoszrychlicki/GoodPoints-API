const express = require('express')
require('express-async-errors')

const app = express()
var cors = require('cors')

const winston = require('winston')

//winston.remove(winston.transports.Console);
winston.configure({
  transports: [
    new winston.transports.File({
      filename: 'logfile.log',
      handleExceptions: true,
      humanReadableUnhandledException: true,
    }),
    new winston.transports.Console({
      name: 'c2',
      handleExceptions: true,
      humanReadableUnhandledException: true,
    }),
  ],
})

const port = process.env.PORT || 3003
require('./startup/config')()
require('./startup/prod')(app)
require('./startup/db')()
require('./startup/routes')(app)

const server = app.listen(port, () => {
  winston.info('Listening on port:', port)
})

module.exports = server
