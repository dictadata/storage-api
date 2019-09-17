/**
 * config.js
 */
"use strict";

const path = require('path');

var settings = {
  realm: 'api',
  serverPort: '8089',

  // path to log files
  logPath: path.join(__dirname, '../log'),

  publicPath: path.join(__dirname, '../public'),

  // settings for uploading files
  maxFileSize: 200 * 1024 * 1024, // 200MB
  uploadsPath: path.join(__dirname, "../data/uploads/"),

  // settings for ETL Codify
  maxKeywordLength: 32,
  maxKeywordValues: 128,

  // elasticsearch storage
  mappingsPath: path.join(__dirname, "../data/mappings/"),
  defaultMappings: path.join(__dirname, "./storage/elastic/_defaultMappings.json"),

  templatesPath: path.join(__dirname, "../data/templates/"),
  defaultTemplate: path.join(__dirname, "./storage/elastic/_defaultTemplate.json"),

};

// development settings
if (process.env.NODE_ENV === 'development') {

  settings.serverPort = '8089';
  settings.accounts_smt = 'elasticsearch|http:/localhost:9200|api_accounts|=userid';

}

module.exports = settings;
