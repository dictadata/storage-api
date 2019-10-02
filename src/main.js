"use strict";
/**
 * server main.js
 */

const storagenode = require('@dicta-io/storage-node');
const config = require('./config');
const logger = require('./logger');
const api = require('./api');

config.routerPath = '/api';
config.router = api;

logger.info('start service');
storagenode.start(config);
