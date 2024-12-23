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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveRoomAnnouncement = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const saveRoomAnnouncement = function (rid_1, roomAnnouncement_1, user_1) {
    return __awaiter(this, arguments, void 0, function* (rid, roomAnnouncement, user, sendMessage = true) {
        if (!check_1.Match.test(rid, String)) {
            throw new meteor_1.Meteor.Error('invalid-room', 'Invalid room', {
                function: 'RocketChat.saveRoomAnnouncement',
            });
        }
        let message;
        let announcementDetails;
        if (typeof roomAnnouncement === 'string') {
            message = roomAnnouncement;
        }
        else {
            ({ message } = roomAnnouncement, announcementDetails = __rest(roomAnnouncement, ["message"]));
        }
        const updated = yield models_1.Rooms.setAnnouncementById(rid, message, announcementDetails);
        if (updated && sendMessage) {
            yield core_services_1.Message.saveSystemMessage('room_changed_announcement', rid, message, user);
        }
        return updated;
    });
};
exports.saveRoomAnnouncement = saveRoomAnnouncement;
