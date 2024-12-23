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
exports.deleteDepartment = exports.addAgentToDepartment = exports.createDepartment = void 0;
const faker_1 = require("@faker-js/faker");
const createDepartment = (api_1, ...args_1) => __awaiter(void 0, [api_1, ...args_1], void 0, function* (api, { name = '', enabled = true, description = '', showOnRegistration = false, showOnOfflineForm = false, requestTagBeforeClosingChat = false, email = '', chatClosingTags = [], offlineMessageChannelName = '', abandonedRoomsCloseCustomMessage = '', waitingQueueMessage = '', departmentsAllowedToForward = [], fallbackForwardDepartment = '', maxNumberSimultaneousChat, } = {}) {
    const response = yield api.post('/livechat/department', {
        department: {
            name: name || faker_1.faker.string.uuid(),
            enabled,
            description,
            showOnRegistration,
            showOnOfflineForm,
            requestTagBeforeClosingChat,
            email: email || faker_1.faker.internet.email(),
            chatClosingTags,
            offlineMessageChannelName,
            abandonedRoomsCloseCustomMessage,
            waitingQueueMessage,
            departmentsAllowedToForward,
            fallbackForwardDepartment,
            maxNumberSimultaneousChat,
        },
    });
    if (response.status() !== 200) {
        throw Error(`Unable to create department [http status: ${response.status()}]`);
    }
    const { department } = yield response.json();
    return {
        response,
        data: department,
        delete: () => __awaiter(void 0, void 0, void 0, function* () { return api.delete(`/livechat/department/${department._id}`); }),
    };
});
exports.createDepartment = createDepartment;
const addAgentToDepartment = (api_1, _a) => __awaiter(void 0, [api_1, _a], void 0, function* (api, { department, agentId, username }) {
    return api.post(`/livechat/department/${department._id}/agents`, {
        remove: [],
        upsert: [
            {
                agentId,
                username: username || agentId,
                count: 0,
                order: 0,
            },
        ],
    });
});
exports.addAgentToDepartment = addAgentToDepartment;
const deleteDepartment = (api_1, _a) => __awaiter(void 0, [api_1, _a], void 0, function* (api, { id }) { return api.delete(`/livechat/department/${id}`); });
exports.deleteDepartment = deleteDepartment;
