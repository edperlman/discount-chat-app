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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllConversationsByAgentsCached = exports.findAllConversationsByTagsCached = exports.findAllConversationsByDepartmentCached = exports.findAllConversationsByStatusCached = exports.findAllConversationsBySourceCached = exports.findAllConversationsByAgents = exports.findAllConversationsByTags = exports.findAllConversationsByDepartment = exports.findAllConversationsByStatus = exports.findAllConversationsBySource = void 0;
const models_1 = require("@rocket.chat/models");
const mem_1 = __importDefault(require("mem"));
const defaultValue = { data: [], total: 0 };
const findAllConversationsBySource = (_a) => __awaiter(void 0, [_a], void 0, function* ({ start, end, extraQuery }) {
    return (yield models_1.LivechatRooms.getConversationsBySource(start, end, extraQuery).toArray())[0] || defaultValue;
});
exports.findAllConversationsBySource = findAllConversationsBySource;
const findAllConversationsByStatus = (_a) => __awaiter(void 0, [_a], void 0, function* ({ start, end, extraQuery }) {
    return (yield models_1.LivechatRooms.getConversationsByStatus(start, end, extraQuery).toArray())[0] || defaultValue;
});
exports.findAllConversationsByStatus = findAllConversationsByStatus;
const findAllConversationsByDepartment = (_a) => __awaiter(void 0, [_a], void 0, function* ({ start, end, sort, extraQuery, }) {
    const [result, total] = yield Promise.all([
        models_1.LivechatRooms.getConversationsByDepartment(start, end, sort, extraQuery).toArray(),
        models_1.LivechatRooms.getTotalConversationsWithoutDepartmentBetweenDates(start, end, extraQuery),
    ]);
    return Object.assign(Object.assign({}, ((result === null || result === void 0 ? void 0 : result[0]) || defaultValue)), { unspecified: total || 0 });
});
exports.findAllConversationsByDepartment = findAllConversationsByDepartment;
const findAllConversationsByTags = (_a) => __awaiter(void 0, [_a], void 0, function* ({ start, end, sort, extraQuery }) {
    const [result, total] = yield Promise.all([
        models_1.LivechatRooms.getConversationsByTags(start, end, sort, extraQuery).toArray(),
        models_1.LivechatRooms.getConversationsWithoutTagsBetweenDate(start, end, extraQuery),
    ]);
    return Object.assign(Object.assign({}, ((result === null || result === void 0 ? void 0 : result[0]) || defaultValue)), { unspecified: total || 0 });
});
exports.findAllConversationsByTags = findAllConversationsByTags;
const findAllConversationsByAgents = (_a) => __awaiter(void 0, [_a], void 0, function* ({ start, end, sort, extraQuery }) {
    const [result, total] = yield Promise.all([
        models_1.LivechatRooms.getConversationsByAgents(start, end, sort, extraQuery).toArray(),
        models_1.LivechatRooms.getTotalConversationsWithoutAgentsBetweenDate(start, end, extraQuery),
    ]);
    return Object.assign(Object.assign({}, ((result === null || result === void 0 ? void 0 : result[0]) || defaultValue)), { unspecified: total || 0 });
});
exports.findAllConversationsByAgents = findAllConversationsByAgents;
exports.findAllConversationsBySourceCached = (0, mem_1.default)(exports.findAllConversationsBySource, { maxAge: 60000, cacheKey: JSON.stringify });
exports.findAllConversationsByStatusCached = (0, mem_1.default)(exports.findAllConversationsByStatus, { maxAge: 60000, cacheKey: JSON.stringify });
exports.findAllConversationsByDepartmentCached = (0, mem_1.default)(exports.findAllConversationsByDepartment, { maxAge: 60000, cacheKey: JSON.stringify });
exports.findAllConversationsByTagsCached = (0, mem_1.default)(exports.findAllConversationsByTags, { maxAge: 60000, cacheKey: JSON.stringify });
exports.findAllConversationsByAgentsCached = (0, mem_1.default)(exports.findAllConversationsByAgents, { maxAge: 60000, cacheKey: JSON.stringify });
