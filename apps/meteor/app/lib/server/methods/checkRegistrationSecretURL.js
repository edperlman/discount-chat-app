"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const server_1 = require("../../../settings/server");
meteor_1.Meteor.methods({
    checkRegistrationSecretURL(hash) {
        (0, check_1.check)(hash, String);
        return hash === server_1.settings.get('Accounts_RegistrationForm_SecretURL');
    },
});
