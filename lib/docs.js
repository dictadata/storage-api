/**
 * api/docs
*/
"use strict";

const { logger, StorageError } = require('@dictadata/storage-node');
const storage = require('@dictadata/storage-junctions');
const fs = require("fs");
const path = require('path');

exports.encoding = null;

/**
 * startup
 * Wait until server config is updated before initializing.
 */
exports.startup = async (config) => {
  logger.info("docs startup");
  logger.verbose("docs SMT: " + JSON.stringify(config.smt.$_docs));

  var junction;
  try {
    const encoding = exports.encoding = JSON.parse(fs.readFileSync(path.join(__dirname, 'docs_encoding.json')));

    junction = await storage.activate(config.smt.$_docs);
    let results = await junction.getEncoding();
    if (typeof results === "object")
      logger.verbose("docs schema exists");
    else {
      let results = await junction.putEncoding(encoding);
      if (typeof results !== "object")
        throw new Error("could not create docs schema");
    }
  }
  catch (err) {
    logger.error('docs startup failed: ' + err.message);
  }
  finally {
    if (junction)
      junction.relax();
  }
};
