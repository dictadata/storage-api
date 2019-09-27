"use strict";

const {authorize,roles} = require('@dicta-io/storage-node');
const storage = require('@dicta-io/storage-junctions');
const express = require('express');
const formidable = require('formidable');
const fs = require('fs');
const stream = require('stream');
const util = require('util');
const config = require('../config');
const logger = require('../logger');

const pipeline = util.promisify(stream.pipeline);

/**
 * API routes
 */
var router = express.Router();
router.get('/test', authorize([roles.Admin,roles.DevOps]), test);
router.post('/import', authorize([roles.Admin,roles.Import]), importFile);
router.post('/copy', authorize([roles.Admin, roles.Import]), copy);
router.post('/transform', authorize([roles.Admin,roles.ETL]), transform);
module.exports = router;

/**
 *  API handlers
 */

async function test(req, res) {
  logger.info('request GET /import/test');

  var j1 = storage.activate("csv|./test/data/|testfile.csv|*", { filename: './test/data/testfile.csv' });
  var j2 = storage.activate("csv|./test/data/|testoutput.csv|*", { filename: './test/data/testoutput.csv' });

  try {
    let encoding = await j1.getEncoding();

    //console.log(">>> encoding results");
    //console.log(encoding);
    //console.log(JSON.stringify(encoding.fields));

    //console.log(">>> put destination encoding");
    await j2.putEncoding(encoding);

    //console.log(">>> create streams");
    var reader = j1.getReadStream();
    var writer = j2.getWriteStream();

    //console.log(">>> start pipe");
    await pipeline(reader, writer)
    res.jsonp({status: "OK"});
  }
  catch(err) {
    console.log(err);
    res.jsonp(err);
  }
  finally {
    j1.relax();
    j2.relax();
  }
}

async function importFile (req, res) {
  logger.info('request POST /import/csv');
  //console.log(req.body)

  let form = new formidable.IncomingForm();
  form.encoding = 'utf-8';
  form.maxFileSize = config.maxFileSize;
  form.multiples = true;
  //form.keepExtensions = false;
  //form.uploadDir = os.tempdir();

  // parse req.body into inputs (form fields) and files
  form.parse(req, async function(err, fields, files) {
    //console.log('formidable parse')
    //console.log(fields);
    //console.log(files);

    let importList = JSON.parse(fields.importList);
    console.log("importList length " + importList.length);

    let fileList = [];
    if (!Array.isArray(files.fileList))
      fileList.push(files.fileList);  // single file upload
    else
      fileList = files.fileList; // multiple files
    //console.log("fileList length " + fileList.length)

    if (importList.length != fileList.length) {
      let err = new Error('Invalid input values');
      logger.error(err);
      res.jsonp(err);
      return;
    }

    // create upload/prefix directory if needed
    let uploadDir = config.uploadsPath + fields.prefix + "/";
    if (!fs.existsSync(uploadDir))
      fs.mkdirSync(uploadDir, { recursive: true });

    // move files to upload directory
    for (let i = 0; i < fileList.length; i++) {
      console.log(i, importList[i]);
      let filename = uploadDir + fileList[i].name;
      importList[i].filename = filename;
      console.log('src: ', fileList[i].path);
      console.log('dst: ', filename);
      try {
        if (fs.existsSync(filename)) {
          console.log("dst exists");
          fs.unlinkSync(filename);
        }
        fs.renameSync(fileList[i].path, filename);
      }
      catch (err) {
        logger.error(err);
      }
    }

    //console.log(importList);
    for (let i = 0; i < importList.length; i++) {
      let index = fields.prefix + '_' + importList[i].container;

      var j1 = storage.activate("csv|.|input.csv|*", { filename: importList[i].filename });
      var j2 = storage.activate("elasticsearch|./test/data/|testoutput.csv|*");

      try {
        var reader = j1.getReadStream();
        var writer = j2.getWriteStream();

        // examine file for encodings
        let numLines = -1;
        let results = await reader.codify(numLines);
        console.log(results);

        // update destination encodings
        results = await writer.putEncoding(reader.getEncoding());
        console.log(results);

        // read csv records and import to Elasticsearch
        results = await reader.scan(writer);
        console.log(results);

        res.jsonp(results);
      }
      catch(err) {
        logger.error(err);
        res.jsonp(err);
      }
      finally {
        j1.relax();
        j2.relax();
      }
    }

  });
}

async function copy(req, res) {

}

async function transform(req, res) {

}
