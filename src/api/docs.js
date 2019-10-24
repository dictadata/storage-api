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
router.get('/:docid', authorize([roles.User]), getDoc);
router.put('/', authorize([roles.Editor]), putDoc);
router.put('/:docid', authorize([roles.Editor]), putDoc);
router.post('/', authorize([roles.Editor]), retrieveTitles);
module.exports = router;


/**
 * getDoc
 * @param {*} req
 * @param {*} res
 */
async function getDoc (req, res) {
  logger.verbose('GET docs');

  let docid = req.params['docid'] || req.query['docid'] || (match && (match['docid'] || match['key']));
  let match = req.body.match;

  let smt = config.smt.docs;
  let junction = storage.activate(smt);

  try {
    let results = await junction.recall({key: docid});
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
 * putDoc
 * @param {*} req
 * @param {*} res
 */
async function putDoc (req, res) {
  logger.verbose('POST docs');

  let match = req.body.match;
  let docid = req.params['docid'] || req.query['docid'] || (match && (match['docid'] || match['key']));
  var doc = req.body.doc || {};
  if (!doc.timestamp)
    doc.timestamp = new Date();
  if (!doc.author)
    doc.author = req.user.userid;
  if (typeof doc.context === 'string')
    doc.context = doc.context.split(/\s*(?:,|$)\s*/);

  let smt = config.smt.docs;
  let junction = storage.activate(smt);

  try {
    let results = await junction.store(doc, {key: docid});
    res.set('Cache-Control', 'no-store').jsonp(results);
  }
  catch(err) {
    logger.error(err.message);
    res.status(err.statusCode || 500).send(err.message);
  }
}

/**
 * getDoc
 * @param {*} req
 * @param {*} res
 */
async function retrieveTitles(req, res) {
  logger.verbose('POST docs');

  let pattern = req.body.pattern || req.body;

  let smt = config.smt.docs;
  let junction = storage.activate(smt);

  try {
    let results = await junction.retrieve(pattern);
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
