/**
 * config.js
 */
"use strict";

const path = require('path');

var config = {
  // port for client connections
  serverPort: '8080',
  // used for routes and prefixing storage container names, e.g. realm_accounts
  realm: 'my-api',

  // path to log files
  logPath: path.join('/var/log/storage-node'),
  logPrefix: 'my-api',
  logLevel: 'info',

  // path to web root with index.html, robots.txt, ...
  publicPath: path.join(__dirname, '../public'),
  // path to directory to contain upload and download folders
  dataPath: path.join(__dirname, '../data'),

  // additional user roles for my-api
  roles: {
    "Editor": "Editor",
    "Notify": "Notify"
  },

  // place holder for application defined routes, set in app.js
  routes: {
  },

  // production routes
  smt: {
    // storage-node API authentication
    $_accounts: 'elasticsearch|http:/localhost:9200|api_accounts|!userid',

    // my-api configuration
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

  // default Passport.js authentication strategy
  auth_strategy: 'basic', // 'local', 'basic', 'digest'

  // use node route handlers
  "node-api": {
    useStorage: true,
    useTransfer: true,
    useClientStream: false,  // not fully implemented
    useTransport: false   // not fully implemented
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

  // path to log files
  config.logPath = path.join(__dirname, '../log'),
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

  // data storage for tests
  config.smt["csv_foofile"] = "csv|./test/data/|foofile.csv|*";
  config.smt["json_foofile"] = "json|./test/data/|foofile.json|*";

  config.smt.es_foo_schema    = "elasticsearch|http://localhost:9200|foo_schema|*";
  config.smt.es_foo_schema_ks = "elasticsearch|http://localhost:9200|foo_schema|!";
  config.smt.es_foo_schema_kf = "elasticsearch|http://localhost:9200|foo_schema|!Foo";
  config.smt.es_foo_schema_pk = "elasticsearch|http://localhost:9200|foo_schema|=Foo";
  config.smt.es_foo_schema_id = "elasticsearch|http://localhost:9200|foo_schema|twenty";

  config.smt.es_foo_transfer  = "elasticsearch|http://localhost:9200|foo_transfer|=Foo";
  config.smt.es_foo_transform = "elasticsearch|http://localhost:9200|foo_transform|=Foo";

  config.smt.mysql_foo_schema    = "mysql|host=localhost;user=dicta;password=dicta;database=storage_node|foo_schema|*";
  config.smt.mysql_foo_schema_pk = "mysql|host=localhost;user=dicta;password=dicta;database=storage_node|foo_schema|=Foo";

  config.smt.mysql_foo_transfer  = "mysql|host=localhost;user=dicta;password=dicta;database=storage_node|foo_transfer|=Foo";
  config.smt.mysql_foo_transform = "mysql|host=localhost;user=dicta;password=dicta;database=storage_node|foo_transform|=Foo";

  config.smt["rest_weather_forecast"] = "rest|https://api.weather.gov/gridpoints/DVN/34,71/|forecast|=*";
  config.smt["es_weather_forecast"] = "elasticsearch|http://localhost:9200|weather_forecast|=*";
  config.smt["mysql_weather_forecast"] = "mysql|host=localhost;user=dicta;password=dicta;database=storage_node|weather_forecast|=*";
}

module.exports = config;
