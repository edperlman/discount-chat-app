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
const server_1 = require("../../app/authorization/server");
meteor_1.Meteor.methods({
    getRoomIdByNameOrId(rid) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            (0, check_1.check)(rid, String);
            if (!meteor_1.Meteor.userId()) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'getRoomIdByNameOrId',
                });
            }
            const room = (yield models_1.Rooms.findOneById(rid)) || (yield models_1.Rooms.findOneByName(rid));
            if (room == null) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
                    method: 'getRoomIdByNameOrId',
                });
            }
            if (!(yield (0, server_1.canAccessRoomAsync)(room, (_a = (yield meteor_1.Meteor.userAsync())) !== null && _a !== void 0 ? _a : undefined))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
                    method: 'getRoomIdByNameOrId',
                });
            }
            return room._id;
        });
    },
});
