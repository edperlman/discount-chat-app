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
exports.executeSlashCommand = exports.normalizeExternalInviteeId = void 0;
const models_1 = require("@rocket.chat/models");
const normalizeExternalInviteeId = (rawInviteeId) => `@${rawInviteeId.replace(/@/g, '')}`;
exports.normalizeExternalInviteeId = normalizeExternalInviteeId;
const validateExternalInviteeIdFormat = (rawInviteeId, inviterId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const inviter = yield models_1.Users.findOneById(inviterId);
    const isInviterExternal = (inviter === null || inviter === void 0 ? void 0 : inviter.federated) === true || ((_a = inviter === null || inviter === void 0 ? void 0 : inviter.username) === null || _a === void 0 ? void 0 : _a.includes(':'));
    const localUserInvitingAnotherLocalUser = !rawInviteeId.includes(':') && !isInviterExternal;
    if (localUserInvitingAnotherLocalUser) {
        throw new Error('Invalid userId format for federation command.');
    }
});
const executeSlashCommand = (providedCommand, stringParams, item, commands, currentUserId) => __awaiter(void 0, void 0, void 0, function* () {
    if (providedCommand !== 'federation' || !stringParams) {
        return;
    }
    const [command, ...params] = stringParams.trim().split(' ');
    const [rawUserId] = params;
    if (!currentUserId || !commands[command]) {
        return;
    }
    yield validateExternalInviteeIdFormat(rawUserId, currentUserId);
    const invitee = (0, exports.normalizeExternalInviteeId)(rawUserId);
    const { rid: roomId } = item;
    yield commands[command](currentUserId, roomId, invitee);
});
exports.executeSlashCommand = executeSlashCommand;
