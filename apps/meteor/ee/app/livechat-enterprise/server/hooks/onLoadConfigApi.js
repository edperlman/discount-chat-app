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
const callbacks_1 = require("../../../../../lib/callbacks");
const Helper_1 = require("../lib/Helper");
callbacks_1.callbacks.add('livechat.onLoadConfigApi', (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { room } = options;
    const queueInfo = yield (0, Helper_1.getLivechatQueueInfo)(room);
    const customFields = yield (0, Helper_1.getLivechatCustomFields)();
    return Object.assign(Object.assign(Object.assign({}, (queueInfo && { queueInfo })), (customFields && { customFields })), options);
}), callbacks_1.callbacks.priority.MEDIUM, 'livechat-on-load-config-api');
