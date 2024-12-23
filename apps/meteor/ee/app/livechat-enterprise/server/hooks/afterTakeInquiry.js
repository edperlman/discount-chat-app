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
const server_1 = require("../../../../../app/settings/server");
const callbacks_1 = require("../../../../../lib/callbacks");
const Helper_1 = require("../lib/Helper");
const logger_1 = require("../lib/logger");
callbacks_1.callbacks.add('livechat.afterTakeInquiry', (_a) => __awaiter(void 0, [_a], void 0, function* ({ inquiry }) {
    if (!server_1.settings.get('Livechat_waiting_queue')) {
        return inquiry;
    }
    if (!inquiry) {
        return null;
    }
    const { department } = inquiry;
    (0, Helper_1.debouncedDispatchWaitingQueueStatus)(department);
    logger_1.cbLogger.debug(`Statuses for queue ${department || 'Public'} updated successfully`);
    return inquiry;
}), callbacks_1.callbacks.priority.MEDIUM, 'livechat-after-take-inquiry');
