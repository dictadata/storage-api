"use strict";
/**
 * server main.js
 */

const storagenode = require('@dicta-io/storage-node');
const config = require('./config');

const api_router = require('./api');
const docs_setup = require('./docs_setup');

config.routes[config.realm] = api_router;

storagenode.startup.add(docs_setup.startup);
storagenode.start(config);
