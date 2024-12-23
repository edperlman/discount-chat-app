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
exports.useGetMessageByID = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const client_1 = require("../../../../../../app/models/client");
const onClientMessageReceived_1 = require("../../../../../lib/onClientMessageReceived");
const mapMessageFromApi_1 = require("../../../../../lib/utils/mapMessageFromApi");
const useGetMessageByID = () => {
    const getMessage = (0, ui_contexts_1.useEndpoint)('GET', '/v1/chat.getMessage');
    return (0, react_1.useCallback)((mid) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { message: rawMessage } = yield getMessage({ msgId: mid });
            const mappedMessage = (0, mapMessageFromApi_1.mapMessageFromApi)(rawMessage);
            const message = (yield (0, onClientMessageReceived_1.onClientMessageReceived)(mappedMessage)) || mappedMessage;
            client_1.Messages.upsert({ _id: message._id }, { $set: message });
            return message;
        }
        catch (error) {
            if (typeof error === 'object' && error !== null && 'success' in error) {
                throw new Error('Message not found');
            }
            throw error;
        }
    }), [getMessage]);
};
exports.useGetMessageByID = useGetMessageByID;
