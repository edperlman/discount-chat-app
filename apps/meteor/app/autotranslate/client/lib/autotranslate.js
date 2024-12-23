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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAutoTranslateMessageStreamHandler = exports.AutoTranslate = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const mem_1 = __importDefault(require("mem"));
const meteor_1 = require("meteor/meteor");
const tracker_1 = require("meteor/tracker");
const autoTranslate_1 = require("../../../../client/views/room/MessageList/lib/autoTranslate");
const client_1 = require("../../../authorization/client");
const client_2 = require("../../../models/client");
const client_3 = require("../../../settings/client");
const SDKClient_1 = require("../../../utils/client/lib/SDKClient");
let userLanguage = 'en';
let username = '';
meteor_1.Meteor.startup(() => {
    tracker_1.Tracker.autorun(() => {
        const user = meteor_1.Meteor.user();
        if (!user) {
            return;
        }
        userLanguage = user.language || 'en';
        username = user.username || '';
    });
});
exports.AutoTranslate = {
    initialized: false,
    providersMetadata: {},
    messageIdsToWait: {},
    supportedLanguages: [],
    findSubscriptionByRid: (0, mem_1.default)((rid) => client_2.Subscriptions.findOne({ rid })),
    getLanguage(rid) {
        var _a;
        let subscription;
        if (rid) {
            subscription = this.findSubscriptionByRid(rid);
        }
        const language = ((subscription === null || subscription === void 0 ? void 0 : subscription.autoTranslateLanguage) || userLanguage || ((_a = window.defaultUserLanguage) === null || _a === void 0 ? void 0 : _a.call(window)));
        if (language.indexOf('-') !== -1) {
            if (!(this.supportedLanguages || []).some((supportedLanguage) => supportedLanguage.language === language)) {
                return language.slice(0, 2);
            }
        }
        return language;
    },
    translateAttachments(attachments, language, autoTranslateShowInverse) {
        if (!(0, core_typings_1.isTranslatedMessageAttachment)(attachments)) {
            return attachments;
        }
        for (const attachment of attachments) {
            if (attachment.author_name !== username) {
                if (attachment.text && attachment.translations && attachment.translations[language]) {
                    attachment.translations.original = attachment.text;
                    if (autoTranslateShowInverse) {
                        attachment.text = attachment.translations.original;
                    }
                    else {
                        attachment.text = attachment.translations[language];
                    }
                }
                if (attachment.description && attachment.translations && attachment.translations[language]) {
                    attachment.translations.original = attachment.description;
                    if (autoTranslateShowInverse) {
                        attachment.description = attachment.translations.original;
                    }
                    else {
                        attachment.description = attachment.translations[language];
                    }
                }
                // @ts-expect-error - not sure what to do with this
                if (attachment.attachments && attachment.attachments.length > 0) {
                    // @ts-expect-error - not sure what to do with this
                    attachment.attachments = this.translateAttachments(attachment.attachments, language);
                }
            }
        }
        return attachments;
    },
    init() {
        if (this.initialized) {
            return;
        }
        tracker_1.Tracker.autorun((c) => __awaiter(this, void 0, void 0, function* () {
            const uid = meteor_1.Meteor.userId();
            if (!client_3.settings.get('AutoTranslate_Enabled') || !uid || !(0, client_1.hasPermission)('auto-translate')) {
                return;
            }
            c.stop();
            try {
                [this.providersMetadata, this.supportedLanguages] = yield Promise.all([
                    SDKClient_1.sdk.call('autoTranslate.getProviderUiMetadata'),
                    SDKClient_1.sdk.call('autoTranslate.getSupportedLanguages', 'en'),
                ]);
            }
            catch (e) {
                // Avoid unwanted error message on UI when autotranslate is disabled while fetching data
                console.error(e.message);
            }
        }));
        client_2.Subscriptions.find().observeChanges({
            changed: (_id, fields) => {
                if (fields.hasOwnProperty('autoTranslate') || fields.hasOwnProperty('autoTranslateLanguage')) {
                    mem_1.default.clear(this.findSubscriptionByRid);
                }
            },
        });
        this.initialized = true;
    },
};
const createAutoTranslateMessageStreamHandler = () => {
    exports.AutoTranslate.init();
    return (message) => {
        if (message.u && message.u._id !== meteor_1.Meteor.userId()) {
            const subscription = exports.AutoTranslate.findSubscriptionByRid(message.rid);
            const language = exports.AutoTranslate.getLanguage(message.rid);
            if (subscription &&
                subscription.autoTranslate === true &&
                message.msg &&
                (!message.translations ||
                    (!(0, autoTranslate_1.hasTranslationLanguageInMessage)(message, language) && !(0, autoTranslate_1.hasTranslationLanguageInAttachments)(message.attachments, language)))) {
                // || (message.attachments && !_.find(message.attachments, attachment => { return attachment.translations && attachment.translations[language]; }))
                client_2.Messages.update({ _id: message._id }, { $set: { autoTranslateFetching: true } });
            }
            else if (exports.AutoTranslate.messageIdsToWait[message._id] !== undefined && subscription && subscription.autoTranslate !== true) {
                client_2.Messages.update({ _id: message._id }, { $set: { autoTranslateShowInverse: true }, $unset: { autoTranslateFetching: true } });
                delete exports.AutoTranslate.messageIdsToWait[message._id];
            }
            else if (message.autoTranslateFetching === true) {
                client_2.Messages.update({ _id: message._id }, { $unset: { autoTranslateFetching: true } });
            }
        }
    };
};
exports.createAutoTranslateMessageStreamHandler = createAutoTranslateMessageStreamHandler;
