"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useShowMessageReactionsAction = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const ReactionListModal_1 = __importDefault(require("../../../views/room/modals/ReactionListModal"));
const useShowMessageReactionsAction = (message) => {
    const setModal = (0, ui_contexts_1.useSetModal)();
    if (!message.reactions) {
        return null;
    }
    return {
        id: 'reaction-list',
        icon: 'emoji',
        label: 'Reactions',
        context: ['message', 'message-mobile', 'threads', 'videoconf', 'videoconf-threads'],
        type: 'interaction',
        action() {
            var _a;
            setModal((0, jsx_runtime_1.jsx)(ReactionListModal_1.default, { reactions: (_a = message.reactions) !== null && _a !== void 0 ? _a : {}, onClose: () => {
                    setModal(null);
                } }));
        },
        order: 9,
        group: 'menu',
    };
};
exports.useShowMessageReactionsAction = useShowMessageReactionsAction;
