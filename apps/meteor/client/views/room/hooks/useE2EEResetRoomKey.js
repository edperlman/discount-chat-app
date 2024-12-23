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
exports.useE2EEResetRoomKey = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const client_1 = require("../../../../app/e2e/client");
const useE2EEResetRoomKey = (options) => {
    const resetRoomKey = (0, ui_contexts_1.useEndpoint)('POST', '/v1/e2e.resetRoomKey');
    return (0, react_query_1.useMutation)((_a) => __awaiter(void 0, [_a], void 0, function* ({ roomId }) {
        var _b;
        const e2eRoom = yield client_1.e2e.getInstanceByRoomId(roomId);
        if (!e2eRoom) {
            throw new Error('Cannot reset room key');
        }
        const { e2eKey, e2eKeyId } = (_b = (yield e2eRoom.resetRoomKey())) !== null && _b !== void 0 ? _b : {};
        if (!e2eKey || !e2eKeyId) {
            throw new Error('Cannot reset room key');
        }
        try {
            yield resetRoomKey({ rid: roomId, e2eKeyId, e2eKey });
        }
        catch (error) {
            throw error;
        }
    }), options);
};
exports.useE2EEResetRoomKey = useE2EEResetRoomKey;
