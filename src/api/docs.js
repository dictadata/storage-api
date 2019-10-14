/**
 * api/docs
*/
"use strict";

const {authorize, roles, logger} = require('@dicta-io/storage-node');
const storage = require('@dicta-io/storage-junctions');
const express = require('express');
const config = require('../config');

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
 * getDoc
 * @param {*} req
 * @param {*} res
 */
async function getDoc (req, res) {
  logger.verbose('GET docs');

  let match = req.body.match;
  let name = req.params['name'] || req.query['name'] || (match && (match['name'] || match['key']));

  let smt = config.smt.docs;
  let junction = storage.activate(smt);

  try {
    let results = await junction.recall({key: name});
    results.doc = results.data;
    delete results.data;
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

  let match = req.body.match;
  var doc = req.body.doc || {};
  let name = req.params['name'] || req.query['name'] || (match && (match['name'] || match['key']));

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
