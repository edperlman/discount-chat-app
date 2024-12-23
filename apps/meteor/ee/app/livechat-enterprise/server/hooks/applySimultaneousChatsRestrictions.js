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
const models_1 = require("@rocket.chat/models");
const server_1 = require("../../../../../app/settings/server");
const callbacks_1 = require("../../../../../lib/callbacks");
callbacks_1.callbacks.add('livechat.applySimultaneousChatRestrictions', (_1, ...args_1) => __awaiter(void 0, [_1, ...args_1], void 0, function* (_, { departmentId } = {}) {
    var _a;
    if (departmentId) {
        const departmentLimit = ((_a = (yield models_1.LivechatDepartment.findOneById(departmentId, {
            projection: { maxNumberSimultaneousChat: 1 },
        }))) === null || _a === void 0 ? void 0 : _a.maxNumberSimultaneousChat) || 0;
        if (departmentLimit > 0) {
            return { $match: { 'queueInfo.chats': { $gte: Number(departmentLimit) } } };
        }
    }
    const maxChatsPerSetting = server_1.settings.get('Livechat_maximum_chats_per_agent');
    const agentFilter = {
        $and: [
            { 'livechat.maxNumberSimultaneousChat': { $gt: 0 } },
            { $expr: { $gte: ['queueInfo.chats', 'livechat.maxNumberSimultaneousChat'] } },
        ],
    };
    // apply filter only if agent setting is 0 or is disabled
    const globalFilter = maxChatsPerSetting > 0
        ? {
            $and: [
                {
                    $or: [
                        {
                            'livechat.maxNumberSimultaneousChat': { $exists: false },
                        },
                        { 'livechat.maxNumberSimultaneousChat': 0 },
                        { 'livechat.maxNumberSimultaneousChat': '' },
                        { 'livechat.maxNumberSimultaneousChat': null },
                    ],
                },
                { 'queueInfo.chats': { $gte: maxChatsPerSetting } },
            ],
        }
        : // dummy filter meaning: don't match anything
            { _id: '' };
    return { $match: { $or: [agentFilter, globalFilter] } };
}), callbacks_1.callbacks.priority.HIGH, 'livechat-apply-simultaneous-restrictions');
