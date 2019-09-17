"use strict";
/**
 * server main.js
 */

const storagenode = require('@dicta.io/storage-node');
const config = require('./config');
const api = require('./api');

config.routerPath = '/api';
config.router = api;

console.log('start');
storagenode.start(config);
console.log('finish');
