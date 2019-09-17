"use strict";
/**
 * api/upload.js
 */

const {authorize, roles} = require('@dicta.io/storage-node');
const express = require('express');
const formidable = require('formidable');
const util = require('util');
const config = require('../config');
const logger = require('../logger');

/**
 * API routes
 */
var router = express.Router();
router.post('/', authorize([roles.User]), fileUpload);
module.exports = router;


function fileUpload (req, res) {
  logger.info('URI \'POST \' was called.');

  var fm = new formidable.IncomingForm();
  fm.encoding = 'utf-8';
  fm.uploadDir = __dirname + "/../test/uploads";
  fm.keepExtensions = true;
  fm.maxFileSize = 200 * 1024 * 1024; // 200MB
  fm.multiples = true;

  fm.parse(req, function(err, fields, files) {
    res.writeHead(200, {'content-type': 'text/plain'});
    res.write('received upload:\n\n');
    res.end(util.inspect({fields: fields, files: files},{depth:3}));
  });
}
