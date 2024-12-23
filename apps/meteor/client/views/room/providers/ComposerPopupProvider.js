"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const client_1 = require("../../../../app/authorization/client");
const CannedResponse_1 = require("../../../../app/canned-responses/client/collections/CannedResponse");
const client_2 = require("../../../../app/emoji/client");
const client_3 = require("../../../../app/models/client");
const messagePopupConfig_1 = require("../../../../app/ui-message/client/popup/messagePopupConfig");
const client_4 = require("../../../../app/utils/client");
const ComposerBoxPopupCannedResponse_1 = __importDefault(require("../composer/ComposerBoxPopupCannedResponse"));
const ComposerBoxPopupEmoji_1 = __importDefault(require("../composer/ComposerBoxPopupEmoji"));
const ComposerBoxPopupRoom_1 = __importDefault(require("../composer/ComposerBoxPopupRoom"));
const ComposerBoxPopupSlashCommand_1 = __importDefault(require("../composer/ComposerBoxPopupSlashCommand"));
const ComposerBoxPopupUser_1 = __importDefault(require("../composer/ComposerBoxPopupUser"));
const ComposerPopupContext_1 = require("../contexts/ComposerPopupContext");
const ComposerPopupProvider = ({ children, room }) => {
    const { _id: rid, encrypted: isRoomEncrypted } = room;
    const userSpotlight = (0, ui_contexts_1.useMethod)('spotlight');
    const suggestionsCount = (0, ui_contexts_1.useSetting)('Number_of_users_autocomplete_suggestions', 5);
    const cannedResponseEnabled = (0, ui_contexts_1.useSetting)('Canned_Responses_Enable', true);
    const [recentEmojis] = (0, fuselage_hooks_1.useLocalStorage)('emoji.recent', []);
    const isOmnichannel = (0, core_typings_1.isOmnichannelRoom)(room);
    const useEmoji = (0, ui_contexts_1.useUserPreference)('useEmojis');
    const { t, i18n } = (0, react_i18next_1.useTranslation)();
    const e2eEnabled = (0, ui_contexts_1.useSetting)('E2E_Enable', false);
    const unencryptedMessagesAllowed = (0, ui_contexts_1.useSetting)('E2E_Allow_Unencrypted_Messages', false);
    const encrypted = isRoomEncrypted && e2eEnabled && !unencryptedMessagesAllowed;
    const call = (0, ui_contexts_1.useMethod)('getSlashCommandPreviews');
    const value = (0, react_1.useMemo)(() => {
        return [
            (0, ComposerPopupContext_1.createMessageBoxPopupConfig)({
                trigger: '@',
                title: t('People'),
                getItemsFromLocal: (filter) => __awaiter(void 0, void 0, void 0, function* () {
                    const filterRegex = filter && new RegExp((0, string_helpers_1.escapeRegExp)(filter), 'i');
                    const items = [];
                    const users = messagePopupConfig_1.usersFromRoomMessages
                        .find(Object.assign({ ts: { $exists: true } }, (filter && {
                        $or: [{ username: filterRegex }, { name: filterRegex }],
                    })), {
                        limit: suggestionsCount !== null && suggestionsCount !== void 0 ? suggestionsCount : 5,
                        sort: { ts: -1 },
                    })
                        .fetch()
                        .map((u) => {
                        u.suggestion = true;
                        return u;
                    });
                    if (!filterRegex || filterRegex.test('all')) {
                        items.push({
                            _id: 'all',
                            username: 'all',
                            system: true,
                            name: t('Notify_all_in_this_room'),
                            sort: 4,
                        });
                    }
                    if (!filterRegex || filterRegex.test('here')) {
                        items.push({
                            _id: 'here',
                            username: 'here',
                            system: true,
                            name: t('Notify_active_in_this_room'),
                            sort: 4,
                        });
                    }
                    return [...users, ...items];
                }),
                getItemsFromServer: (filter) => __awaiter(void 0, void 0, void 0, function* () {
                    const filterRegex = filter && new RegExp((0, string_helpers_1.escapeRegExp)(filter), 'i');
                    const usernames = messagePopupConfig_1.usersFromRoomMessages
                        .find(Object.assign({ ts: { $exists: true } }, (filter && {
                        $or: [{ username: filterRegex }, { name: filterRegex }],
                    })), {
                        limit: suggestionsCount !== null && suggestionsCount !== void 0 ? suggestionsCount : 5,
                        sort: { ts: -1 },
                    })
                        .fetch()
                        .map((u) => {
                        return u.username;
                    });
                    const { users = [] } = yield userSpotlight(filter, usernames, { users: true, mentions: true }, rid);
                    return users.map(({ _id, username, nickname, name, status, avatarETag, outside }) => {
                        return {
                            _id,
                            username,
                            nickname,
                            name,
                            status,
                            avatarETag,
                            outside,
                            sort: 3,
                        };
                    });
                }),
                getValue: (item) => item.username,
                renderItem: ({ item }) => (0, jsx_runtime_1.jsx)(ComposerBoxPopupUser_1.default, Object.assign({}, item)),
            }),
            (0, ComposerPopupContext_1.createMessageBoxPopupConfig)({
                trigger: '#',
                title: t('Channels'),
                getItemsFromLocal: (filter) => __awaiter(void 0, void 0, void 0, function* () {
                    const filterRegex = new RegExp((0, string_helpers_1.escapeRegExp)(filter), 'i');
                    const records = client_3.Subscriptions.find({
                        $and: [
                            {
                                $or: [{ fname: filterRegex }, { name: filterRegex }],
                            },
                            {
                                $or: [{ federated: { $exists: false } }, { federated: false }],
                            },
                        ],
                        t: {
                            $in: ['c', 'p'],
                        },
                    }, {
                        limit: suggestionsCount !== null && suggestionsCount !== void 0 ? suggestionsCount : 5,
                        sort: {
                            ls: -1,
                        },
                    }).fetch();
                    return records;
                }),
                getItemsFromServer: (filter) => __awaiter(void 0, void 0, void 0, function* () {
                    const { rooms = [] } = yield userSpotlight(filter, [], { rooms: true, mentions: true }, rid);
                    return rooms;
                }),
                getValue: (item) => `${item.name || item.fname}`,
                renderItem: ({ item }) => (0, jsx_runtime_1.jsx)(ComposerBoxPopupRoom_1.default, Object.assign({}, item)),
            }),
            useEmoji &&
                (0, ComposerPopupContext_1.createMessageBoxPopupConfig)({
                    trigger: ':',
                    title: t('Emoji'),
                    triggerLength: 2,
                    getItemsFromLocal: (filter) => __awaiter(void 0, void 0, void 0, function* () {
                        const exactFinalTone = new RegExp('^tone[1-5]:*$');
                        const colorBlind = new RegExp('tone[1-5]:*$');
                        const seeColor = new RegExp('_t(?:o|$)(?:n|$)(?:e|$)(?:[1-5]|$)(?::|$)$');
                        const emojiSort = (recents) => (a, b) => {
                            const aExact = a._id === key ? 2 : 0;
                            const bExact = b._id === key ? 2 : 0;
                            const aPartial = a._id.startsWith(key) ? 1 : 0;
                            const bPartial = b._id.startsWith(key) ? 1 : 0;
                            let aScore = aExact + aPartial;
                            let bScore = bExact + bPartial;
                            if (recents.includes(a._id)) {
                                aScore += recents.indexOf(a._id) + 1;
                            }
                            if (recents.includes(b._id)) {
                                bScore += recents.indexOf(b._id) + 1;
                            }
                            if (aScore > bScore) {
                                return -1;
                            }
                            if (aScore < bScore) {
                                return 1;
                            }
                            return 0;
                        };
                        const filterRegex = new RegExp((0, string_helpers_1.escapeRegExp)(filter), 'i');
                        const key = `:${filter}`;
                        const recents = recentEmojis.map((item) => `:${item}:`);
                        const collection = client_2.emoji.list;
                        return Object.keys(collection)
                            .map((_id) => {
                            const data = collection[key];
                            return { _id, data };
                        })
                            .filter(({ _id }) => filterRegex.test(_id) && (exactFinalTone.test(_id.substring(key.length)) || seeColor.test(key) || !colorBlind.test(_id)))
                            .sort(emojiSort(recents))
                            .slice(0, 10);
                    }),
                    getItemsFromServer: () => __awaiter(void 0, void 0, void 0, function* () {
                        return [];
                    }),
                    getValue: (item) => `${item._id.substring(1)}`,
                    renderItem: ({ item }) => (0, jsx_runtime_1.jsx)(ComposerBoxPopupEmoji_1.default, Object.assign({}, item)),
                }),
            (0, ComposerPopupContext_1.createMessageBoxPopupConfig)({
                title: t('Emoji'),
                trigger: '\\+:',
                prefix: '+',
                suffix: ' ',
                triggerAnywhere: false,
                getItemsFromLocal: (filter) => __awaiter(void 0, void 0, void 0, function* () {
                    const exactFinalTone = new RegExp('^tone[1-5]:*$');
                    const colorBlind = new RegExp('tone[1-5]:*$');
                    const seeColor = new RegExp('_t(?:o|$)(?:n|$)(?:e|$)(?:[1-5]|$)(?::|$)$');
                    const emojiSort = (recents) => (a, b) => {
                        let idA = a._id;
                        let idB = a._id;
                        if (recents.includes(a._id)) {
                            idA = recents.indexOf(a._id) + idA;
                        }
                        if (recents.includes(b._id)) {
                            idB = recents.indexOf(b._id) + idB;
                        }
                        if (idA < idB) {
                            return -1;
                        }
                        if (idA > idB) {
                            return 1;
                        }
                        return 0;
                    };
                    const filterRegex = new RegExp((0, string_helpers_1.escapeRegExp)(filter), 'i');
                    const key = `:${filter}`;
                    const recents = recentEmojis.map((item) => `:${item}:`);
                    const collection = client_2.emoji.list;
                    return Object.keys(collection)
                        .map((_id) => {
                        const data = collection[key];
                        return { _id, data };
                    })
                        .filter(({ _id }) => filterRegex.test(_id) && (exactFinalTone.test(_id.substring(key.length)) || seeColor.test(key) || !colorBlind.test(_id)))
                        .sort(emojiSort(recents))
                        .slice(0, 10);
                }),
                getItemsFromServer: () => __awaiter(void 0, void 0, void 0, function* () {
                    return [];
                }),
                getValue: (item) => `${item._id}`,
                renderItem: ({ item }) => (0, jsx_runtime_1.jsx)(ComposerBoxPopupEmoji_1.default, Object.assign({}, item)),
            }),
            (0, ComposerPopupContext_1.createMessageBoxPopupConfig)({
                title: t('Commands'),
                trigger: '/',
                suffix: ' ',
                triggerAnywhere: false,
                disabled: encrypted,
                renderItem: ({ item }) => (0, jsx_runtime_1.jsx)(ComposerBoxPopupSlashCommand_1.default, Object.assign({}, item)),
                getItemsFromLocal: (filter) => __awaiter(void 0, void 0, void 0, function* () {
                    return Object.keys(client_4.slashCommands.commands)
                        .map((command) => {
                        var _a;
                        const item = client_4.slashCommands.commands[command];
                        return Object.assign({ _id: command, params: item.params && i18n.exists(item.params) ? t(item.params) : ((_a = item.params) !== null && _a !== void 0 ? _a : ''), description: item.description && i18n.exists(item.description) ? t(item.description) : item.description, permission: item.permission }, (encrypted && { disabled: encrypted }));
                    })
                        .filter((command) => {
                        const isMatch = command._id.indexOf(filter) > -1;
                        if (!isMatch) {
                            return false;
                        }
                        if (!command.permission) {
                            return true;
                        }
                        return (0, client_1.hasAtLeastOnePermission)(command.permission, rid);
                    })
                        .sort((a, b) => a._id.localeCompare(b._id))
                        .slice(0, 11);
                }),
                getItemsFromServer: () => __awaiter(void 0, void 0, void 0, function* () { return []; }),
            }),
            cannedResponseEnabled &&
                isOmnichannel &&
                (0, ComposerPopupContext_1.createMessageBoxPopupConfig)({
                    title: t('Canned_Responses'),
                    trigger: '!',
                    prefix: '',
                    triggerAnywhere: true,
                    renderItem: ({ item }) => (0, jsx_runtime_1.jsx)(ComposerBoxPopupCannedResponse_1.default, Object.assign({}, item)),
                    getItemsFromLocal: (filter) => __awaiter(void 0, void 0, void 0, function* () {
                        const exp = new RegExp(filter, 'i');
                        return CannedResponse_1.CannedResponse.find({
                            shortcut: exp,
                        }, {
                            limit: 12,
                            sort: {
                                shortcut: -1,
                            },
                        })
                            .fetch()
                            .map((record) => ({
                            _id: record._id,
                            text: record.text,
                            shortcut: record.shortcut,
                        }));
                    }),
                    getItemsFromServer: () => __awaiter(void 0, void 0, void 0, function* () { return []; }),
                    getValue: (item) => {
                        return item.text;
                    },
                }),
            (0, ComposerPopupContext_1.createMessageBoxPopupConfig)({
                matchSelectorRegex: /(?:^)(\/[\w\d\S]+ )[^]*$/,
                preview: true,
                getItemsFromLocal: (_a) => __awaiter(void 0, [_a], void 0, function* ({ cmd, params, tmid }) {
                    var _b;
                    const result = yield call({ cmd, params, msg: { rid, tmid } });
                    return ((_b = result === null || result === void 0 ? void 0 : result.items.map((item) => ({
                        _id: item.id,
                        value: item.value,
                        type: item.type,
                    }))) !== null && _b !== void 0 ? _b : []);
                }),
            }),
        ].filter(Boolean);
    }, [t, i18n, cannedResponseEnabled, isOmnichannel, recentEmojis, suggestionsCount, userSpotlight, rid, call, useEmoji, encrypted]);
    return (0, jsx_runtime_1.jsx)(ComposerPopupContext_1.ComposerPopupContext.Provider, { value: value, children: children });
};
exports.default = ComposerPopupProvider;
