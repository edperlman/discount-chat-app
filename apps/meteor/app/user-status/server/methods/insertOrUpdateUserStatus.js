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
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const stringUtils_1 = require("../../../../lib/utils/stringUtils");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
meteor_1.Meteor.methods({
    insertOrUpdateUserStatus(userStatusData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.userId || !(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'manage-user-status'))) {
                throw new meteor_1.Meteor.Error('not_authorized');
            }
            if (!(0, stringUtils_1.trim)(userStatusData.name)) {
                throw new meteor_1.Meteor.Error('error-the-field-is-required', 'The field Name is required', {
                    method: 'insertOrUpdateUserStatus',
                    field: 'Name',
                });
            }
            // allow all characters except >, <, &, ", '
            // more practical than allowing specific sets of characters; also allows foreign languages
            const nameValidation = /[><&"']/;
            if (nameValidation.test(userStatusData.name)) {
                throw new meteor_1.Meteor.Error('error-input-is-not-a-valid-field', `${userStatusData.name} is not a valid name`, {
                    method: 'insertOrUpdateUserStatus',
                    input: userStatusData.name,
                    field: 'Name',
                });
            }
            let matchingResults = [];
            if (userStatusData._id) {
                matchingResults = yield models_1.CustomUserStatus.findByNameExceptId(userStatusData.name, userStatusData._id).toArray();
            }
            else {
                matchingResults = yield models_1.CustomUserStatus.findByName(userStatusData.name).toArray();
            }
            if (matchingResults.length > 0) {
                throw new meteor_1.Meteor.Error('Custom_User_Status_Error_Name_Already_In_Use', 'The custom user status name is already in use', {
                    method: 'insertOrUpdateUserStatus',
                });
            }
            const validStatusTypes = ['online', 'away', 'busy', 'offline'];
            if (userStatusData.statusType && validStatusTypes.indexOf(userStatusData.statusType) < 0) {
                throw new meteor_1.Meteor.Error('error-input-is-not-a-valid-field', `${userStatusData.statusType} is not a valid status type`, {
                    method: 'insertOrUpdateUserStatus',
                    input: userStatusData.statusType,
                    field: 'StatusType',
                });
            }
            if (!userStatusData._id) {
                // insert user status
                const createUserStatus = {
                    name: userStatusData.name,
                    statusType: userStatusData.statusType,
                };
                const _id = (yield models_1.CustomUserStatus.create(createUserStatus)).insertedId;
                void core_services_1.api.broadcast('user.updateCustomStatus', Object.assign(Object.assign({}, createUserStatus), { _id }));
                return _id;
            }
            // update User status
            if (userStatusData.name !== userStatusData.previousName) {
                yield models_1.CustomUserStatus.setName(userStatusData._id, userStatusData.name);
            }
            if (userStatusData.statusType !== userStatusData.previousStatusType) {
                yield models_1.CustomUserStatus.setStatusType(userStatusData._id, userStatusData.statusType);
            }
            void core_services_1.api.broadcast('user.updateCustomStatus', Object.assign(Object.assign({}, userStatusData), { _id: userStatusData._id }));
            return true;
        });
    },
});
