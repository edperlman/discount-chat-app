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
exports.usePinMessageAction = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const PinMessageModal_1 = __importDefault(require("../../../views/room/modals/PinMessageModal"));
const usePinMessageMutation_1 = require("../hooks/usePinMessageMutation");
const usePinMessageAction = (message, { room, subscription }) => {
    const setModal = (0, ui_contexts_1.useSetModal)();
    const allowPinning = (0, ui_contexts_1.useSetting)('Message_AllowPinning');
    const hasPermission = (0, ui_contexts_1.usePermission)('pin-message', room._id);
    const { mutateAsync: pinMessage } = (0, usePinMessageMutation_1.usePinMessageMutation)();
    if (!allowPinning || (0, core_typings_1.isOmnichannelRoom)(room) || !hasPermission || message.pinned || !subscription) {
        return null;
    }
    const onConfirm = () => __awaiter(void 0, void 0, void 0, function* () {
        pinMessage(message);
        setModal(null);
    });
    return {
        id: 'pin-message',
        icon: 'pin',
        label: 'Pin',
        type: 'interaction',
        context: ['pinned', 'message', 'message-mobile', 'threads', 'direct', 'videoconf', 'videoconf-threads'],
        action() {
            return __awaiter(this, void 0, void 0, function* () {
                setModal((0, jsx_runtime_1.jsx)(PinMessageModal_1.default, { message: message, onConfirm: onConfirm, onCancel: () => setModal(null) }));
            });
        },
        order: 2,
        group: 'menu',
    };
};
exports.usePinMessageAction = usePinMessageAction;
