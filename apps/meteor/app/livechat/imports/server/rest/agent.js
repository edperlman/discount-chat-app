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
const agents_1 = require("../../../server/api/lib/agents");
server_1.API.v1.addRoute('livechat/agents/:agentId/departments', { authRequired: true, permissionsRequired: ['view-l-room'], validateParams: rest_typings_1.isGETLivechatAgentsAgentIdDepartmentsParams }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const departments = yield (0, agents_1.findAgentDepartments)({
                enabledDepartmentsOnly: this.queryParams.enabledDepartmentsOnly && this.queryParams.enabledDepartmentsOnly === 'true',
                agentId: this.urlParams.agentId,
            });
            return server_1.API.v1.success(departments);
        });
    },
});
