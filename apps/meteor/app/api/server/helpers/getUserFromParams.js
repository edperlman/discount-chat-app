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
exports.getUserFromParams = getUserFromParams;
exports.getUserListFromParams = getUserListFromParams;
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
function getUserFromParams(params) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        let user;
        const projection = { username: 1, name: 1, status: 1, statusText: 1, roles: 1 };
        if ((_a = params.userId) === null || _a === void 0 ? void 0 : _a.trim()) {
            user = yield models_1.Users.findOneById(params.userId, { projection });
        }
        else if ((_b = params.username) === null || _b === void 0 ? void 0 : _b.trim()) {
            user = yield models_1.Users.findOneByUsernameIgnoringCase(params.username, { projection });
        }
        else if ((_c = params.user) === null || _c === void 0 ? void 0 : _c.trim()) {
            user = yield models_1.Users.findOneByUsernameIgnoringCase(params.user, { projection });
        }
        else {
            throw new meteor_1.Meteor.Error('error-user-param-not-provided', 'The required "userId" or "username" param was not provided');
        }
        if (!user) {
            throw new meteor_1.Meteor.Error('error-invalid-user', 'The required "userId" or "username" param provided does not match any users');
        }
        return user;
    });
}
function getUserListFromParams(params) {
    return __awaiter(this, void 0, void 0, function* () {
        // if params.userId is provided, include it as well
        const soleUser = params.userId || params.username || params.user;
        let userListParam = params.userIds || params.usernames || [];
        userListParam.push(soleUser || '');
        userListParam = userListParam.filter(Boolean);
        // deduplicate to avoid errors
        userListParam = [...new Set(userListParam)];
        if (!userListParam.length) {
            throw new meteor_1.Meteor.Error('error-users-params-not-provided', 'Please provide "userId" or "username" or "userIds" or "usernames" as param');
        }
        if (params.userIds || params.userId) {
            return models_1.Users.findByIds(userListParam, { projection: { username: 1 } }).toArray();
        }
        return models_1.Users.findByUsernamesIgnoringCase(userListParam, { projection: { username: 1 } }).toArray();
    });
}
