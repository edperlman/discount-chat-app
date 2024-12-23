"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const emojione_1 = __importDefault(require("emojione"));
const meteor_1 = require("meteor/meteor");
const callbacks_1 = require("../../../lib/callbacks");
meteor_1.Meteor.startup(() => {
    callbacks_1.callbacks.add('beforeSendMessageNotifications', (message) => emojione_1.default.shortnameToUnicode(message), callbacks_1.callbacks.priority.MEDIUM, 'emojione-shortnameToUnicode');
});
