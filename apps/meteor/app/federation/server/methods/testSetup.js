"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_typings_1 = require("@rocket.chat/core-typings");
const meteor_1 = require("meteor/meteor");
const handler_1 = require("../handler");
const getFederationDomain_1 = require("../lib/getFederationDomain");
meteor_1.Meteor.methods({
    FEDERATION_Test_Setup() {
        try {
            void (0, handler_1.dispatchEvent)([(0, getFederationDomain_1.getFederationDomain)()], {
                type: core_typings_1.eventTypes.PING,
            });
            return {
                message: 'FEDERATION_Test_Setup_Success',
            };
        }
        catch (err) {
            throw new meteor_1.Meteor.Error('FEDERATION_Test_Setup_Error');
        }
    },
});
