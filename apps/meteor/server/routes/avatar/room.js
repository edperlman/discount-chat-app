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
exports.roomAvatar = void 0;
const models_1 = require("@rocket.chat/models");
const ostrio_cookies_1 = require("meteor/ostrio:cookies");
const utils_1 = require("./utils");
const roomCoordinator_1 = require("../../lib/rooms/roomCoordinator");
const cookie = new ostrio_cookies_1.Cookies();
const getRoomAndAvatarFile = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const room = yield models_1.Rooms.findOneById(roomId);
    if (!room) {
        return;
    }
    const file = yield models_1.Avatars.findOneByRoomId(room._id);
    // if it is a discussion that doesn't have it's own avatar, returns the parent's room avatar
    if (room.prid && !file) {
        return getRoomAndAvatarFile(room.prid);
    }
    return { room, file };
});
const roomAvatar = function (request, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const req = request;
        if (!req.url) {
            return;
        }
        const roomId = decodeURIComponent(req.url.slice(1).replace(/\?.*$/, ''));
        const { room, file } = (yield getRoomAndAvatarFile(roomId)) || {};
        if (!room) {
            res.writeHead(404);
            res.end();
            return;
        }
        (0, utils_1.setCacheAndDispositionHeaders)(req, res);
        if (file) {
            void (0, utils_1.serveAvatarFile)(file, req, res, next);
            return;
        }
        if (!(0, utils_1.wasFallbackModified)(req.headers['if-modified-since'])) {
            res.writeHead(304);
            res.end();
            return;
        }
        const uid = req.headers.cookie && cookie.get('rc_uid', req.headers.cookie);
        const roomName = yield roomCoordinator_1.roomCoordinator.getRoomName(room.t, room, uid);
        (0, utils_1.serveSvgAvatarInRequestedFormat)({ nameOrUsername: roomName, req, res });
    });
};
exports.roomAvatar = roomAvatar;
