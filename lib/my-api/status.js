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

function api_status(req, res) {
  logger.debug('my-api/status');

  var info = {
    result: 'OK',
    name: config.name,
    version: config.version,
    time: new Date().toISOString()
  };
  //info.userid = ' + request.user.userid + '/' + request.user.password;

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify(info));
  res.end();
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
