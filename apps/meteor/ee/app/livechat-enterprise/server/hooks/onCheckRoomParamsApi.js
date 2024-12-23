"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check_1 = require("meteor/check");
const callbacks_1 = require("../../../../../lib/callbacks");
callbacks_1.callbacks.add('livechat.onCheckRoomApiParams', (params) => (Object.assign(Object.assign({}, params), { sla: check_1.Match.Maybe(String), priority: check_1.Match.Maybe(String) })), callbacks_1.callbacks.priority.MEDIUM, 'livechat-on-check-room-params-api');
