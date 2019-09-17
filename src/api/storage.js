"use strict";
/**
 * api/storage.js
*/

const {authorize, roles} = require('@dicta.io/storage-node');
const storage = require('@dicta.io/storage-junctions');
const express = require('express');
const config = require('../config');
const logger = require('../logger');

/**
 * API routes
 */

var router = express.Router();
router.get('/encoding/:SMT', authorize([roles.User,roles.Admin]), getEncoding);
router.put('/encoding/:SMT', authorize([roles.User,roles.Admin]), putEncoding);

router.put('/store/:SMT', authorize([roles.User,roles.Admin]), store);
router.put('/recall/:SMT', authorize([roles.User,roles.Admin]), recall);
router.delete('/dull/:SMT', authorize([roles.User,roles.Admin]), dull);

router.post('/retrieve/:SMT', authorize([roles.User,roles.Admin]), retrieve);
module.exports = router;

/**
 * getEncoding
 * @param {*} req
 * @param {*} res
 */
async function getEncoding (req, res) {
  logger.info('GET /storage/encoding');

  var smt = req.params['SMT'];

  try {
    var junction = storage.create(smt);
    let encoding = await junction.getEncoding();
    //console.log(encoding);
    res.jsonp(encoding);
  }
  catch(err) {
    console.log(err);
    logger.error(err);
    res.jsonp(err);
  }
}

/**
 * putEncoding
 * @param {*} req
 * @param {*} res
 */
async function putEncoding (req, res) {
  logger.info('PUT /storage/encoding');

  var smt = req.params['SMT'];
  var encoding = req.body;

  try {
    var junction = storage.create(smt);
    let results = await junction.putEncoding(encoding);
    res.jsonp(results);
  }
  catch(err) {
    res.jsonp(err);
  }
}

/**
 * store
 * @param {*} req
 * @param {*} res
 */
async function store (req, res) {
  logger.info('PUT /storage/store');

  var smt = req.params['SMT'];
  var construct = req.body;

  try {
    var junction = storage.create(smt);
    let results = await junction.store(construct);
    res.jsonp(results);
  }
  catch(err) {
    res.jsonp(err);
  }
}

/**
 * recall
 * @param {*} req
 * @param {*} res
 */
async function recall (req, res) {
  logger.info('POST /storage/recall');

  var smt = req.params['SMT'];

  try {
    var junction = storage.create(smt);
    let results = await junction.recall();
    res.jsonp(results);
  }
  catch(err) {
    res.jsonp(err);
  }
}

/**
 * dull
 * @param {*} req
 * @param {*} res
 */
async function dull (req, res) {
  logger.info('POST /storage/dull');

  var smt = req.params['SMT'];

  try {
    var junction = storage.create(smt);
    let results = await junction.dull();
    res.jsonp(results);
  }
  catch(err) {
    res.jsonp(err);
  }
}

/**
 * retreive
 * @param {*} req
 * @param {*} res
 */
async function retrieve (req, res) {
  logger.info('POST /storage/retrieve');

  var smt = req.params['SMT'];
  let pattern = req.body.pattern;

  try {
    var junction = storage.create(smt);
    let results = await junction.retrieve(pattern);
    res.jsonp(results);
  }
  catch(err) {
    console.log(err);
    logger.error(err);
    res.jsonp(err);
  }
}
