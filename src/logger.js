/**
 * logger.js
 */
"use strict";

const winston = require('winston');
const path = require('path');
const config = require('./config');

const _level = process.env.LOG_LEVEL || 'info';

const logger = winston.createLogger({
  level: _level,
  format: winston.format.json(),
  transports: [
    //
    // - Write to all logs with level `info` and below to `app.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: path.join(config.logPath, config.realm + '.log') }),
    new winston.transports.File({ filename: path.join(config.logPath, config.realm + '_error.log'), level: 'error' })
  ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
