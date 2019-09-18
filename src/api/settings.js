"use strict";/**
 * api/settings.js
*/

var {authorize, roles} = require('@dicta-io/storage-node');
var storage = require('@dicta-io/storage-junctions');
const express = require('express');
const config = require('../config');
const logger = require('../logger');

/**
 * API routes
 */

var router = express.Router();
router.get('/:name', authorize([roles.User]), getSettings);
router.put('/:name', authorize([roles.User]), putSettings);
module.exports = router;


function getSettings (req, res) {
  logger.info('URI \'GET settings\' was called.');

  let name = req.params['name'];

  let smt = config.smt_settings;
  let junction = storage.create(smt);

  junction.recall({key:name})
  .then(results => {
    res.jsonp(results.data);
  })
  .catch(error => {
    logger.error(error.message);
    res.jsonp(error.message);
  });
}

function putSettings (req, res) {
  logger.info('URI \'PUT settings\' was called.');

  var name = req.params['name'];
  var settings = req.body;

  let smt = config.smt_settings;
  let junction = storage.create(smt);

  junction.store(settings, {key: name})
  .then(results => {
    res.jsonp(results);
  })
  .catch(error => {
    logger.error(error.message);
    res.jsonp(error.message);
  });
}
