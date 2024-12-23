"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emoji = void 0;
const emojione_1 = __importDefault(require("emojione"));
exports.emoji = {
    packages: {
        base: {
            emojiCategories: [{ key: 'recent', i18n: 'Frequently_Used' }],
            categoryIndex: 0,
            emojisByCategory: {
                recent: [],
            },
            toneList: {},
            render: emojione_1.default.toImage,
            renderPicker(emojiToRender) {
                var _a;
                const correctPackage = exports.emoji.list[emojiToRender].emojiPackage;
                if (!correctPackage) {
                    return;
                }
                return (_a = exports.emoji.packages[correctPackage]) === null || _a === void 0 ? void 0 : _a.renderPicker(emojiToRender);
            },
        },
    },
    list: {},
};
