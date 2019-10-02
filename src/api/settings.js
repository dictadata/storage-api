/**
 * api/settings
*/
"use strict";

var {authorize, roles} = require('@dicta-io/storage-node');
var storage = require('@dicta-io/storage-junctions');
const express = require('express');
const config = require('../config');
const logger = require('../logger');

/**
 * API routes
 */

var router = express.Router();
router.get('/:key', authorize([roles.User]), getSettings);
router.put('/:key', authorize([roles.User]), putSettings);
module.exports = router;


async function getSettings (req, res) {
  logger.verbose('URI \'GET settings\' was called.');

  let key = req.params['key'];

  let smt = config.settings_smt;
  let junction = storage.activate(smt);

  try {
    let results = await junction.recall({key: key});
    res.jsonp(results);
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
  logger.verbose('URI \'PUT settings\' was called.');

  var key = req.params['key'];
  var settings = req.body;

  let smt = config.settings_smt;
  let junction = storage.activate(smt);

  try {
    let results = await junction.store(settings, {key: key});
    res.jsonp(results);
  }
  catch(err) {
    logger.error(err.message);
    res.jsonp(err.message);
  }
}
