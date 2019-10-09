/**
 * api/notify
 */
"use strict";

const authorize = require("../authorize");
const roles = require("../roles");
const config = require("../config");
const logger = require("../logger");
const express = require('express');
const mailer = require("nodemailer");

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
  logger.verbose("POST / was called.");

  logger.verbose(req.body);

  let message = {
    from:    req.body.from || config.mail_defaults.from,
    to:      req.body.to || config.mail_defaults.to || "",
    subject: req.body.subject || config.mail_defaults.subject || "",
    text:    req.body.text || config.mail_defaults.text || ""
  };

  let transport = mailer.createTransport(config.smtp_sender);

  transport.sendMail(message, (error, info) => {
    if (error) {
      logger.error(error.message);
      res.jsonp({response:"failed"});
    } else {
      logger.verbose("Message sent: " + info.response);
      res.jsonp({response:"accepted"});
    }

  });
}
