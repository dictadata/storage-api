"use strict";
/**
 * server main.js
 */

const storagenode = require('@dicta-io/storage-node');
const config = require('./config');
const api = require('./api');
const docs = require('./docs');

config.routerPath = '/api';
config.router = api;

storagenode.start(config);
