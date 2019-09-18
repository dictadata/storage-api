"use strict";
/**
 * api/message.js
 */

const {authorize, roles} = require('@dicta-io/storage-node');
const express = require('express');
const mailer = require("nodemailer");
const config = require('../config');
const logger = require('../logger');

/**
 * API routes
 */
var router = express.Router();
router.post("/", authorize([roles.Admin, roles.User]), postMessage);
module.exports = router;


function postMessage(req, res) {
  logger.info("POST / was called.");

  console.log(req.body);

  // Use SMTP Protocol to send Email
  let options = {
    from: "drewlab <drew@drewletcher.net>",
    to: "drew@drewletcher.net",
    subject: "Message posted on drewletcher.net",
    text: JSON.stringify(req.body)
  };

  let transport = mailer.createTransport({
    host: "smtpout.secureserver.net",
    port: 465,
    secure: true,
    auth: {
      user: "drew@drewletcher.net",
      pass: "pizDLza1"
    }
  });

  transport.sendMail(options, (error, info) => {
    if (error) {
      console.log(error);
      res.jsonp({response:"failed"});
    } else {
      console.log("Message sent: " + info.response);
      res.jsonp({response:"accepted"});
    }

  });
}
