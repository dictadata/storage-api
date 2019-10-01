/**
 * storage/api
 */
"use strict";

const express = require('express');

const status = require('./status');
const settings = require('./settings');
const notify = require('./notify');

/* sub routes */
const router = express.Router();
router.use('/status', status);
router.use('/settings', settings);
router.use('/notify', notify);
module.exports = router;
