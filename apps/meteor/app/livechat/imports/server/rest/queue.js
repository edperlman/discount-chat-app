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
const rest_typings_1 = require("@rocket.chat/rest-typings");
const server_1 = require("../../../../api/server");
const getPaginationItems_1 = require("../../../../api/server/helpers/getPaginationItems");
const queue_1 = require("../../../server/api/lib/queue");
server_1.API.v1.addRoute('livechat/queue', { authRequired: true, permissionsRequired: ['view-l-room'], validateParams: rest_typings_1.isGETLivechatQueueParams }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort } = yield this.parseJsonQuery();
            const { agentId, includeOfflineAgents, departmentId } = this.queryParams;
            const users = yield (0, queue_1.findQueueMetrics)({
                agentId,
                includeOfflineAgents: includeOfflineAgents === 'true',
                departmentId,
                pagination: {
                    offset,
                    count,
                    sort,
                },
            });
            return server_1.API.v1.success(users);
        });
    },
});
