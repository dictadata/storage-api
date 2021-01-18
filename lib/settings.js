/**
 * api/settings
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
  logger.info("settings startup");
  logger.verbose("settings SMT: " + JSON.stringify(config.smt.$_settings));

  var junction;
  try {
    let engram = new storage.Engram(config.smt.$_settings);
    if (engram.keyof === 'primary') {
      const settingsEncoding = JSON.parse(fs.readFileSync(path.join(__dirname, 'settings_encoding.json')));

      junction = await storage.activate(config.smt.$_settings);

      // create table for databases, not necessary for 'key' datastores
      let encoding = await junction.getEncoding();
      if (typeof encoding === "object")
        logger.verbose("accounts schema exists");
      else {
        let encoding = await junction.putEncoding(settingsEncoding);
        if (typeof encoding !== "object")
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
