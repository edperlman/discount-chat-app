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
exports.useUnstarMessageAction = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const useUnstarMessageMutation_1 = require("../hooks/useUnstarMessageMutation");
const useUnstarMessageAction = (message, { room }) => {
    const user = (0, ui_contexts_1.useUser)();
    const allowStarring = (0, ui_contexts_1.useSetting)('Message_AllowStarring');
    const { mutateAsync: unstarMessage } = (0, useUnstarMessageMutation_1.useUnstarMessageMutation)();
    if (!allowStarring || (0, core_typings_1.isOmnichannelRoom)(room)) {
        return null;
    }
    if (!Array.isArray(message.starred) || message.starred.every((star) => star._id !== (user === null || user === void 0 ? void 0 : user._id))) {
        return null;
    }
    return {
        id: 'unstar-message',
        icon: 'star',
        label: 'Unstar_Message',
        type: 'interaction',
        context: ['starred', 'message', 'message-mobile', 'threads', 'federated', 'videoconf', 'videoconf-threads'],
        action() {
            return __awaiter(this, void 0, void 0, function* () {
                yield unstarMessage(message);
            });
        },
        order: 3,
        group: 'menu',
    };
};
exports.useUnstarMessageAction = useUnstarMessageAction;
