"use strict";
/**
 * server main.js
 */

const storagenode = require('@dictadata/storage-node');
const config = require('./config');

// add roles before loading route files
Object.assign(storagenode.roles, config.roles);

// add routes
const api_router = require('./my-api');
config.routes["/" + config.realm] = api_router;

// init docs storage at startup
const docs_startup = require('./docs_startup');
storagenode.startup.add(docs_startup.startup);

// start server with config settings
storagenode.start(config);
