"use strict";
/**
 * server main.js
 */

const storagenode = require('@dictadata/storage-node');
const config = require('./config');

const api_router = require('./api');
const docs_startup = require('./docs_startup');

config.routes["/" + config.realm] = api_router;

storagenode.startup.add(docs_startup.startup);
storagenode.start(config);
