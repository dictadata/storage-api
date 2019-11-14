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

  routes: {

  },

  smt: {
    // storage node authentication
    $_accounts: 'elasticsearch|http:/localhost:9200|api_accounts|!userid',

    // api configuration
    $_settings: {
      model: 'elasticsearch',
      locus: 'http:/localhost:9200',
      schema: 'api_settings',
      key: '!key'
    },

    $_docs: {
      model: 'elasticsearch',
      locus: 'http:/localhost:9200',
      schema: 'api_docs',
      key: '!docid'
    }

  },

  // use base node route handlers
  node: {
    useStorage: true,
    useTransfer: true,
    useFileio: true
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
  config.smt.$_accounts = 'elasticsearch|http:/localhost:9200|api_accounts|!userid';

  config.smt.$_settings = {
    model: 'elasticsearch',
    locus: 'http:/localhost:9200',
    schema: 'api_settings',
    key: '!key'
  };

  config.smt.$_docs = {
    model: 'elasticsearch',
    locus: 'http:/localhost:9200',
    schema: 'api_docs',
    key: '!docid'
  };

  config.smt.es_test_schema_0 = "elasticsearch|http://localhost:9200|test_schema|*";
  config.smt.es_test_schema_1 = "elasticsearch|http://localhost:9200|test_schema|!Foo";
  config.smt.es_test_schema_2 = "elasticsearch|http://localhost:9200|test_schema|=Foo";
  config.smt.es_test_schema_u = "elasticsearch|http://localhost:9200|test_schema|first";

  config.smt.es_test_transfer = "elasticsearch|http://localhost:9200|test_transfer|=Foo";
  config.smt.es_test_transfer_2 = "elasticsearch|http://localhost:9200|test_transfer_2|=Foo";
  config.smt.es_test_transfer_3 = "elasticsearch|http://localhost:9200|test_transfer_3|=Foo";

  config.smt.mysql_test_schema_0 = "mysql|host=localhost;user=dicta;password=dicta;database=storage_node|test_schema|*";
  config.smt.mysql_test_schema_1 = "mysql|host=localhost;user=dicta;password=dicta;database=storage_node|test_schema|!Foo";
  config.smt.mysql_test_schema_2 = "mysql|host=localhost;user=dicta;password=dicta;database=storage_node|test_schema|=Foo";

  config.smt.mysql_test_transfer_2 = "mysql|host=localhost;user=dicta;password=dicta;database=storage_node|test_transfer_2|=Foo";

}

module.exports = config;
