"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEmojiCustom = exports.deleteEmojiCustom = void 0;
const string_helpers_1 = require("@rocket.chat/string-helpers");
const meteor_1 = require("meteor/meteor");
const loggedIn_1 = require("../../../../client/lib/loggedIn");
const client_1 = require("../../../emoji/client");
const client_2 = require("../../../utils/client");
const SDKClient_1 = require("../../../utils/client/lib/SDKClient");
const isSetNotNull = (fn) => {
    let value;
    try {
        value = fn();
    }
    catch (e) {
        value = null;
    }
    return value !== null && value !== undefined;
};
const getEmojiUrlFromName = (name, extension, etag) => {
    if (!name) {
        return;
    }
    return (0, client_2.getURL)(`/emoji-custom/${encodeURIComponent(name)}.${extension}${etag ? `?etag=${etag}` : ''}`);
};
const deleteEmojiCustom = (emojiData) => {
    var _a, _b, _c, _d, _e, _f;
    delete client_1.emoji.list[`:${emojiData.name}:`];
    const arrayIndex = client_1.emoji.packages.emojiCustom.emojisByCategory.rocket.indexOf(emojiData.name);
    if (arrayIndex !== -1) {
        client_1.emoji.packages.emojiCustom.emojisByCategory.rocket.splice(arrayIndex, 1);
    }
    const arrayIndexList = (_b = (_a = client_1.emoji.packages.emojiCustom.list) === null || _a === void 0 ? void 0 : _a.indexOf(`:${emojiData.name}:`)) !== null && _b !== void 0 ? _b : -1;
    if (arrayIndexList !== -1) {
        (_c = client_1.emoji.packages.emojiCustom.list) === null || _c === void 0 ? void 0 : _c.splice(arrayIndexList, 1);
    }
    if (emojiData.aliases) {
        for (const alias of emojiData.aliases) {
            delete client_1.emoji.list[`:${alias}:`];
            const aliasIndex = (_e = (_d = client_1.emoji.packages.emojiCustom.list) === null || _d === void 0 ? void 0 : _d.indexOf(`:${alias}:`)) !== null && _e !== void 0 ? _e : -1;
            if (aliasIndex !== -1) {
                (_f = client_1.emoji.packages.emojiCustom.list) === null || _f === void 0 ? void 0 : _f.splice(aliasIndex, 1);
            }
        }
    }
    (0, client_1.removeFromRecent)(emojiData.name, client_1.emoji.packages.base.emojisByCategory.recent);
};
exports.deleteEmojiCustom = deleteEmojiCustom;
const updateEmojiCustom = (emojiData) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const previousExists = isSetNotNull(() => emojiData.previousName);
    const currentAliases = isSetNotNull(() => emojiData.aliases);
    if (previousExists && isSetNotNull(() => client_1.emoji.list[`:${emojiData.previousName}:`].aliases)) {
        for (const alias of (_a = client_1.emoji.list[`:${emojiData.previousName}:`].aliases) !== null && _a !== void 0 ? _a : []) {
            delete client_1.emoji.list[`:${alias}:`];
            const aliasIndex = (_c = (_b = client_1.emoji.packages.emojiCustom.list) === null || _b === void 0 ? void 0 : _b.indexOf(`:${alias}:`)) !== null && _c !== void 0 ? _c : -1;
            if (aliasIndex !== -1) {
                (_d = client_1.emoji.packages.emojiCustom.list) === null || _d === void 0 ? void 0 : _d.splice(aliasIndex, 1);
            }
        }
    }
    if (previousExists && emojiData.name !== emojiData.previousName) {
        const arrayIndex = client_1.emoji.packages.emojiCustom.emojisByCategory.rocket.indexOf(emojiData.previousName);
        if (arrayIndex !== -1) {
            client_1.emoji.packages.emojiCustom.emojisByCategory.rocket.splice(arrayIndex, 1);
        }
        const arrayIndexList = (_f = (_e = client_1.emoji.packages.emojiCustom.list) === null || _e === void 0 ? void 0 : _e.indexOf(`:${emojiData.previousName}:`)) !== null && _f !== void 0 ? _f : -1;
        if (arrayIndexList !== -1) {
            (_g = client_1.emoji.packages.emojiCustom.list) === null || _g === void 0 ? void 0 : _g.splice(arrayIndexList, 1);
        }
        delete client_1.emoji.list[`:${emojiData.previousName}:`];
    }
    const categoryIndex = client_1.emoji.packages.emojiCustom.emojisByCategory.rocket.indexOf(`${emojiData.name}`);
    if (categoryIndex === -1) {
        client_1.emoji.packages.emojiCustom.emojisByCategory.rocket.push(`${emojiData.name}`);
        (_h = client_1.emoji.packages.emojiCustom.list) === null || _h === void 0 ? void 0 : _h.push(`:${emojiData.name}:`);
    }
    client_1.emoji.list[`:${emojiData.name}:`] = Object.assign({ emojiPackage: 'emojiCustom' }, client_1.emoji.list[`:${emojiData.name}:`], emojiData);
    if (currentAliases) {
        for (const alias of emojiData.aliases) {
            (_j = client_1.emoji.packages.emojiCustom.list) === null || _j === void 0 ? void 0 : _j.push(`:${alias}:`);
            client_1.emoji.list[`:${alias}:`] = {
                emojiPackage: 'emojiCustom',
                aliasOf: emojiData.name,
            };
        }
    }
    if (previousExists) {
        (0, client_1.replaceEmojiInRecent)({ oldEmoji: emojiData.previousName, newEmoji: emojiData.name });
    }
};
exports.updateEmojiCustom = updateEmojiCustom;
const customRender = (html) => {
    var _a;
    const emojisMatchGroup = (_a = client_1.emoji.packages.emojiCustom.list) === null || _a === void 0 ? void 0 : _a.map(string_helpers_1.escapeRegExp).join('|');
    if (emojisMatchGroup !== client_1.emoji.packages.emojiCustom._regexpSignature) {
        client_1.emoji.packages.emojiCustom._regexpSignature = emojisMatchGroup;
        client_1.emoji.packages.emojiCustom._regexp = new RegExp(`<object[^>]*>.*?<\/object>|<span[^>]*>.*?<\/span>|<(?:object|embed|svg|img|div|span|p|a)[^>]*>|(${emojisMatchGroup})`, 'gi');
    }
    html = html.replace(client_1.emoji.packages.emojiCustom._regexp, (shortname) => {
        var _a, _b;
        if (typeof shortname === 'undefined' || shortname === '' || ((_b = (_a = client_1.emoji.packages.emojiCustom.list) === null || _a === void 0 ? void 0 : _a.indexOf(shortname)) !== null && _b !== void 0 ? _b : -1) === -1) {
            return shortname;
        }
        let emojiAlias = shortname.replace(/:/g, '');
        let dataCheck = client_1.emoji.list[shortname];
        if (dataCheck.aliasOf) {
            emojiAlias = dataCheck.aliasOf;
            dataCheck = client_1.emoji.list[`:${emojiAlias}:`];
        }
        return `<span class="emoji" style="background-image:url(${getEmojiUrlFromName(emojiAlias, dataCheck.extension, dataCheck.etag)});" data-emoji="${emojiAlias}" title="${shortname}">${shortname}</span>`;
    });
    return html;
};
client_1.emoji.packages.emojiCustom = {
    emojiCategories: [{ key: 'rocket', i18n: 'Custom' }],
    categoryIndex: 1,
    toneList: {},
    list: [],
    _regexpSignature: null,
    _regexp: null,
    emojisByCategory: {},
    render: customRender,
    renderPicker: customRender,
};
meteor_1.Meteor.startup(() => {
    (0, loggedIn_1.onLoggedIn)(() => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const { emojis: { update: emojis }, } = yield SDKClient_1.sdk.rest.get('/v1/emoji-custom.list', { query: '' });
            client_1.emoji.packages.emojiCustom.emojisByCategory = { rocket: [] };
            for (const currentEmoji of emojis) {
                client_1.emoji.packages.emojiCustom.emojisByCategory.rocket.push(currentEmoji.name);
                (_a = client_1.emoji.packages.emojiCustom.list) === null || _a === void 0 ? void 0 : _a.push(`:${currentEmoji.name}:`);
                client_1.emoji.list[`:${currentEmoji.name}:`] = Object.assign(Object.assign({}, currentEmoji), { emojiPackage: 'emojiCustom' });
                for (const alias of currentEmoji.aliases) {
                    (_b = client_1.emoji.packages.emojiCustom.list) === null || _b === void 0 ? void 0 : _b.push(`:${alias}:`);
                    client_1.emoji.list[`:${alias}:`] = {
                        emojiPackage: 'emojiCustom',
                        aliasOf: currentEmoji.name,
                    };
                }
            }
        }
        catch (e) {
            console.error('Error getting custom emoji', e);
        }
    }));
});
