"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChatsQuery = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const moment_1 = __importDefault(require("moment"));
const react_1 = require("react");
const sortDir = (sortDir) => (sortDir === 'asc' ? 1 : -1);
const useChatsQuery = () => {
    const userIdLoggedIn = (0, ui_contexts_1.useUserId)();
    const canViewLivechatRooms = (0, ui_contexts_1.usePermission)('view-livechat-rooms');
    const chatsQuery = (0, react_1.useCallback)((_a, _b, current, itemsPerPage) => {
        var { guest, servedBy, department, status, from, to, tags } = _a, customFields = __rest(_a, ["guest", "servedBy", "department", "status", "from", "to", "tags"]);
        var column = _b[0], direction = _b[1];
        const query = Object.assign(Object.assign(Object.assign(Object.assign({}, (guest && { roomName: guest })), { sort: JSON.stringify({
                [column]: sortDir(direction),
                ts: column === 'ts' ? sortDir(direction) : undefined,
            }) }), (itemsPerPage && { count: itemsPerPage })), (current && { offset: current }));
        if (from || to) {
            query.createdAt = JSON.stringify(Object.assign(Object.assign({}, (from && {
                start: (0, moment_1.default)(new Date(from)).set({ hour: 0, minutes: 0, seconds: 0 }).toISOString(),
            })), (to && {
                end: (0, moment_1.default)(new Date(to)).set({ hour: 23, minutes: 59, seconds: 59 }).toISOString(),
            })));
        }
        if (status !== 'all') {
            query.open = status === 'opened' || status === 'onhold' || status === 'queued';
            query.onhold = status === 'onhold';
            query.queued = status === 'queued';
        }
        if (!canViewLivechatRooms) {
            query.agents = userIdLoggedIn ? [userIdLoggedIn] : [];
        }
        if (canViewLivechatRooms && servedBy && servedBy !== 'all') {
            query.agents = [servedBy];
        }
        if (department && department !== 'all') {
            query.departmentId = department;
        }
        if (tags && tags.length > 0) {
            query.tags = tags.map((tag) => tag.value);
        }
        if (customFields && Object.keys(customFields).length > 0) {
            const customFieldsQuery = Object.fromEntries(Object.entries(customFields).filter((item) => item[1] !== undefined && item[1] !== ''));
            if (Object.keys(customFieldsQuery).length > 0) {
                query.customFields = JSON.stringify(customFieldsQuery);
            }
        }
        return query;
    }, [canViewLivechatRooms, userIdLoggedIn]);
    return chatsQuery;
};
exports.useChatsQuery = useChatsQuery;
