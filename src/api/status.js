/**
 * api/status
 */
"use strict";

// contains some simple, general purpose actions

const {authorize,roles,logger} = require('@dictadata/storage-node');
const express = require('express');
const config = require('../config');

/**
 * API/status routes
 */
var router = express.Router();
router.get('/', authorize([roles.User, roles.Admin, roles.Monitor]), api_status);
module.exports = router;

function api_status(request, response) {
  logger.verbose('URI \'api\\status\' was called.');

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
  logger.verbose('URI \'esstatus\' was called.');

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
