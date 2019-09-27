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


async function getSettings (req, res) {
  logger.info('URI \'GET settings\' was called.');

  let name = req.params['name'];

  let smt = config.smt_settings;
  let junction = storage.activate(smt);

  try {
    let results = await junction.recall({key:name});
    res.jsonp(results.data);
  }
  catch (err) {
    logger.error(err.message);
    res.jsonp(err.message);
  }
  finally {
    junction.relax();
  }
}

async function putSettings (req, res) {
  logger.info('URI \'PUT settings\' was called.');

  var name = req.params['name'];
  var settings = req.body;

  let smt = config.smt_settings;
  let junction = storage.activate(smt);

  try {
    let results = await junction.store(settings, {key: name})
    res.jsonp(results);
  }
  catch(err) {
    logger.error(err.message);
    res.jsonp(err.message);
  }
}
