/**
 * api/docs
*/
"use strict";

const {authorize, roles, logger} = require('@dictadata/storage-node');
const storage = require('@dictadata/storage-junctions');
const express = require('express');
const config = require('../config');
const _docs = require("../docs");

/**
 * API routes
 */
var router = express.Router();
router.get('/', authorize([roles.User]), getDoc);
router.get('/:docid', authorize([roles.User]), getDoc);
router.post('/', authorize([roles.User]), retrieveTitles);

router.put('/', authorize([roles.Editor]), putDoc);
router.put('/:docid', authorize([roles.Editor]), putDoc);
module.exports = router;


/**
 * getDoc
 * @param {*} req
 * @param {*} res
 */
async function getDoc (req, res) {
  logger.verbose('GET docs');

  let match = (req.body.pattern && req.body.pattern.match) || req.body.match || {};
  let docid = req.params['docid'] || req.query['docid'] || req.body["key"] || (match && (match['docid'] || match['key']));

  var junction;
  try {
    let smt = config.smt.$_docs;
    junction = await storage.activate(smt);
    if (junction.engram.keyof === 'primary')
      junction.putEncoding(_docs.encoding, true);  // overlay schema
    
    let pattern = {};
    if (junction.engram.keyof === 'key')
      pattern["key"] = docid;
    else
      pattern["docid"] = docid;  // pattern not used with primary key

    let results = await junction.recall(pattern);
    results.doc = results.data;
    delete results.data;
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

/**
 * putDoc
 * @param {*} req
 * @param {*} res
 */
async function putDoc (req, res) {
  logger.verbose('POST docs');

  var doc = req.body.doc || req.body.data || req.body || {};
  let docid = req.params['docid'] || req.query['docid'] || doc.docid || '';

  if (!doc.dateCreated)
    doc.dateCreated = new Date();
  doc.dateUpdated = new Date();
  if (!doc.author)
    doc.author = req.user.userid;
  if (typeof doc.context === 'string')
    doc.context = doc.context.split(/\s*(?:,|$)\s*/);

  var junction;
  try {
    let smt = config.smt.$_docs;
    junction = await storage.activate(smt);
    if (junction.engram.keyof === 'primary')
      junction.putEncoding(_docs.encoding, true);  // overlay schema

    let pattern = {};
    if (junction.engram.keyof === 'key')
      pattern["key"] = docid;
    //else
    //  pattern["docid"] = docid;  // pattern not used with primary key

    let results = await junction.store(doc, pattern);
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

/**
 * getDoc
 * @param {*} req
 * @param {*} res
 */
async function retrieveTitles(req, res) {
  logger.verbose('POST docs');

  let pattern = req.body.pattern || req.body;

  var junction;
  try {
    let smt = config.smt.$_docs;
    junction = await storage.activate(smt);
    if (junction.engram.keyof === 'primary')
      junction.putEncoding(_docs.encoding, true);  // overlay schema
    
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
    if (junction)
      junction.relax();
  }
}
