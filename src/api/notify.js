/**
 * api/notify
 */
"use strict";

const {authorize, roles} = require('@dicta-io/storage-node');
const express = require('express');
const mailer = require("nodemailer");
const config = require('../config');
const logger = require('../logger');

/**
 * API routes
 */
var router = express.Router();
router.post("/", authorize([roles.User, roles.Admin]), postMessage);
module.exports = router;

/**
 * use NodeMailer to send email
 * @param {*} req
 * @param {*} res
 */
function postMessage(req, res) {
  logger.info("POST / was called.");

  console.log(req.body);

  let message = {
    from:    req.body.from || config.mail_fields.from,
    to:      req.body.to || config.mail_fields.to || "",
    subject: req.body.subject || config.mail_fields.subject || "",
    text:    req.body.text || config.mail_fields.text || ""
  };

  let transport = mailer.createTransport(config.smtp_sender);

  transport.sendMail(message, (error, info) => {
    if (error) {
      console.log(error);
      res.jsonp({response:"failed"});
    } else {
      console.log("Message sent: " + info.response);
      res.jsonp({response:"accepted"});
    }

  });
}
