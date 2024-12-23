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
exports.RealAppsEngineUIHost = void 0;
const AppsEngineUIHost_1 = require("@rocket.chat/apps-engine/client/AppsEngineUIHost");
const meteor_1 = require("meteor/meteor");
const client_1 = require("../../app/models/client");
const getUserAvatarURL_1 = require("../../app/utils/client/getUserAvatarURL");
const SDKClient_1 = require("../../app/utils/client/lib/SDKClient");
const RoomManager_1 = require("../lib/RoomManager");
const baseURI_1 = require("../lib/baseURI");
// FIXME: replace non-null assertions with proper error handling
class RealAppsEngineUIHost extends AppsEngineUIHost_1.AppsEngineUIHost {
    constructor() {
        super();
        this._baseURL = baseURI_1.baseURI.replace(/\/$/, '');
    }
    getUserAvatarUrl(username) {
        const avatarUrl = (0, getUserAvatarURL_1.getUserAvatarURL)(username);
        if (!avatarUrl.startsWith('http') && !avatarUrl.startsWith('data')) {
            return `${this._baseURL}${avatarUrl}`;
        }
        return avatarUrl;
    }
    getClientRoomInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const { name: slugifiedName, _id: id } = client_1.Rooms.findOne(RoomManager_1.RoomManager.opened);
            let cachedMembers = [];
            try {
                const { members } = yield SDKClient_1.sdk.rest.get('/v1/groups.members', { roomId: id });
                cachedMembers = members.map(({ _id, username }) => ({
                    id: _id,
                    username: username,
                    avatarUrl: this.getUserAvatarUrl(username),
                }));
            }
            catch (error) {
                console.warn(error);
            }
            return {
                id,
                slugifiedName: slugifiedName,
                members: cachedMembers,
            };
        });
    }
    getClientUserInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, _id } = meteor_1.Meteor.user();
            return {
                id: _id,
                username: username,
                avatarUrl: this.getUserAvatarUrl(username) || '',
            };
        });
    }
}
exports.RealAppsEngineUIHost = RealAppsEngineUIHost;
