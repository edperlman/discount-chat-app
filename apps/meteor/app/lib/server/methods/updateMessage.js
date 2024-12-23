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
exports.executeUpdateMessage = executeUpdateMessage;
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const moment_1 = __importDefault(require("moment"));
const canSendMessage_1 = require("../../../authorization/server/functions/canSendMessage");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const airGappedRestrictionsWrapper_1 = require("../../../license/server/airGappedRestrictionsWrapper");
const server_1 = require("../../../settings/server");
const updateMessage_1 = require("../functions/updateMessage");
const allowedEditedFields = ['tshow', 'alias', 'attachments', 'avatar', 'emoji', 'msg', 'customFields', 'content', 'e2eMentions'];
function executeUpdateMessage(uid, message, previewUrls) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const originalMessage = yield models_1.Messages.findOneById(message._id);
        if (!(originalMessage === null || originalMessage === void 0 ? void 0 : originalMessage._id)) {
            return;
        }
        Object.entries(message).forEach(([key, value]) => {
            if (!allowedEditedFields.includes(key) && value !== originalMessage[key]) {
                throw new meteor_1.Meteor.Error('error-invalid-update-key', `Cannot update the message ${key}`, {
                    method: 'updateMessage',
                });
            }
        });
        // IF the message has custom fields, always update
        // Ideally, we'll compare the custom fields to check for change, but since we don't know the shape of
        // custom fields, as it's user defined, we're gonna update
        const msgText = (_c = (_b = (_a = originalMessage === null || originalMessage === void 0 ? void 0 : originalMessage.attachments) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.description) !== null && _c !== void 0 ? _c : originalMessage.msg;
        if (msgText === message.msg && !previewUrls && !message.customFields) {
            return;
        }
        if (!!message.tmid && originalMessage._id === message.tmid) {
            throw new meteor_1.Meteor.Error('error-message-same-as-tmid', 'Cannot set tmid the same as the _id', {
                method: 'updateMessage',
            });
        }
        if (!originalMessage.tmid && !!message.tmid) {
            throw new meteor_1.Meteor.Error('error-message-change-to-thread', 'Cannot update message to a thread', { method: 'updateMessage' });
        }
        const _hasPermission = yield (0, hasPermission_1.hasPermissionAsync)(uid, 'edit-message', message.rid);
        const editAllowed = server_1.settings.get('Message_AllowEditing');
        const editOwn = originalMessage.u && originalMessage.u._id === uid;
        if (!_hasPermission && (!editAllowed || !editOwn)) {
            throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Message editing not allowed', {
                method: 'updateMessage',
                action: 'Message_editing',
            });
        }
        const blockEditInMinutes = server_1.settings.get('Message_AllowEditing_BlockEditInMinutes');
        const bypassBlockTimeLimit = yield (0, hasPermission_1.hasPermissionAsync)(uid, 'bypass-time-limit-edit-and-delete', message.rid);
        if (!bypassBlockTimeLimit && check_1.Match.test(blockEditInMinutes, Number) && blockEditInMinutes !== 0) {
            let currentTsDiff = 0;
            let msgTs;
            if (originalMessage.ts instanceof Date || check_1.Match.test(originalMessage.ts, Number)) {
                msgTs = (0, moment_1.default)(originalMessage.ts);
            }
            if (msgTs) {
                currentTsDiff = (0, moment_1.default)().diff(msgTs, 'minutes');
            }
            if (currentTsDiff >= blockEditInMinutes) {
                throw new meteor_1.Meteor.Error('error-message-editing-blocked', 'Message editing is blocked', {
                    method: 'updateMessage',
                });
            }
        }
        const user = yield models_1.Users.findOneById(uid);
        if (!user) {
            throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'updateMessage' });
        }
        yield (0, canSendMessage_1.canSendMessageAsync)(message.rid, Object.assign({ uid: user._id, username: (_d = user.username) !== null && _d !== void 0 ? _d : undefined }, user));
        // It is possible to have an empty array as the attachments property, so ensure both things exist
        if (originalMessage.attachments && originalMessage.attachments.length > 0 && originalMessage.attachments[0].description !== undefined) {
            originalMessage.attachments[0].description = message.msg;
            message.attachments = originalMessage.attachments;
            message.msg = originalMessage.msg;
        }
        message.u = originalMessage.u;
        return (0, updateMessage_1.updateMessage)(message, user, originalMessage, previewUrls);
    });
}
meteor_1.Meteor.methods({
    updateMessage(message, previewUrls) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(message, check_1.Match.ObjectIncluding({ _id: String }));
            (0, check_1.check)(previewUrls, check_1.Match.Maybe([String]));
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'updateMessage' });
            }
            return (0, airGappedRestrictionsWrapper_1.applyAirGappedRestrictionsValidation)(() => executeUpdateMessage(uid, message, previewUrls));
        });
    },
});
