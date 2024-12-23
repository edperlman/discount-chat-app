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
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../../../../app/authorization/server/functions/hasPermission");
const Notifications_1 = __importDefault(require("../../../../../app/notifications/server/lib/Notifications"));
meteor_1.Meteor.methods({
    saveCannedResponse(_id, responseData) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = meteor_1.Meteor.userId();
            if (!userId || !(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'save-canned-responses'))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', { method: 'saveCannedResponse' });
            }
            (0, check_1.check)(_id, check_1.Match.Maybe(String));
            (0, check_1.check)(responseData, {
                shortcut: String,
                text: String,
                scope: String,
                tags: check_1.Match.Maybe([String]),
                departmentId: check_1.Match.Maybe(String),
            });
            const canSaveAll = yield (0, hasPermission_1.hasPermissionAsync)(userId, 'save-all-canned-responses');
            if (!canSaveAll && ['global'].includes(responseData.scope)) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed to modify canned responses on *global* scope', {
                    method: 'saveCannedResponse',
                });
            }
            const canSaveDepartment = yield (0, hasPermission_1.hasPermissionAsync)(userId, 'save-department-canned-responses');
            if (!canSaveAll && !canSaveDepartment && ['department'].includes(responseData.scope)) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed to modify canned responses on *department* scope', {
                    method: 'saveCannedResponse',
                });
            }
            // to avoid inconsistencies
            if (responseData.scope === 'user') {
                delete responseData.departmentId;
            }
            // TODO: check if the department i'm trying to save is a department i can interact with
            // check if the response already exists and we're not updating one
            const duplicateShortcut = yield models_1.CannedResponse.findOneByShortcut(responseData.shortcut, {
                projection: { _id: 1 },
            });
            if ((!_id && duplicateShortcut) || (_id && duplicateShortcut && duplicateShortcut._id !== _id)) {
                throw new meteor_1.Meteor.Error('error-invalid-shortcut', 'Shortcut provided already exists', {
                    method: 'saveCannedResponse',
                });
            }
            if (responseData.scope === 'department' && !responseData.departmentId) {
                throw new meteor_1.Meteor.Error('error-invalid-department', 'Invalid department', {
                    method: 'saveCannedResponse',
                });
            }
            if (responseData.departmentId &&
                !(yield models_1.LivechatDepartment.findOneById(responseData.departmentId, { projection: { _id: 1 } }))) {
                throw new meteor_1.Meteor.Error('error-invalid-department', 'Invalid department', {
                    method: 'saveCannedResponse',
                });
            }
            let result;
            if (_id) {
                const cannedResponse = yield models_1.CannedResponse.findOneById(_id);
                if (!cannedResponse) {
                    throw new meteor_1.Meteor.Error('error-canned-response-not-found', 'Canned Response not found', {
                        method: 'saveCannedResponse',
                    });
                }
                result = yield models_1.CannedResponse.updateCannedResponse(_id, Object.assign(Object.assign({}, responseData), { createdBy: cannedResponse.createdBy }));
            }
            else {
                const user = yield models_1.Users.findOneById(userId);
                const data = Object.assign(Object.assign(Object.assign({}, responseData), (responseData.scope === 'user' && { userId: user === null || user === void 0 ? void 0 : user._id })), { createdBy: { _id: (user === null || user === void 0 ? void 0 : user._id) || '', username: (user === null || user === void 0 ? void 0 : user.username) || '' }, _createdAt: new Date() });
                result = yield models_1.CannedResponse.createCannedResponse(data);
            }
            Notifications_1.default.streamCannedResponses.emit('canned-responses', Object.assign({ type: 'changed' }, result));
            return result;
        });
    },
});
