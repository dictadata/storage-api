/**
 * api/settings
*/
"use strict";

const {authorize, roles, logger} = require('@dictadata/storage-node');
const storage = require('@dictadata/storage-junctions');
const express = require('express');
const config = require('../config');

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

  let smt = config.smt.$_settings;
  let junction = storage.activate(smt);

  try {
    let results = await junction.recall({key: key});
    res.set('Cache-Control', 'public, max-age=60, s-maxage=60').jsonp({"settings": results.data});
  }
  catch (err) {
    logger.error(err.message);
    res.status(err.statusCode || 500).send(err.message);
  }
  finally {
    junction.relax();
  }
}

async function putSettings (req, res) {
  logger.verbose('URI \'PUT settings\' was called.');

  var key = req.params['key'];
  var settings = req.body.settings || req.body || {};

  let smt = config.smt.$_settings;
  let junction = storage.activate(smt);

  try {
    let results = await junction.store(settings, {key: key});
    res.set('Cache-Control', 'no-store').jsonp(results);
  }
  catch(err) {
    logger.error(err.message);
    res.status(err.statusCode || 500).send(err.message);
  }
}
