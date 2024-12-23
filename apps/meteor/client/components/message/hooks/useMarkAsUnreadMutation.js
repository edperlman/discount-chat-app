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
exports.useMarkAsUnreadMutation = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const client_1 = require("../../../../app/ui-utils/client");
const SDKClient_1 = require("../../../../app/utils/client/lib/SDKClient");
const useMarkAsUnreadMutation = () => {
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    return (0, react_query_1.useMutation)({
        mutationFn: (_a) => __awaiter(void 0, [_a], void 0, function* ({ message, subscription }) {
            yield client_1.LegacyRoomManager.close(subscription.t + subscription.name);
            yield SDKClient_1.sdk.call('unreadMessages', message);
        }),
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
    });
};
exports.useMarkAsUnreadMutation = useMarkAsUnreadMutation;
