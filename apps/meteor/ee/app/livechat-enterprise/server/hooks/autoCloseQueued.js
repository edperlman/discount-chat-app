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
const QueueInactivityMonitor_1 = require("../lib/QueueInactivityMonitor");
server_1.settings.watch('Livechat_max_queue_wait_time', (value) => {
    if (!value || value < 0) {
        callbacks_1.callbacks.remove('livechat.afterTakeInquiry', 'livechat-after-inquiry-taken-remove-schedule');
        return;
    }
    callbacks_1.callbacks.add('livechat.afterTakeInquiry', (_a) => __awaiter(void 0, [_a], void 0, function* ({ inquiry }) {
        if (!(inquiry === null || inquiry === void 0 ? void 0 : inquiry._id)) {
            return;
        }
        yield QueueInactivityMonitor_1.OmnichannelQueueInactivityMonitor.stopInquiry(inquiry._id);
    }), callbacks_1.callbacks.priority.HIGH, 'livechat-after-inquiry-taken-remove-schedule');
});
