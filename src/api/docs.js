/**
 * api/docs
*/
"use strict";

var {authorize, roles, logger} = require('@dicta-io/storage-node');
var storage = require('@dicta-io/storage-junctions');
const express = require('express');
const config = require('../config');

/**
 * API routes
 */

var router = express.Router();
router.get('/:docname', authorize([roles.User]), getDoc);
router.post('/', authorize([roles.Editor]), postDoc);
module.exports = router;


async function getDoc (req, res) {
  logger.verbose('GET docs');

  let docname = req.params['docname'];

  let smt = config.smt.docs;
  let junction = storage.activate(smt);

  try {
    let results = await junction.recall({docname: docname});
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

  var docname = req.params['docname'];
  var doc = req.body;

  let smt = config.smt.docs;
  let junction = storage.activate(smt);

  try {
    let results = await junction.store(doc, {docname: docname});
    res.set('Cache-Control', 'no-store').jsonp(results);
  }
  catch(err) {
    logger.error(err.message);
    res.status(err.statusCode || 500).send(err.message);
  }
}
