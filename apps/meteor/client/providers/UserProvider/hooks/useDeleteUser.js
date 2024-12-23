"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDeleteUser = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const client_1 = require("../../../../app/models/client");
const useDeleteUser = () => {
    const notify = (0, ui_contexts_1.useStream)('notify-logged');
    const uid = (0, ui_contexts_1.useUserId)();
    (0, react_1.useEffect)(() => {
        if (!uid) {
            return;
        }
        return notify('Users:Deleted', ({ userId, messageErasureType, replaceByUser }) => {
            if (messageErasureType === 'Unlink' && replaceByUser) {
                return client_1.Messages.update({
                    'u._id': userId,
                }, {
                    $set: {
                        'alias': replaceByUser.alias,
                        'u._id': replaceByUser._id,
                        'u.username': replaceByUser.username,
                        'u.name': undefined,
                    },
                }, { multi: true });
            }
            client_1.Messages.remove({
                'u._id': userId,
            });
        });
    }, [notify, uid]);
};
exports.useDeleteUser = useDeleteUser;
