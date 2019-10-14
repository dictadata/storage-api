/**
 * storage/api
 */
"use strict";

const express = require('express');

const status = require('./status');
const docs = require('./docs');
const settings = require('./settings');
const notify = require('./notify');

/* sub routes */
var router = express.Router();
router.use('/status', status);
router.use('/docs', docs);
router.use('/settings', settings);
router.use('/notify', notify);
module.exports = router;
