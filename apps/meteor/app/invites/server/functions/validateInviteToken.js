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
exports.validateInviteToken = void 0;
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const validateInviteToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token || typeof token !== 'string') {
        throw new meteor_1.Meteor.Error('error-invalid-token', 'The invite token is invalid.', {
            method: 'validateInviteToken',
            field: 'token',
        });
    }
    const inviteData = yield models_1.Invites.findOneById(token);
    if (!inviteData) {
        throw new meteor_1.Meteor.Error('error-invalid-token', 'The invite token is invalid.', {
            method: 'validateInviteToken',
            field: 'token',
        });
    }
    const room = yield models_1.Rooms.findOneById(inviteData.rid);
    if (!room) {
        throw new meteor_1.Meteor.Error('error-invalid-room', 'The invite token is invalid.', {
            method: 'validateInviteToken',
            field: 'rid',
        });
    }
    if (inviteData.expires && new Date(inviteData.expires).getTime() <= Date.now()) {
        throw new meteor_1.Meteor.Error('error-invite-expired', 'The invite token has expired.', {
            method: 'validateInviteToken',
            field: 'expires',
        });
    }
    if (inviteData.maxUses > 0 && inviteData.uses >= inviteData.maxUses) {
        throw new meteor_1.Meteor.Error('error-invite-expired', 'The invite token has expired.', {
            method: 'validateInviteToken',
            field: 'maxUses',
        });
    }
    return {
        inviteData,
        room,
    };
});
exports.validateInviteToken = validateInviteToken;
