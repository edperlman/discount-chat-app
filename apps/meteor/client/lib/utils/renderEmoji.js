"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmojiClassNameAndDataTitle = exports.renderEmoji = void 0;
const lib_1 = require("../../../app/emoji/client/lib");
const emojiList = lib_1.emoji.list;
const emojiPackages = lib_1.emoji.packages;
const renderEmoji = (emojiName) => {
    var _a;
    const emojiPackageName = (_a = emojiList[emojiName]) === null || _a === void 0 ? void 0 : _a.emojiPackage;
    if (emojiPackageName) {
        const emojiPackage = emojiPackages[emojiPackageName];
        return emojiPackage.render(emojiName);
    }
    return undefined;
};
exports.renderEmoji = renderEmoji;
const createGetEmojiClassNameAndDataTitle = (parser) => (emojiName) => {
    var _a;
    const html = parser(emojiName);
    if (!html) {
        return { 'className': '', 'data-title': '', 'children': '', 'name': '' };
    }
    const div = document.createElement('div');
    div.innerHTML = html;
    const emojiElement = div.firstElementChild;
    if (!emojiElement) {
        return { 'className': '', 'data-title': '', 'children': '', 'name': '', 'image': '' };
    }
    const image = emojiElement instanceof HTMLElement
        ? emojiElement.style.backgroundImage
        : Object.fromEntries((_a = (emojiElement.getAttribute('style') || '')) === null || _a === void 0 ? void 0 : _a.split(';').map((s) => s.split(':')))['background-image'];
    return {
        'className': emojiElement.getAttribute('class') || '',
        'data-title': emojiElement.getAttribute('data-title') || '',
        'name': emojiElement.getAttribute('name') || '',
        'children': emojiElement.innerHTML,
        image,
    };
};
exports.getEmojiClassNameAndDataTitle = createGetEmojiClassNameAndDataTitle(exports.renderEmoji);
