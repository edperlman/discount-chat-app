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
const license_1 = require("@rocket.chat/license");
const meteor_1 = require("meteor/meteor");
const api_1 = require("../../../app/api/server/api");
api_1.API.v1.addRoute('chat.getMessageReadReceipts', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!license_1.License.hasModule('message-read-receipt')) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'This is an enterprise feature');
            }
            const { messageId } = this.queryParams;
            if (!messageId) {
                return api_1.API.v1.failure({
                    error: "The required 'messageId' param is missing.",
                });
            }
            return api_1.API.v1.success({
                receipts: yield meteor_1.Meteor.callAsync('getReadReceipts', { messageId }),
            });
        });
    },
});
