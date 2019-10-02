/**
 * config.js
 */
"use strict";

const path = require('path');

var settings = {
  serverPort: '8089',
  realm: 'api',
  // api configuration
  accounts_smt: 'elasticsearch|http:/localhost:9200|api_accounts|!key',

  logPath: path.join(__dirname, '../log'),

  publicPath: path.join(__dirname, '../public'),

  // path to directory to contain upload and download folders
  dataPath: path.join(__dirname, '../data'),
  maxFileSize: 200 * 1024 * 1024, // 200MB

  // settings for Codify
  maxKeywordLength: 32,
  maxKeywordValues: 128,

  // api configuration
  settings_smt: 'elasticsearch|http:/localhost:9200|api_settings|!key',

  // mail message defaults
  mail_defaults: {
    from: "",
    to: "",
    subject: "notification from dicta API",
    text: "You are hereby notified."
  },

  smtp_sender: {
    host: "",
    port: 465,
    secure: true,
    auth: {
      user: "",
      pass: ""
    }
  }
};

// development settings
if (process.env.NODE_ENV === 'development') {

  settings.serverPort = '8089';
  settings.accounts_smt = 'elasticsearch|http:/localhost:9200|api_accounts|=userid';

}

module.exports = settings;
