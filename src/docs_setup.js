/**
 * api/docs
*/
"use strict";

const { logger, StorageError } = require('@dicta-io/storage-node');
const storage = require('@dicta-io/storage-junctions');
const fs = require("fs");
const path = require('path');

/**
 * startup
 * Wait until server config is updated before initializing.
 */
exports.startup = async (config) => {
  logger.verbose("docs startup");
  logger.info("docs SMT: " + JSON.stringify(config.smt.$_docs));

  let engram = new storage.Engram(config.smt.$_docs);
  if (engram.keyof !== 'key') {
    throw new StorageError({ statusCode: 400 }, "invalid key type in config.smt.$_docs");
  }

  var junction = storage.activate(config.smt.$_docs);

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
};
