"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUpdateAvatar = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const meteor_1 = require("meteor/meteor");
const react_1 = require("react");
const useUpdateAvatar = () => {
    const notify = (0, ui_contexts_1.useStream)('notify-logged');
    const uid = (0, ui_contexts_1.useUserId)();
    (0, react_1.useEffect)(() => {
        if (!uid) {
            return;
        }
        return notify('updateAvatar', (data) => {
            if ('username' in data) {
                const { username, etag } = data;
                username && meteor_1.Meteor.users.update({ username }, { $set: { avatarETag: etag } });
            }
        });
    }, [notify, uid]);
};
exports.useUpdateAvatar = useUpdateAvatar;
