"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleStarredMessage = void 0;
const meteor_1 = require("meteor/meteor");
const client_1 = require("../../../app/models/client");
const toggleStarredMessage = (message, starred) => {
    const uid = meteor_1.Meteor.userId();
    if (starred) {
        client_1.Messages.update({ _id: message._id }, {
            $addToSet: {
                starred: { _id: uid },
            },
        });
        return;
    }
    client_1.Messages.update({ _id: message._id }, {
        $pull: {
            starred: { _id: uid },
        },
    });
};
exports.toggleStarredMessage = toggleStarredMessage;
