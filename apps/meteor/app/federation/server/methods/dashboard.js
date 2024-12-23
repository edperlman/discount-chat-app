"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const dashboard_1 = require("../functions/dashboard");
meteor_1.Meteor.methods({
    'federation:getServers': dashboard_1.federationGetServers,
    'federation:getOverviewData': dashboard_1.federationGetOverviewData,
});
