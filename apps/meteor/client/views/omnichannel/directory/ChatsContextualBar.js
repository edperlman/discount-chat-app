"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const ChatsFiltersContextualBar_1 = __importDefault(require("./chats/ChatsFiltersContextualBar"));
const ContactHistoryMessagesList_1 = __importDefault(require("../contactHistory/MessageList/ContactHistoryMessagesList"));
const ChatsContextualBar = () => {
    const router = (0, ui_contexts_1.useRouter)();
    const context = (0, ui_contexts_1.useRouteParameter)('context');
    const id = (0, ui_contexts_1.useRouteParameter)('id');
    const handleOpenRoom = () => id && router.navigate(`/live/${id}`);
    const handleClose = () => router.navigate('/omnichannel-directory/chats');
    if (context === 'filters') {
        return (0, jsx_runtime_1.jsx)(ChatsFiltersContextualBar_1.default, { onClose: handleClose });
    }
    if (context === 'info' && id) {
        return (0, jsx_runtime_1.jsx)(ContactHistoryMessagesList_1.default, { chatId: id, onClose: handleClose, onOpenRoom: handleOpenRoom });
    }
    return null;
};
exports.default = ChatsContextualBar;
