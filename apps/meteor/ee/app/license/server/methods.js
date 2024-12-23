"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const license_1 = require("@rocket.chat/license");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
meteor_1.Meteor.methods({
    'license:hasLicense'(feature) {
        (0, check_1.check)(feature, String);
        return license_1.License.hasModule(feature);
    },
    'license:getModules'() {
        return license_1.License.getModules();
    },
    'license:getTags'() {
        return license_1.License.getTags();
    },
    'license:isEnterprise'() {
        return license_1.License.hasValidLicense();
    },
});
