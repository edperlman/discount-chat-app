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
exports.findAgents = findAgents;
exports.findManagers = findManagers;
const models_1 = require("@rocket.chat/models");
const string_helpers_1 = require("@rocket.chat/string-helpers");
/**
 * @param {IRole['_id']} role the role id
 * @param {string} text
 * @param {any} pagination
 */
function findUsers(_a) {
    return __awaiter(this, arguments, void 0, function* ({ role, text, onlyAvailable = false, excludeId, showIdleAgents = true, pagination: { offset, count, sort }, }) {
        const query = {};
        const orConditions = [];
        if (text) {
            const filterReg = new RegExp((0, string_helpers_1.escapeRegExp)(text), 'i');
            orConditions.push({ $or: [{ username: filterReg }, { name: filterReg }, { 'emails.address': filterReg }] });
        }
        if (onlyAvailable) {
            query.statusLivechat = 'available';
        }
        if (excludeId) {
            query._id = { $ne: excludeId };
        }
        if (!showIdleAgents) {
            orConditions.push({ $or: [{ status: { $exists: true, $ne: 'offline' }, roles: { $ne: 'bot' } }, { roles: 'bot' }] });
        }
        if (orConditions.length) {
            query.$and = orConditions;
        }
        const [{ sortedResults, totalCount: [{ total } = { total: 0 }], },] = yield models_1.Users.findAgentsWithDepartments(role, query, {
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
        return {
            users: sortedResults,
            count: sortedResults.length,
            offset,
            total,
        };
    });
}
function findAgents(_a) {
    return __awaiter(this, arguments, void 0, function* ({ text, onlyAvailable = false, excludeId, showIdleAgents = true, pagination: { offset, count, sort }, }) {
        return findUsers({
            role: 'livechat-agent',
            text,
            onlyAvailable,
            excludeId,
            showIdleAgents,
            pagination: {
                offset,
                count,
                sort,
            },
        });
    });
}
function findManagers(_a) {
    return __awaiter(this, arguments, void 0, function* ({ text, pagination: { offset, count, sort }, }) {
        return findUsers({
            role: 'livechat-manager',
            text,
            pagination: {
                offset,
                count,
                sort,
            },
        });
    });
}
