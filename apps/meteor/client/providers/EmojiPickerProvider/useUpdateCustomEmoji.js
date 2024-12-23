"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUpdateCustomEmoji = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const emojiCustom_1 = require("../../../app/emoji-custom/client/lib/emojiCustom");
const useUpdateCustomEmoji = () => {
    const notify = (0, ui_contexts_1.useStream)('notify-logged');
    const uid = (0, ui_contexts_1.useUserId)();
    (0, react_1.useEffect)(() => {
        if (!uid) {
            return;
        }
        const unsubUpdate = notify('updateEmojiCustom', (data) => (0, emojiCustom_1.updateEmojiCustom)(data.emojiData));
        const unsubDelete = notify('deleteEmojiCustom', (data) => (0, emojiCustom_1.deleteEmojiCustom)(data.emojiData));
        return () => {
            unsubUpdate();
            unsubDelete();
        };
    }, [notify, uid]);
};
exports.useUpdateCustomEmoji = useUpdateCustomEmoji;
