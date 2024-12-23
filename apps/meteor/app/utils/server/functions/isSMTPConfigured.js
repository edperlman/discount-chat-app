"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSMTPConfigured = void 0;
const server_1 = require("../../../settings/server");
const isSMTPConfigured = () => {
    const isMailURLSet = !(process.env.MAIL_URL === 'undefined' || process.env.MAIL_URL === undefined);
    return Boolean(server_1.settings.get('SMTP_Host')) || isMailURLSet;
};
exports.isSMTPConfigured = isSMTPConfigured;
