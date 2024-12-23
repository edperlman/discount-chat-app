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
exports.BeforeSaveCannedResponse = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const lodash_get_1 = __importDefault(require("lodash.get"));
const mem_1 = __importDefault(require("mem"));
const placeholderFields = {
    'contact.name': {
        from: 'visitor',
        dataKey: 'name',
    },
    'contact.email': {
        from: 'visitor',
        dataKey: 'visitorEmails[0].address',
    },
    'contact.phone': {
        from: 'visitor',
        dataKey: 'phone[0].phoneNumber',
    },
    'agent.name': {
        from: 'agent',
        dataKey: 'name',
    },
    'agent.email': {
        from: 'agent',
        dataKey: 'emails[0].address',
    },
};
class BeforeSaveCannedResponse {
    constructor() {
        this.getUser = (0, mem_1.default)((userId) => models_1.Users.findOneById(userId, { projection: { name: 1, _id: 1, emails: 1 } }), {
            maxAge: 1000 * 30,
        });
        this.getVisitor = (0, mem_1.default)((visitorId) => models_1.LivechatVisitors.findOneEnabledById(visitorId), {
            maxAge: 1000 * 30,
        });
    }
    replacePlaceholders(_a) {
        return __awaiter(this, arguments, void 0, function* ({ message, room, user, }) {
            var _b;
            // If the feature is disabled, return the message as is
            if (!BeforeSaveCannedResponse.enabled) {
                return message;
            }
            if (!message.msg || message.msg === '') {
                return message;
            }
            if (!(0, core_typings_1.isOmnichannelRoom)(room)) {
                return message;
            }
            // do not replace placeholders for visitors
            if (!user || (0, core_typings_1.isILivechatVisitor)(user)) {
                return message;
            }
            const agentId = (_b = room === null || room === void 0 ? void 0 : room.servedBy) === null || _b === void 0 ? void 0 : _b._id;
            if (!agentId) {
                return message;
            }
            const getAgent = (agentId) => {
                if (agentId === user._id) {
                    return user;
                }
                return this.getUser(agentId);
            };
            message.msg = yield Object.keys(placeholderFields).reduce((messageText, field) => __awaiter(this, void 0, void 0, function* () {
                const placeholderConfig = placeholderFields[field];
                const from = placeholderConfig.from === 'agent' ? yield getAgent(agentId) : yield this.getVisitor(room.v._id);
                const data = (0, lodash_get_1.default)(from, placeholderConfig.dataKey, '');
                return (yield messageText).replace(new RegExp(`{{${field}}}`, 'g'), data);
            }), Promise.resolve(message.msg));
            return message;
        });
    }
}
exports.BeforeSaveCannedResponse = BeforeSaveCannedResponse;
BeforeSaveCannedResponse.enabled = false;
