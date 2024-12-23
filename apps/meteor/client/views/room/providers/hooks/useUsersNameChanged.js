"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUsersNameChanged = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const client_1 = require("../../../../../app/models/client");
const useUsersNameChanged = () => {
    const notify = (0, ui_contexts_1.useStream)('notify-logged');
    (0, react_1.useEffect)(() => {
        return notify('Users:NameChanged', ({ _id, name, username }) => {
            client_1.Messages.update({
                'u._id': _id,
            }, {
                $set: {
                    'u.username': username,
                    'u.name': name,
                },
            }, {
                multi: true,
            });
            client_1.Messages.update({
                'editedBy._id': _id,
            }, {
                $set: {
                    'editedBy.username': username,
                },
            }, {
                multi: true,
            });
            client_1.Messages.update({
                mentions: {
                    $elemMatch: { _id },
                },
            }, {
                $set: {
                    'mentions.$.username': username,
                    'mentions.$.name': name,
                },
            }, {
                multi: true,
            });
            client_1.Subscriptions.update({
                name: username,
                t: 'd',
            }, {
                $set: {
                    fname: name,
                },
            });
        });
    }, [notify]);
};
exports.useUsersNameChanged = useUsersNameChanged;
