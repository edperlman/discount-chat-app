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
    removeCannedResponse(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = meteor_1.Meteor.userId();
            if (!uid || !(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'remove-canned-responses'))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
                    method: 'removeCannedResponse',
                });
            }
            (0, check_1.check)(_id, String);
            const cannedResponse = yield models_1.CannedResponse.findOneById(_id);
            if (!cannedResponse) {
                throw new meteor_1.Meteor.Error('error-canned-response-not-found', 'Canned Response not found', {
                    method: 'removeCannedResponse',
                });
            }
            Notifications_1.default.streamCannedResponses.emit('canned-responses', { type: 'removed', _id });
            yield models_1.CannedResponse.removeById(_id);
        });
    },
});
