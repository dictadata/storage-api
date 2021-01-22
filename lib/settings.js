/**
 * api/settings
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
  logger.info("settings startup");
  logger.verbose("settings SMT: " + JSON.stringify(config.smt.$_settings));

  var junction;
  try {
    let engram = new storage.Engram(config.smt.$_settings);
    if (engram.keyof === 'primary') {
      let encoding = exports.encoding = JSON.parse(fs.readFileSync(path.join(__dirname, 'settings_encoding.json')));

      // create table for databases, not necessary for 'key' datastores
      junction = await storage.activate(config.smt.$_settings);
      let results = await junction.getEncoding();
      if (typeof results === "object")
        logger.verbose("settings schema exists");
      else {
        let results = await junction.putEncoding(encoding);
        if (typeof results !== "object")
          throw new Error("could not create settings schema");
      }
    }
  }
  catch (err) {
    logger.error('settings startup failed: ' + err.message);
  }
  finally {
    if (junction)
      junction.relax();
  }
};
