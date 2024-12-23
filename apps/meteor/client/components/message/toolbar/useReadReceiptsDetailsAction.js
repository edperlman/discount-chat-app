"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReadReceiptsDetailsAction = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const ReadReceiptsModal_1 = __importDefault(require("../../../views/room/modals/ReadReceiptsModal"));
const useReadReceiptsDetailsAction = (message) => {
    const setModal = (0, ui_contexts_1.useSetModal)();
    const readReceiptsEnabled = (0, ui_contexts_1.useSetting)('Message_Read_Receipt_Enabled', false);
    const readReceiptsStoreUsers = (0, ui_contexts_1.useSetting)('Message_Read_Receipt_Store_Users', false);
    if (!readReceiptsEnabled || !readReceiptsStoreUsers) {
        return null;
    }
    return {
        id: 'receipt-detail',
        icon: 'check-double',
        label: 'Read_Receipts',
        context: ['starred', 'message', 'message-mobile', 'threads', 'videoconf', 'videoconf-threads'],
        type: 'duplication',
        action() {
            setModal((0, jsx_runtime_1.jsx)(ReadReceiptsModal_1.default, { messageId: message._id, onClose: () => {
                    setModal(null);
                } }));
        },
        order: 10,
        group: 'menu',
    };
};
exports.useReadReceiptsDetailsAction = useReadReceiptsDetailsAction;
