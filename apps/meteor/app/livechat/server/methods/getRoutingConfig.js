"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const RoutingManager_1 = require("../lib/RoutingManager");
meteor_1.Meteor.methods({
    'livechat:getRoutingConfig'() {
        return RoutingManager_1.RoutingManager.getConfig();
    },
});
