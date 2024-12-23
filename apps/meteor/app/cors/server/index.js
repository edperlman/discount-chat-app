"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./cors");
const meteor_1 = require("meteor/meteor");
const server_1 = require("../../settings/server");
meteor_1.Meteor.startup(() => {
    server_1.settings.watch('Force_SSL', (value) => {
        meteor_1.Meteor.absoluteUrl.defaultOptions.secure = Boolean(value);
    });
});
