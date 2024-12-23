"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const settings_1 = require("../lib/settings");
meteor_1.Meteor.methods({
    addSamlService(name) {
        (0, settings_1.addSamlService)(name);
    },
});
