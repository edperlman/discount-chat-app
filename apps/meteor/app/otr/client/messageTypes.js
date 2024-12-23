"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const client_1 = require("../../ui-utils/client");
const constants_1 = require("../lib/constants");
meteor_1.Meteor.startup(() => {
    client_1.MessageTypes.registerType({
        id: constants_1.otrSystemMessages.USER_JOINED_OTR,
        system: true,
        message: constants_1.otrSystemMessages.USER_JOINED_OTR,
    });
    client_1.MessageTypes.registerType({
        id: constants_1.otrSystemMessages.USER_REQUESTED_OTR_KEY_REFRESH,
        system: true,
        message: constants_1.otrSystemMessages.USER_REQUESTED_OTR_KEY_REFRESH,
    });
    client_1.MessageTypes.registerType({
        id: constants_1.otrSystemMessages.USER_KEY_REFRESHED_SUCCESSFULLY,
        system: true,
        message: constants_1.otrSystemMessages.USER_KEY_REFRESHED_SUCCESSFULLY,
    });
});
