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
const models_1 = require("@rocket.chat/models");
const Notifications_1 = __importDefault(require("../../../../../app/notifications/server/lib/Notifications"));
const callbacks_1 = require("../../../../../lib/callbacks");
callbacks_1.callbacks.add('livechat.removeAgentDepartment', (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { departmentId, agentsId } = options;
    yield models_1.CannedResponse.findByDepartmentId(departmentId, { projection: { _id: 1 } }).forEach((response) => {
        const { _id } = response;
        Notifications_1.default.streamCannedResponses.emit('canned-responses', { type: 'removed', _id }, { agentsId });
    });
    return options;
}), callbacks_1.callbacks.priority.HIGH, 'canned-responses-on-remove-agent-department');
