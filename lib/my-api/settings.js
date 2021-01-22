/**
 * api/settings
*/
"use strict";

const {authorize, roles, logger} = require('@dictadata/storage-node');
const storage = require('@dictadata/storage-junctions');
const express = require('express');
const config = require('../config');
const _settings = require('../settings');

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

  var junction;
  try {
    let smt = config.smt.$_settings;
    junction = await storage.activate(smt);
    if (junction.engram.keyof === 'primary')
      junction.putEncoding(_settings.encoding, true);  // overlay schema
    
    let results = await junction.recall({ "key": key });  // works for keystore and databases
    let settings = results.result === "ok" ? results.data[key] || results.data[0] : {};
    if (junction.engram.keyof === 'primary')
      settings = settings.value;
    res.set('Cache-Control', 'public, max-age=60, s-maxage=60').jsonp(results);
  }
  catch (err) {
    logger.error(err.message);
    res.status(err.statusCode || 500).send(err.message);
  }
  finally {
    if (junction)
      junction.relax();
  }
}

async function putSettings (req, res) {
  logger.verbose('URI \'PUT settings\' was called.');

  var key = req.params['key'];
  var settings = req.body.settings || req.body || {};

  var junction;
  try {
    let smt = config.smt.$_settings;
    junction = await storage.activate(smt);

    if (junction.engram.keyof === 'primary') {
      junction.putEncoding(_settings.encoding, true);  // overlay schema

      settings = {
        "key": key,
        "value": settings
      }
    }

    let results = await junction.store(settings, {"key": key});
    res.set('Cache-Control', 'no-store').jsonp(results);
  }
  catch(err) {
    logger.error(err.message);
    res.status(err.statusCode || 500).send(err.message);
  }
  finally {
    if (junction)
      junction.relax();
  }
}
