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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertOrUpdateEmoji = insertOrUpdateEmoji;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const limax_1 = __importDefault(require("limax"));
const meteor_1 = require("meteor/meteor");
const stringUtils_1 = require("../../../../lib/utils/stringUtils");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const emoji_custom_1 = require("../startup/emoji-custom");
function insertOrUpdateEmoji(userId, emojiData) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c, _d, e_2, _e, _f;
        var _g;
        if (!userId || !(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'manage-emoji'))) {
            throw new meteor_1.Meteor.Error('not_authorized');
        }
        if (!(0, stringUtils_1.trim)(emojiData.name)) {
            throw new meteor_1.Meteor.Error('error-the-field-is-required', 'The field Name is required', {
                method: 'insertOrUpdateEmoji',
                field: 'Name',
            });
        }
        emojiData.name = (0, limax_1.default)(emojiData.name, { replacement: '_' });
        // allow all characters except colon, whitespace, comma, >, <, &, ", ', /, \, (, )
        // more practical than allowing specific sets of characters; also allows foreign languages
        const nameValidation = /[\s,:><&"'\/\\\(\)]/;
        const aliasValidation = /[:><&\|"'\/\\\(\)]/;
        // silently strip colon; this allows for uploading :emojiname: as emojiname
        emojiData.name = emojiData.name.replace(/:/g, '');
        emojiData.aliases = (_g = emojiData.aliases) === null || _g === void 0 ? void 0 : _g.replace(/:/g, '');
        if (nameValidation.test(emojiData.name)) {
            throw new meteor_1.Meteor.Error('error-input-is-not-a-valid-field', `${emojiData.name} is not a valid name`, {
                method: 'insertOrUpdateEmoji',
                input: emojiData.name,
                field: 'Name',
            });
        }
        let aliases = [];
        if (emojiData.aliases) {
            if (aliasValidation.test(emojiData.aliases)) {
                throw new meteor_1.Meteor.Error('error-input-is-not-a-valid-field', `${emojiData.aliases} is not a valid alias set`, {
                    method: 'insertOrUpdateEmoji',
                    input: emojiData.aliases,
                    field: 'Alias_Set',
                });
            }
            aliases = emojiData.aliases
                .split(/\s*,\s*/)
                .filter(Boolean)
                .map((alias) => (0, limax_1.default)(alias, { replacement: '_' }))
                .filter((alias) => alias !== emojiData.name);
        }
        emojiData.extension = emojiData.extension === 'svg+xml' ? 'png' : emojiData.extension;
        let matchingResults = [];
        if (emojiData._id) {
            matchingResults = yield models_1.EmojiCustom.findByNameOrAliasExceptID(emojiData.name, emojiData._id).toArray();
            try {
                for (var _h = true, aliases_1 = __asyncValues(aliases), aliases_1_1; aliases_1_1 = yield aliases_1.next(), _a = aliases_1_1.done, !_a; _h = true) {
                    _c = aliases_1_1.value;
                    _h = false;
                    const alias = _c;
                    matchingResults = matchingResults.concat(yield models_1.EmojiCustom.findByNameOrAliasExceptID(alias, emojiData._id).toArray());
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_h && !_a && (_b = aliases_1.return)) yield _b.call(aliases_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        else {
            matchingResults = yield models_1.EmojiCustom.findByNameOrAlias(emojiData.name).toArray();
            try {
                for (var _j = true, aliases_2 = __asyncValues(aliases), aliases_2_1; aliases_2_1 = yield aliases_2.next(), _d = aliases_2_1.done, !_d; _j = true) {
                    _f = aliases_2_1.value;
                    _j = false;
                    const alias = _f;
                    matchingResults = matchingResults.concat(yield models_1.EmojiCustom.findByNameOrAlias(alias).toArray());
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_j && !_d && (_e = aliases_2.return)) yield _e.call(aliases_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        if (matchingResults.length > 0) {
            throw new meteor_1.Meteor.Error('Custom_Emoji_Error_Name_Or_Alias_Already_In_Use', 'The custom emoji or one of its aliases is already in use', {
                method: 'insertOrUpdateEmoji',
            });
        }
        if (typeof emojiData.extension === 'undefined') {
            throw new meteor_1.Meteor.Error('error-the-field-is-required', 'The custom emoji file is required', {
                method: 'insertOrUpdateEmoji',
            });
        }
        if (!emojiData._id) {
            // insert emoji
            const createEmoji = {
                name: emojiData.name,
                aliases,
                extension: emojiData.extension,
            };
            const _id = (yield models_1.EmojiCustom.create(createEmoji)).insertedId;
            void core_services_1.api.broadcast('emoji.updateCustom', createEmoji);
            return Object.assign(Object.assign(Object.assign({}, emojiData), createEmoji), { _id });
        }
        // update emoji
        if (emojiData.newFile) {
            yield emoji_custom_1.RocketChatFileEmojiCustomInstance.deleteFile(encodeURIComponent(`${emojiData.name}.${emojiData.extension}`));
            yield emoji_custom_1.RocketChatFileEmojiCustomInstance.deleteFile(encodeURIComponent(`${emojiData.name}.${emojiData.previousExtension}`));
            yield emoji_custom_1.RocketChatFileEmojiCustomInstance.deleteFile(encodeURIComponent(`${emojiData.previousName}.${emojiData.extension}`));
            yield emoji_custom_1.RocketChatFileEmojiCustomInstance.deleteFile(encodeURIComponent(`${emojiData.previousName}.${emojiData.previousExtension}`));
            yield models_1.EmojiCustom.setExtension(emojiData._id, emojiData.extension);
        }
        else if (emojiData.name !== emojiData.previousName) {
            const rs = yield emoji_custom_1.RocketChatFileEmojiCustomInstance.getFileWithReadStream(encodeURIComponent(`${emojiData.previousName}.${emojiData.previousExtension}`));
            if (rs) {
                yield emoji_custom_1.RocketChatFileEmojiCustomInstance.deleteFile(encodeURIComponent(`${emojiData.name}.${emojiData.extension}`));
                const ws = emoji_custom_1.RocketChatFileEmojiCustomInstance.createWriteStream(encodeURIComponent(`${emojiData.name}.${emojiData.previousExtension}`), rs.contentType);
                ws.on('end', () => emoji_custom_1.RocketChatFileEmojiCustomInstance.deleteFile(encodeURIComponent(`${emojiData.previousName}.${emojiData.previousExtension}`)));
                rs.readStream.pipe(ws);
            }
        }
        if (emojiData.name !== emojiData.previousName) {
            yield models_1.EmojiCustom.setName(emojiData._id, emojiData.name);
        }
        if (emojiData.aliases) {
            yield models_1.EmojiCustom.setAliases(emojiData._id, aliases);
        }
        else {
            yield models_1.EmojiCustom.setAliases(emojiData._id, []);
        }
        void core_services_1.api.broadcast('emoji.updateCustom', Object.assign(Object.assign({}, emojiData), { aliases }));
        return Object.assign(Object.assign({}, emojiData), { aliases });
    });
}
