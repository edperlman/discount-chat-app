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
exports.findMonitors = findMonitors;
exports.findMonitorByUsername = findMonitorByUsername;
const models_1 = require("@rocket.chat/models");
const string_helpers_1 = require("@rocket.chat/string-helpers");
function findMonitors(_a) {
    return __awaiter(this, arguments, void 0, function* ({ text, pagination: { offset, count, sort }, }) {
        const query = {};
        if (text) {
            const filterReg = new RegExp((0, string_helpers_1.escapeRegExp)(text), 'i');
            Object.assign(query, {
                $or: [{ username: filterReg }, { name: filterReg }, { 'emails.address': filterReg }],
            });
        }
        const { cursor, totalCount } = models_1.Users.findPaginatedUsersInRolesWithQuery('livechat-monitor', query, {
            sort: sort || { name: 1 },
            skip: offset,
            limit: count,
            projection: {
                username: 1,
                name: 1,
                status: 1,
                statusLivechat: 1,
                emails: 1,
                livechat: 1,
            },
        });
        const [monitors, total] = yield Promise.all([cursor.toArray(), totalCount]);
        return {
            monitors,
            count: monitors.length,
            offset,
            total,
        };
    });
}
function findMonitorByUsername(_a) {
    return __awaiter(this, arguments, void 0, function* ({ username }) {
        const user = yield models_1.Users.findOne({ username, roles: 'livechat-monitor' }, {
            projection: {
                username: 1,
                name: 1,
                status: 1,
                statusLivechat: 1,
                emails: 1,
                livechat: 1,
            },
        });
        if (!user) {
            throw new Error('invalid-user');
        }
        return user;
    });
}
