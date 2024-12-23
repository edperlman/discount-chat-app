"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const CustomOAuth_1 = require("../../app/custom-oauth/client/CustomOAuth");
const loginServices_1 = require("../lib/loginServices");
meteor_1.Meteor.startup(() => {
    loginServices_1.loginServices.onLoad((services) => {
        for (const service of services) {
            if (!('custom' in service && service.custom)) {
                continue;
            }
            new CustomOAuth_1.CustomOAuth(service.service, {
                serverURL: service.serverURL,
                authorizePath: service.authorizePath,
                scope: service.scope,
            });
        }
    });
});
