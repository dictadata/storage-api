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

/**
 * API routes
 */
var router = express.Router();
router.get('/', authorize([roles.User]), getDoc);
router.get('/:name', authorize([roles.User]), getDoc);
router.put('/', authorize([roles.Editor]), putDoc);
router.put('/:name', authorize([roles.Editor]), putDoc);
module.exports = router;

/**
 * startup
 * Wait until server config is updated before initializing.
 */
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
 * getDoc
 * @param {*} req
 * @param {*} res
 */
async function getDoc (req, res) {
  logger.verbose('GET docs');

  let name = req.params['name'] || req.query['name'] || req.body['name'];

  let smt = config.smt.docs;
  let junction = storage.activate(smt);

  try {
    let results = await junction.recall({key: name});
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

/**
 * postDoc
 * @param {*} req
 * @param {*} res
 */
async function putDoc (req, res) {
  logger.verbose('POST docs');

  let name = req.params['name'] || req.query['name'] || req.body['name'];
  var doc = req.body;

  let smt = config.smt.docs;
  let junction = storage.activate(smt);

  try {
    let results = await junction.store(doc, {key: name});
    res.set('Cache-Control', 'no-store').jsonp(results);
  }
  catch(err) {
    logger.error(err.message);
    res.status(err.statusCode || 500).send(err.message);
  }
}
