/**
 * storage/api
 */
"use strict";

const express = require('express');

const status = require('./status');
const settings = require('./settings');

/* sub routes */
const router = express.Router();
router.use('/status', status);
router.use('/settings', settings);
module.exports = router;
