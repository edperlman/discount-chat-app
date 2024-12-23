"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReportMessageAction = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const roomCoordinator_1 = require("../../../lib/rooms/roomCoordinator");
const ReportMessageModal_1 = __importDefault(require("../../../views/room/modals/ReportMessageModal"));
const getMainMessageText = (message) => {
    var _a, _b, _c, _d, _e, _f;
    const newMessage = Object.assign({}, message);
    newMessage.msg = newMessage.msg || ((_b = (_a = newMessage.attachments) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.description) || ((_d = (_c = newMessage.attachments) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.title) || '';
    newMessage.md = newMessage.md || ((_f = (_e = newMessage.attachments) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.descriptionMd) || undefined;
    return Object.assign({}, newMessage);
};
const useReportMessageAction = (message, { room, subscription }) => {
    const user = (0, ui_contexts_1.useUser)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const isLivechatRoom = roomCoordinator_1.roomCoordinator.isLivechatRoom(room.t);
    if (!subscription) {
        return null;
    }
    if (isLivechatRoom || message.u._id === (user === null || user === void 0 ? void 0 : user._id)) {
        return null;
    }
    return {
        id: 'report-message',
        icon: 'report',
        label: 'Report',
        context: ['message', 'message-mobile', 'threads', 'federated', 'videoconf', 'videoconf-threads'],
        color: 'alert',
        type: 'management',
        action() {
            setModal((0, jsx_runtime_1.jsx)(ReportMessageModal_1.default, { message: getMainMessageText(message), onClose: () => {
                    setModal(null);
                } }));
        },
        order: 9,
        group: 'menu',
    };
};
exports.useReportMessageAction = useReportMessageAction;
