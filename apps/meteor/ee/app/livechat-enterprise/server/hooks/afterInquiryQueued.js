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
exports.afterInquiryQueued = void 0;
const moment_1 = __importDefault(require("moment"));
const server_1 = require("../../../../../app/settings/server");
const callbacks_1 = require("../../../../../lib/callbacks");
const QueueInactivityMonitor_1 = require("../lib/QueueInactivityMonitor");
const logger_1 = require("../lib/logger");
const afterInquiryQueued = (inquiry) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(inquiry === null || inquiry === void 0 ? void 0 : inquiry._id) || !(inquiry === null || inquiry === void 0 ? void 0 : inquiry._updatedAt)) {
        return;
    }
    const timer = server_1.settings.get('Livechat_max_queue_wait_time');
    if (timer <= 0) {
        return;
    }
    // schedule individual jobs instead of property for close inactivty
    const newQueueTime = (0, moment_1.default)(inquiry._updatedAt).add(timer, 'minutes');
    logger_1.cbLogger.debug(`Scheduling estimated close time at ${newQueueTime} for queued inquiry ${inquiry._id}`);
    yield QueueInactivityMonitor_1.OmnichannelQueueInactivityMonitor.scheduleInquiry(inquiry._id, new Date(newQueueTime.format()));
});
exports.afterInquiryQueued = afterInquiryQueued;
server_1.settings.watch('Livechat_max_queue_wait_time', (value) => {
    if (value <= 0) {
        callbacks_1.callbacks.remove('livechat.afterInquiryQueued', 'livechat-inquiry-queued-set-queue-timer');
        return;
    }
    callbacks_1.callbacks.add('livechat.afterInquiryQueued', exports.afterInquiryQueued, callbacks_1.callbacks.priority.HIGH, 'livechat-inquiry-queued-set-queue-timer');
});
