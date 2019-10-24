/**
 * config.js
 */
"use strict";

const path = require('path');

var config = {
  serverPort: '8089',
  realm: 'api',

  dataPath: path.join(__dirname, '../data'),
  publicPath: path.join(__dirname, '../public'),
  logPath: path.join(__dirname, '../log'),
  logLevel: 'info',

  // additional roles for app/api
  roles: {
    Notify: "Notify",
    Editor: "Editor"
  },

  // placeholder, each property is "route": router
  routes: {
    //"api": null
  },
  smt: {
    // storage node authentication
    accounts: 'elasticsearch|http:/localhost:9200|api_accounts|!userid',

    // api configuration
    settings: {
      model: 'elasticsearch',
      locus: 'http:/localhost:9200',
      schema: 'api_settings',
      key: '!key'
    },
    docs: {
      model: 'elasticsearch',
      locus: 'http:/localhost:9200',
      schema: 'api_docs',
      key: '!docid'
    }

  },

  // use node route handlers
  node: {
    useStorage: true,
    useTransform: true,
    useFileio: true,
    useNotify: true
  },

  // fileio max upload size
  maxFileSize: 200 * 1024 * 1024, // 200MB

  // notify mail defaults
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
  },

};

// development config
if (process.env.NODE_ENV === 'development') {

  config.serverPort = '8089';
  config.logLevel = 'verbose';
  config.smt.accounts = 'elasticsearch|http:/localhost:9200|api_accounts|!userid';

  config.smt.settings = {
    model: 'elasticsearch',
    locus: 'http:/localhost:9200',
    schema: 'api_settings',
    key: '!key'
  };

  config.smt.settings = {
    model: 'elasticsearch',
    locus: 'http:/localhost:9200',
    schema: 'api_docs',
    key: '!key'
  };

}

module.exports = config;
