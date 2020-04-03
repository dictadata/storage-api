/**
 * api/docs
*/
"use strict";

const { logger, StorageError } = require('@dictadata/storage-node');
const storage = require('@dictadata/storage-junctions');
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

  var junction;
  try {
    junction = await storage.activate(config.smt.$_docs);

    const docsEncoding = JSON.parse(fs.readFileSync(path.join(__dirname, 'docs_encoding.json')));

    let encoding = await junction.putEncoding(docsEncoding);
    if (typeof encoding === "object")
      logger.info("docs schema created");
    else if (typeof encoding === "string" && encoding === "schema exists")
      logger.info("docs schema exists");
    else
      logger.warn("could not create docs schema");
  }
  catch (err) {
    logger.error('docs startup failed: ' + err.message);
  }
  finally {
    if (junction)
      junction.relax();
  }
};
