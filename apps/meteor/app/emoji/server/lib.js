"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emoji = void 0;
exports.emoji = {
    packages: {
        base: {
            emojiCategories: [{ key: 'recent', i18n: 'Frequently_Used' }],
            categoryIndex: 0,
            emojisByCategory: {
                recent: [],
            },
            toneList: {},
            render: (message) => message,
            renderPicker(emojiToRender) {
                var _a;
                if (!exports.emoji.list[emojiToRender]) {
                    return;
                }
                const correctPackage = exports.emoji.list[emojiToRender].emojiPackage;
                if (!correctPackage) {
                    return;
                }
                return (_a = exports.emoji.packages[correctPackage]) === null || _a === void 0 ? void 0 : _a.renderPicker(emojiToRender);
            },
        },
    },
    /** @type {Record<string, unknown>} */
    list: {},
};
