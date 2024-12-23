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
const core_services_1 = require("@rocket.chat/core-services");
const rest_typings_1 = require("@rocket.chat/rest-typings");
const server_1 = require("../../../../app/api/server");
const getPaginationItems_1 = require("../../../../app/api/server/helpers/getPaginationItems");
server_1.API.v1.addRoute('federation/searchPublicRooms', {
    authRequired: true,
    validateParams: rest_typings_1.isFederationSearchPublicRoomsProps,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { serverName, roomName, pageToken } = this.queryParams;
            const result = yield core_services_1.FederationEE.searchPublicRooms(serverName, roomName, pageToken, count);
            return server_1.API.v1.success(result);
        });
    },
});
server_1.API.v1.addRoute('federation/listServersByUser', {
    authRequired: true,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const servers = yield core_services_1.FederationEE.getSearchedServerNamesByInternalUserId(this.userId);
            return server_1.API.v1.success({
                servers,
            });
        });
    },
});
server_1.API.v1.addRoute('federation/addServerByUser', {
    authRequired: true,
    validateParams: rest_typings_1.isFederationAddServerProps,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { serverName } = this.bodyParams;
            yield core_services_1.FederationEE.addSearchedServerNameByInternalUserId(this.userId, serverName);
            return server_1.API.v1.success();
        });
    },
});
server_1.API.v1.addRoute('federation/removeServerByUser', {
    authRequired: true,
    validateParams: rest_typings_1.isFederationRemoveServerProps,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { serverName } = this.bodyParams;
            yield core_services_1.FederationEE.removeSearchedServerNameByInternalUserId(this.userId, serverName);
            return server_1.API.v1.success();
        });
    },
});
server_1.API.v1.addRoute('federation/joinExternalPublicRoom', {
    authRequired: true,
    validateParams: rest_typings_1.isFederationJoinExternalPublicRoomProps,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { externalRoomId, roomName, pageToken } = this.bodyParams;
            yield core_services_1.FederationEE.scheduleJoinExternalPublicRoom(this.userId, externalRoomId, roomName, decodeURIComponent(pageToken || ''));
            return server_1.API.v1.success();
        });
    },
});
