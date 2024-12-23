"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const getMomentLocale_1 = require("../lib/getMomentLocale");
meteor_1.Meteor.methods({
    loadLocale(locale) {
        (0, check_1.check)(locale, String);
        try {
            return (0, getMomentLocale_1.getMomentLocale)(locale);
        }
        catch (error) {
            throw new meteor_1.Meteor.Error(error.message, `Moment locale not found: ${locale}`);
        }
    },
});
