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
exports.TestsUserBridge = void 0;
const bridges_1 = require("../../../src/server/bridges");
class TestsUserBridge extends bridges_1.UserBridge {
    getById(id, appId) {
        throw new Error('Method not implemented.');
    }
    getByUsername(username, appId) {
        throw new Error('Method not implemented.');
    }
    create(user) {
        throw new Error('Method not implemented');
    }
    getActiveUserCount() {
        throw new Error('Method not implemented.');
    }
    remove(user, appId) {
        throw new Error('Method not implemented.');
    }
    getAppUser(appId) {
        throw new Error('Method not implemented.');
    }
    update(user, updates, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Method not implemented');
        });
    }
    deleteUsersCreatedByApp(appId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Method not implemented');
        });
    }
    getUserUnreadMessageCount(uid, appId) {
        throw new Error('Method not implemented.');
    }
    deactivate(userId, confirmRelinquish, appId) {
        throw new Error('Method not implemented.');
    }
}
exports.TestsUserBridge = TestsUserBridge;
