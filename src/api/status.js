"use strict";
/**
 * api/status.js
 */

// contains some simple, general purpose actions

const {authorize,roles} = require('@dicta.io/storage-node');
const express = require('express');
const config = require('../config');
const logger = require('../logger');

/**
 * API/status routes
 */
var router = express.Router();
router.get('/', authorize([roles.User, roles.Admin, roles.Monitor]), api_status);
module.exports = router;

function api_status(request, response) {
  logger.info('URI \'api\\status\' was called.');

  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.write('OK\r\n');
  let date = new Date();
  response.write(date.toISOString() + '\r\n');
  //response.write('userid: ' + request.user.userid + '/' + request.user.password);
  if (config.useSessions)
    response.write('flash message: ' + request.flash('info'));
  response.end();
}

/*
function statusElastic(request, response) {
  console.log('URI \'esstatus\' was called.');

  let elastic = new Elastic(config.realm);
  elastic.status()
      .then(results => {
        response.writeHead(200, { 'Content-Type': 'text/plain' });
        response.write(results + '\r\n');
        response.end();
      })
      .catch(error => {
        response.write(error + '\r\n');
        response.end();
      });
}
*/
