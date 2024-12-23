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
exports.removeInvite = void 0;
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const removeInvite = (userId, invite) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId || !invite) {
        return false;
    }
    if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'create-invite-links'))) {
        throw new meteor_1.Meteor.Error('not_authorized');
    }
    if (!invite._id) {
        throw new meteor_1.Meteor.Error('error-the-field-is-required', 'The field _id is required', {
            method: 'removeInvite',
            field: '_id',
        });
    }
    // Before anything, let's check if there's an existing invite
    const existing = yield models_1.Invites.findOneById(invite._id);
    if (!existing) {
        throw new meteor_1.Meteor.Error('invalid-invitation-id', 'Invalid Invitation _id', {
            method: 'removeInvite',
        });
    }
    yield models_1.Invites.removeById(invite._id);
    return true;
});
exports.removeInvite = removeInvite;
