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
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
meteor_1.Meteor.methods({
    'livechat:removeCustomField'(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = meteor_1.Meteor.userId();
            if (!uid || !(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'view-livechat-manager'))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
                    method: 'livechat:removeCustomField',
                });
            }
            (0, check_1.check)(_id, String);
            const customField = yield models_1.LivechatCustomField.findOneById(_id, { projection: { _id: 1 } });
            if (!customField) {
                throw new meteor_1.Meteor.Error('error-invalid-custom-field', 'Custom field not found', {
                    method: 'livechat:removeCustomField',
                });
            }
            return models_1.LivechatCustomField.removeById(_id);
        });
    },
});
