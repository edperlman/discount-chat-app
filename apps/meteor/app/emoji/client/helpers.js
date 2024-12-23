"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFrequentEmoji = exports.replaceEmojiInRecent = exports.updateRecent = exports.removeFromRecent = exports.getEmojisBySearchTerm = exports.getCategoriesList = exports.createEmojiList = exports.createPickerEmojis = exports.CUSTOM_CATEGORY = void 0;
const string_helpers_1 = require("@rocket.chat/string-helpers");
const lib_1 = require("./lib");
exports.CUSTOM_CATEGORY = 'rocket';
const createPickerEmojis = (customItemsLimit, actualTone, recentEmojis, setRecentEmojis) => {
    const categories = (0, exports.getCategoriesList)();
    const mappedCategories = categories.map((category) => ({
        key: category.key,
        i18n: category.i18n,
        emojis: {
            list: (0, exports.createEmojiList)(category.key, actualTone, recentEmojis, setRecentEmojis),
            limit: category.key === exports.CUSTOM_CATEGORY ? customItemsLimit : null,
        },
    }));
    return mappedCategories;
};
exports.createPickerEmojis = createPickerEmojis;
const createEmojiList = (category, actualTone, recentEmojis, setRecentEmojis) => {
    const emojiList = [];
    const emojiPackages = Object.values(lib_1.emoji.packages);
    emojiPackages.forEach((emojiPackage) => {
        var _a;
        if (!((_a = emojiPackage.emojisByCategory) === null || _a === void 0 ? void 0 : _a[category])) {
            return;
        }
        const total = emojiPackage.emojisByCategory[category].length;
        for (let i = 0; i < total; i++) {
            const current = emojiPackage.emojisByCategory[category][i];
            const tone = actualTone && actualTone > 0 && emojiPackage.toneList.hasOwnProperty(current) ? `_tone${actualTone}` : '';
            const emojiToRender = `:${current}${tone}:`;
            if (!lib_1.emoji.list[emojiToRender]) {
                (0, exports.removeFromRecent)(emojiToRender, recentEmojis, setRecentEmojis);
                return;
            }
            const image = emojiPackage.renderPicker(emojiToRender);
            if (!image) {
                continue;
            }
            emojiList.push({ emoji: current, image });
        }
    });
    return emojiList;
};
exports.createEmojiList = createEmojiList;
const getCategoriesList = () => {
    let categoriesList = [];
    for (const emojiPackage of Object.values(lib_1.emoji.packages)) {
        if (emojiPackage.emojiCategories) {
            if (typeof emojiPackage.categoryIndex !== 'undefined') {
                categoriesList.splice(emojiPackage.categoryIndex, 0, ...emojiPackage.emojiCategories);
            }
            else {
                categoriesList = categoriesList.concat(emojiPackage.emojiCategories);
            }
        }
    }
    const rocketPosition = categoriesList.findIndex((category) => category.key === exports.CUSTOM_CATEGORY);
    const rocketCategory = categoriesList.splice(rocketPosition, 1)[0];
    categoriesList.push(rocketCategory);
    return categoriesList;
};
exports.getCategoriesList = getCategoriesList;
const getEmojisBySearchTerm = (searchTerm, actualTone, recentEmojis, setRecentEmojis) => {
    const emojis = [];
    const searchRegExp = new RegExp((0, string_helpers_1.escapeRegExp)(searchTerm.replace(/:/g, '')), 'i');
    for (let current in lib_1.emoji.list) {
        if (!lib_1.emoji.list.hasOwnProperty(current)) {
            continue;
        }
        if (searchRegExp.test(current)) {
            const emojiObject = lib_1.emoji.list[current];
            const { emojiPackage, shortnames = [] } = emojiObject;
            let tone = '';
            current = current.replace(/:/g, '');
            const alias = shortnames[0] !== undefined ? shortnames[0].replace(/:/g, '') : shortnames[0];
            if (actualTone > 0 && lib_1.emoji.packages[emojiPackage].toneList.hasOwnProperty(current)) {
                tone = `_tone${actualTone}`;
            }
            let emojiFound = false;
            for (const key in lib_1.emoji.packages[emojiPackage].emojisByCategory) {
                if (lib_1.emoji.packages[emojiPackage].emojisByCategory.hasOwnProperty(key)) {
                    const contents = lib_1.emoji.packages[emojiPackage].emojisByCategory[key];
                    const searchValArray = alias !== undefined ? alias.replace(/:/g, '').split('_') : alias;
                    if (contents.indexOf(current) !== -1 || (searchValArray === null || searchValArray === void 0 ? void 0 : searchValArray.includes(searchTerm))) {
                        emojiFound = true;
                        break;
                    }
                }
            }
            if (emojiFound) {
                const emojiToRender = `:${current}${tone}:`;
                if (!lib_1.emoji.list[emojiToRender]) {
                    (0, exports.removeFromRecent)(emojiToRender, recentEmojis, setRecentEmojis);
                    break;
                }
                emojis.push({ emoji: current, image: lib_1.emoji.packages[emojiPackage].renderPicker(emojiToRender) });
            }
        }
    }
    return emojis;
};
exports.getEmojisBySearchTerm = getEmojisBySearchTerm;
const removeFromRecent = (emoji, recentEmojis, setRecentEmojis) => {
    const _emoji = emoji.replace(/(^:|:$)/g, '');
    const pos = recentEmojis.indexOf(_emoji);
    if (pos === -1) {
        return;
    }
    recentEmojis.splice(pos, 1);
    setRecentEmojis === null || setRecentEmojis === void 0 ? void 0 : setRecentEmojis(recentEmojis);
};
exports.removeFromRecent = removeFromRecent;
const updateRecent = (recentList) => {
    const recentPkgList = lib_1.emoji.packages.base.emojisByCategory.recent;
    recentList === null || recentList === void 0 ? void 0 : recentList.forEach((_emoji) => {
        !recentPkgList.includes(_emoji) && recentPkgList.push(_emoji);
    });
};
exports.updateRecent = updateRecent;
const replaceEmojiInRecent = ({ oldEmoji, newEmoji }) => {
    const recentPkgList = lib_1.emoji.packages.base.emojisByCategory.recent;
    const pos = recentPkgList.indexOf(oldEmoji);
    if (pos !== -1) {
        recentPkgList[pos] = newEmoji;
    }
};
exports.replaceEmojiInRecent = replaceEmojiInRecent;
const getEmojiRender = (emojiName) => {
    var _a;
    const emojiPackageName = (_a = lib_1.emoji.list[emojiName]) === null || _a === void 0 ? void 0 : _a.emojiPackage;
    const emojiPackage = lib_1.emoji.packages[emojiPackageName];
    return emojiPackage === null || emojiPackage === void 0 ? void 0 : emojiPackage.render(emojiName);
};
const getFrequentEmoji = (frequentEmoji) => {
    return frequentEmoji === null || frequentEmoji === void 0 ? void 0 : frequentEmoji.map((frequentEmoji) => {
        return { emoji: frequentEmoji, image: getEmojiRender(`:${frequentEmoji}:`) };
    });
};
exports.getFrequentEmoji = getFrequentEmoji;
