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
exports.findQueueMetrics = findQueueMetrics;
const models_1 = require("@rocket.chat/models");
function findQueueMetrics(_a) {
    return __awaiter(this, arguments, void 0, function* ({ agentId, includeOfflineAgents, departmentId, pagination: { offset, count, sort }, }) {
        const result = yield models_1.LivechatRooms.getQueueMetrics({
            departmentId,
            agentId,
            includeOfflineAgents,
            options: {
                sort: sort || { chats: -1 },
                offset,
                count,
            },
        });
        const { sortedResults: queue, totalCount: [{ total } = { total: 0 }], } = result[0];
        return {
            queue,
            count: queue.length,
            offset,
            total,
        };
    });
}
