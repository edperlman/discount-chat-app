"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Markdown = void 0;
const meteor_1 = require("meteor/meteor");
const tracker_1 = require("meteor/tracker");
const callbacks_1 = require("../../../lib/callbacks");
const markdown_1 = require("../lib/markdown");
var markdown_2 = require("../lib/markdown");
Object.defineProperty(exports, "Markdown", { enumerable: true, get: function () { return markdown_2.Markdown; } });
meteor_1.Meteor.startup(() => {
    tracker_1.Tracker.autorun(() => {
        const options = {
            rootUrl: meteor_1.Meteor.absoluteUrl(),
        };
        const renderMessage = (0, markdown_1.createMarkdownMessageRenderer)(options);
        callbacks_1.callbacks.add('renderMessage', renderMessage, callbacks_1.callbacks.priority.HIGH, 'markdown');
    });
    const renderNotification = (0, markdown_1.createMarkdownNotificationRenderer)();
    callbacks_1.callbacks.add('renderNotification', renderNotification, callbacks_1.callbacks.priority.HIGH, 'filter-markdown');
});
