"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mailer = void 0;
const sendMail_1 = require("../functions/sendMail");
const unsubscribe_1 = require("../functions/unsubscribe");
exports.Mailer = {
    sendMail: sendMail_1.sendMail,
    unsubscribe: unsubscribe_1.unsubscribe,
};
