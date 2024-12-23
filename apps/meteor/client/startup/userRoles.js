"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const tracker_1 = require("meteor/tracker");
const client_1 = require("../../app/models/client");
const SDKClient_1 = require("../../app/utils/client/lib/SDKClient");
const toast_1 = require("../lib/toast");
meteor_1.Meteor.startup(() => {
    tracker_1.Tracker.autorun(() => {
        if (meteor_1.Meteor.userId()) {
            SDKClient_1.sdk
                .call('getUserRoles')
                .then((results) => {
                for (const record of results) {
                    client_1.UserRoles.upsert({ _id: record._id }, record);
                }
            })
                .catch((error) => {
                (0, toast_1.dispatchToastMessage)({ type: 'error', message: error });
            });
            SDKClient_1.sdk.stream('notify-logged', ['roles-change'], (role) => {
                if (role.type === 'added') {
                    if (!role.scope) {
                        if (!role.u) {
                            return;
                        }
                        client_1.UserRoles.upsert({ _id: role.u._id }, { $addToSet: { roles: role._id }, $set: { username: role.u.username } });
                        client_1.Messages.update({ 'u._id': role.u._id }, { $addToSet: { roles: role._id } }, { multi: true });
                    }
                    return;
                }
                if (role.type === 'removed') {
                    if (!role.scope) {
                        if (!role.u) {
                            return;
                        }
                        client_1.UserRoles.update({ _id: role.u._id }, { $pull: { roles: role._id } });
                        client_1.Messages.update({ 'u._id': role.u._id }, { $pull: { roles: role._id } }, { multi: true });
                    }
                    return;
                }
                if (role.type === 'changed') {
                    client_1.Messages.update({ roles: role._id }, { $inc: { rerender: 1 } }, { multi: true });
                }
            });
        }
    });
});
