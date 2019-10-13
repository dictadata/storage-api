/**
 * api/docs
*/
"use strict";

var {authorize, roles, logger, startup, StorageError} = require('@dicta-io/storage-node');
var storage = require('@dicta-io/storage-junctions');
const express = require('express');
const config = require('../config');
const fs = require("fs");
const path = require('path');

// wait until server config is updated before initializing
startup.add( async (config) => {
  logger.verbose("docs startup");
  logger.info("docs SMT: " + JSON.stringify(config.smt.docs));

  let engram = new storage.Engram(config.smt.docs);
  if (engram.keyof !== 'key') {
    throw new StorageError({statusCode: 400}, "invalid key type in config.smt.docs");
  }

  var junction = storage.activate(config.smt.docs);

  try {
    const docsEncoding = JSON.parse(fs.readFileSync(path.join(__dirname, 'docs_encoding.json')));

    let encoding = await junction.putEncoding(docsEncoding);
    if (encoding)
      logger.info("docs schema valid: " + junction._engram.smt.schema);
    else
      logger.warn("could not create docs schema, maybe it already exists");
  }
  catch (err) {
    logger.error('docs startup failed: ' + err.message);
  }
  finally {
    junction.relax();
  }
});

/**
 * API routes
 */
var router = express.Router();
router.get('/:docname', authorize([roles.User]), getDoc);
router.post('/', authorize([roles.Editor]), postDoc);
module.exports = router;

async function getDoc (req, res) {
  logger.verbose('GET docs');

  let docname = req.params['docname'] || req.body['name'];

  let smt = config.smt.docs;
  let junction = storage.activate(smt);

  try {
    let results = await junction.recall({key: docname});
    res.set('Cache-Control', 'public, max-age=60, s-maxage=60').jsonp(results);
  }
  catch (err) {
    logger.error(err.message);
    res.status(err.statusCode || 500).send(err.message);
  }
  finally {
    junction.relax();
  }
}

async function postDoc (req, res) {
  logger.verbose('POST docs');

  var docname = req.params['docname'] || req.body['name'];
  var doc = req.body;

  let smt = config.smt.docs;
  let junction = storage.activate(smt);

  try {
    let results = await junction.store(doc, {key: docname});
    res.set('Cache-Control', 'no-store').jsonp(results);
  }
  catch(err) {
    logger.error(err.message);
    res.status(err.statusCode || 500).send(err.message);
  }
}
