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
exports.roomCoordinator = void 0;
const models_1 = require("@rocket.chat/models");
const server_1 = require("../../../app/settings/server");
const getUserDisplayName_1 = require("../../../lib/getUserDisplayName");
const coordinator_1 = require("../../../lib/rooms/coordinator");
class RoomCoordinatorServer extends coordinator_1.RoomCoordinator {
    add(roomConfig, directives) {
        this.addRoomType(roomConfig, Object.assign(Object.assign({ allowRoomSettingChange(_room, _setting) {
                return true;
            },
            allowMemberAction(_room, _action, _userId) {
                return __awaiter(this, void 0, void 0, function* () {
                    return false;
                });
            },
            roomName(_room, _userId) {
                return __awaiter(this, void 0, void 0, function* () {
                    return '';
                });
            },
            isGroupChat(_room) {
                return false;
            },
            canBeDeleted(hasPermission, room) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!hasPermission && typeof hasPermission !== 'function') {
                        throw new Error('You MUST provide the "hasPermission" to canBeDeleted function');
                    }
                    return hasPermission(`delete-${room.t}`, room._id);
                });
            },
            preventRenaming() {
                return false;
            },
            getDiscussionType() {
                return __awaiter(this, void 0, void 0, function* () {
                    return 'p';
                });
            },
            canAccessUploadedFile(_params) {
                return __awaiter(this, void 0, void 0, function* () {
                    return false;
                });
            },
            getNotificationDetails(room, sender, notificationMessage, userId) {
                return __awaiter(this, void 0, void 0, function* () {
                    const title = `#${yield this.roomName(room, userId)}`;
                    const useRealName = server_1.settings.get('UI_Use_Real_Name');
                    const senderName = (0, getUserDisplayName_1.getUserDisplayName)(sender.name, sender.username, useRealName);
                    const text = `${senderName}: ${notificationMessage}`;
                    return { title, text, name: room.name };
                });
            },
            getMsgSender(message) {
                return models_1.Users.findOneById(message.u._id);
            },
            includeInRoomSearch() {
                return false;
            },
            getReadReceiptsExtraData(_message) {
                return {};
            },
            includeInDashboard() {
                return false;
            } }, directives), { config: roomConfig }));
    }
    getRoomDirectives(roomType) {
        var _a;
        const directives = (_a = this.roomTypes[roomType]) === null || _a === void 0 ? void 0 : _a.directives;
        if (!directives) {
            throw new Error(`Room type ${roomType} not found`);
        }
        return directives;
    }
    getTypesToShowOnDashboard() {
        return Object.keys(this.roomTypes).filter((key) => this.roomTypes[key].directives.includeInDashboard());
    }
    getRoomName(roomType, roomData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return (_a = (yield this.getRoomDirectives(roomType).roomName(roomData, userId))) !== null && _a !== void 0 ? _a : '';
        });
    }
    setRoomFind(roomType, roomFind) {
        const directives = this.getRoomDirectives(roomType);
        if (!directives) {
            return;
        }
        if (directives.roomFind) {
            throw new Error('Room find for the given type already exists');
        }
        directives.roomFind = roomFind;
    }
    getRoomFind(roomType) {
        return this.getRoomDirectives(roomType).roomFind;
    }
    searchableRoomTypes() {
        return Object.entries(this.roomTypes)
            .filter(([_identifier, { directives }]) => directives.includeInRoomSearch())
            .map(([identifier]) => identifier);
    }
}
exports.roomCoordinator = new RoomCoordinatorServer();
