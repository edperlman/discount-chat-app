"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCreateDiscussionAction = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const CreateDiscussion_1 = __importDefault(require("../../../../../../components/CreateDiscussion"));
const useCreateDiscussionAction = (room) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    if (!room) {
        throw new Error('Invalid room');
    }
    const handleCreateDiscussion = () => setModal((0, jsx_runtime_1.jsx)(CreateDiscussion_1.default, { onClose: () => setModal(null), defaultParentRoom: (room === null || room === void 0 ? void 0 : room.prid) || (room === null || room === void 0 ? void 0 : room._id) }));
    const discussionEnabled = (0, ui_contexts_1.useSetting)('Discussion_enabled', true);
    const canStartDiscussion = (0, ui_contexts_1.usePermission)('start-discussion', room._id);
    const canSstartDiscussionOtherUser = (0, ui_contexts_1.usePermission)('start-discussion-other-user', room._id);
    const allowDiscussion = room && discussionEnabled && !(0, core_typings_1.isRoomFederated)(room) && (canStartDiscussion || canSstartDiscussionOtherUser);
    return {
        id: 'create-discussion',
        content: t('Discussion'),
        icon: 'discussion',
        disabled: !allowDiscussion,
        onClick: handleCreateDiscussion,
    };
};
exports.useCreateDiscussionAction = useCreateDiscussionAction;
