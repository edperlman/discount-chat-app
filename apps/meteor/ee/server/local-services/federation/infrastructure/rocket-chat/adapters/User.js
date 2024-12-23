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
exports.RocketChatUserAdapterEE = void 0;
const models_1 = require("@rocket.chat/models");
const User_1 = require("../../../../../../../server/services/federation/infrastructure/rocket-chat/adapters/User");
class RocketChatUserAdapterEE extends User_1.RocketChatUserAdapter {
    createLocalUser(internalUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingLocalUser = internalUser.username && (yield models_1.Users.findOneByUsername(internalUser.username, { projection: { _id: 1 } }));
            if (existingLocalUser) {
                return;
            }
            yield models_1.Users.insertOne({
                username: internalUser.username,
                type: internalUser.type,
                status: internalUser.status,
                active: internalUser.active,
                roles: internalUser.roles,
                name: internalUser.name,
                requirePasswordChange: internalUser.requirePasswordChange,
                createdAt: new Date(),
                federated: internalUser.federated,
            });
        });
    }
    getSearchedServerNamesByUserId(internalUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.Users.findSearchedServerNamesByUserId(internalUserId);
        });
    }
    addServerNameToSearchedServerNamesListByUserId(internalUserId, serverName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.Users.addServerNameToSearchedServerNamesList(internalUserId, serverName);
        });
    }
    removeServerNameFromSearchedServerNamesListByUserId(internalUserId, serverName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.Users.removeServerNameFromSearchedServerNamesList(internalUserId, serverName);
        });
    }
}
exports.RocketChatUserAdapterEE = RocketChatUserAdapterEE;
