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
exports.useNewDiscussionMessageAction = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const roomCoordinator_1 = require("../../../lib/rooms/roomCoordinator");
const CreateDiscussion_1 = __importDefault(require("../../CreateDiscussion"));
const useNewDiscussionMessageAction = (message, { room, subscription }) => {
    const user = (0, ui_contexts_1.useUser)();
    const enabled = (0, ui_contexts_1.useSetting)('Discussion_enabled', false);
    const setModal = (0, ui_contexts_1.useSetModal)();
    const canStartDiscussion = (0, ui_contexts_1.usePermission)('start-discussion', room._id);
    const canStartDiscussionOtherUser = (0, ui_contexts_1.usePermission)('start-discussion-other-user', room._id);
    if (!enabled) {
        return null;
    }
    const { u: { _id: uid }, drid, dcount, } = message;
    if (drid || !Number.isNaN(Number(dcount))) {
        return null;
    }
    if (!subscription) {
        return null;
    }
    const isLivechatRoom = roomCoordinator_1.roomCoordinator.isLivechatRoom(room.t);
    if (isLivechatRoom) {
        return null;
    }
    if (!user) {
        return null;
    }
    if (!(uid !== user._id ? canStartDiscussionOtherUser : canStartDiscussion)) {
        return null;
    }
    return {
        id: 'start-discussion',
        icon: 'discussion',
        label: 'Discussion_start',
        type: 'communication',
        context: ['message', 'message-mobile', 'videoconf'],
        action() {
            return __awaiter(this, void 0, void 0, function* () {
                var _a;
                setModal((0, jsx_runtime_1.jsx)(CreateDiscussion_1.default, { defaultParentRoom: (room === null || room === void 0 ? void 0 : room.prid) || (room === null || room === void 0 ? void 0 : room._id), onClose: () => setModal(undefined), parentMessageId: message._id, nameSuggestion: (_a = message === null || message === void 0 ? void 0 : message.msg) === null || _a === void 0 ? void 0 : _a.substr(0, 140) }));
            });
        },
        order: 1,
        group: 'menu',
    };
};
exports.useNewDiscussionMessageAction = useNewDiscussionMessageAction;
