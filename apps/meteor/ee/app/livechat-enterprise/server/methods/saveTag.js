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
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../../../../app/authorization/server/functions/hasPermission");
const LivechatEnterprise_1 = require("../lib/LivechatEnterprise");
meteor_1.Meteor.methods({
    'livechat:saveTag'(_id, tagData, tagDepartments) {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = meteor_1.Meteor.userId();
            if (!uid || !(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'manage-livechat-tags'))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', { method: 'livechat:saveTags' });
            }
            return LivechatEnterprise_1.LivechatEnterprise.saveTag(_id, tagData, tagDepartments);
        });
    },
});
