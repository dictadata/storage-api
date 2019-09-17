"use strict";
/**
 * api/index.js
 */

const express = require('express');

const etl = require('./etl');
const message = require('./message');
const settings = require('./settings');
const status = require('./status');
const storage = require('./storage');
const upload = require('./upload');

/* sub routes */
const router = express.Router();
router.use('/etl', etl);
router.use('/message', message);
router.use('/settings', settings);
router.use('/status', status);
router.use('/storage', storage);
router.use('/upload', upload);
module.exports = router;
