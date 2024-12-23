"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
if (meteor_1.Meteor.AppCache) {
    meteor_1.Meteor.AppCache.config({
        onlineOnly: ['/elements/', '/landing/', '/moment-locales/', '/scripts/'],
    });
}
