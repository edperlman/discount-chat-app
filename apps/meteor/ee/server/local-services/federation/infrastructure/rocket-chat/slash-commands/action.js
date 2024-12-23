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
exports.executeSlashCommand = void 0;
const models_1 = require("@rocket.chat/models");
const action_1 = require("../../../../../../../server/services/federation/infrastructure/rocket-chat/slash-commands/action");
const validateInvitees = (invitees, inviterId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const atLeastOneExternal = invitees.some((invitee) => invitee.includes(':'));
    const inviter = yield models_1.Users.findOneById(inviterId);
    const isInviterExternal = (inviter === null || inviter === void 0 ? void 0 : inviter.federated) === true || ((_a = inviter === null || inviter === void 0 ? void 0 : inviter.username) === null || _a === void 0 ? void 0 : _a.includes(':'));
    if (!atLeastOneExternal && !isInviterExternal) {
        throw new Error('At least one user must be external');
    }
});
const executeSlashCommand = (providedCommand, stringParams, item, commands, currentUserId) => __awaiter(void 0, void 0, void 0, function* () {
    if (providedCommand !== 'federation' || !stringParams) {
        return;
    }
    const [command, ...externalUserIdsToInvite] = stringParams.trim().split(' ');
    if (!currentUserId || !commands[command]) {
        return;
    }
    yield validateInvitees(externalUserIdsToInvite, currentUserId);
    const invitees = externalUserIdsToInvite.map((rawUserId) => (0, action_1.normalizeExternalInviteeId)(rawUserId));
    const { rid: roomId } = item;
    yield commands[command](currentUserId, roomId, invitees);
});
exports.executeSlashCommand = executeSlashCommand;
