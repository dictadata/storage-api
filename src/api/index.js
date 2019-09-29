"use strict";
/**
 * api/index.js
 */

const express = require('express');

const status = require('./status');
const settings = require('./settings');
const message = require('./message');

/* sub routes */
const router = express.Router();
router.use('/status', status);
router.use('/settings', settings);
router.use('/message', message);
module.exports = router;
