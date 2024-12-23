"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_composer_1 = require("@rocket.chat/ui-composer");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const useAudioMessageAction_1 = require("./hooks/useAudioMessageAction");
const useCreateDiscussionAction_1 = require("./hooks/useCreateDiscussionAction");
const useFileUploadAction_1 = require("./hooks/useFileUploadAction");
const useShareLocationAction_1 = require("./hooks/useShareLocationAction");
const useVideoMessageAction_1 = require("./hooks/useVideoMessageAction");
const useWebdavActions_1 = require("./hooks/useWebdavActions");
const client_1 = require("../../../../../../app/ui-utils/client");
const isTruthy_1 = require("../../../../../../lib/isTruthy");
const useMessageboxAppsActionButtons_1 = require("../../../../../hooks/useMessageboxAppsActionButtons");
const ChatContext_1 = require("../../../contexts/ChatContext");
const RoomContext_1 = require("../../../contexts/RoomContext");
const isHidden = (hiddenActions, action) => {
    if (!action) {
        return true;
    }
    return hiddenActions.includes(action.id);
};
const MessageBoxActionsToolbar = ({ canSend, typing, isRecording, rid, tmid, variant = 'large', isMicrophoneDenied, }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const chatContext = (0, ChatContext_1.useChat)();
    if (!chatContext) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    const room = (0, RoomContext_1.useRoom)();
    const audioMessageAction = (0, useAudioMessageAction_1.useAudioMessageAction)(!canSend || typing || isRecording || isMicrophoneDenied, isMicrophoneDenied);
    const videoMessageAction = (0, useVideoMessageAction_1.useVideoMessageAction)(!canSend || typing || isRecording);
    const fileUploadAction = (0, useFileUploadAction_1.useFileUploadAction)(!canSend || typing || isRecording);
    const webdavActions = (0, useWebdavActions_1.useWebdavActions)();
    const createDiscussionAction = (0, useCreateDiscussionAction_1.useCreateDiscussionAction)(room);
    const shareLocationAction = (0, useShareLocationAction_1.useShareLocationAction)(room, tmid);
    const apps = (0, useMessageboxAppsActionButtons_1.useMessageboxAppsActionButtons)();
    const { composerToolbox: hiddenActions } = (0, ui_contexts_1.useLayoutHiddenActions)();
    const allActions = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (!isHidden(hiddenActions, audioMessageAction) && { audioMessageAction })), (!isHidden(hiddenActions, videoMessageAction) && { videoMessageAction })), (!isHidden(hiddenActions, fileUploadAction) && { fileUploadAction })), (!isHidden(hiddenActions, createDiscussionAction) && { createDiscussionAction })), (!isHidden(hiddenActions, shareLocationAction) && { shareLocationAction })), (!hiddenActions.includes('webdav-add') && { webdavActions }));
    const featured = [];
    const createNew = [];
    const share = [];
    createNew.push(allActions.createDiscussionAction);
    if (variant === 'small') {
        featured.push(allActions.audioMessageAction);
        createNew.push(allActions.videoMessageAction, allActions.fileUploadAction);
    }
    else {
        featured.push(allActions.audioMessageAction, allActions.videoMessageAction, allActions.fileUploadAction);
    }
    if (allActions.webdavActions) {
        createNew.push(...allActions.webdavActions);
    }
    share.push(allActions.shareLocationAction);
    const groups = Object.assign(Object.assign({}, (apps.isSuccess &&
        apps.data.length > 0 && {
        Apps: apps.data,
    })), client_1.messageBox.actions.get());
    const messageBoxActions = Object.entries(groups).map(([name, group]) => {
        const items = group
            .filter((item) => !hiddenActions.includes(item.id))
            .map((item) => ({
            id: item.id,
            icon: item.icon,
            content: t(item.label),
            onClick: (event) => item.action({
                rid,
                tmid,
                event: event,
                chat: chatContext,
            }),
            gap: Boolean(!item.icon),
        }));
        return {
            title: t(name),
            items: items || [],
        };
    });
    const createNewFiltered = createNew.filter(isTruthy_1.isTruthy);
    const shareFiltered = share.filter(isTruthy_1.isTruthy);
    const renderAction = ({ id, icon, content, disabled, onClick }) => {
        if (!icon) {
            return;
        }
        return (0, jsx_runtime_1.jsx)(ui_composer_1.MessageComposerAction, { icon: icon, "data-qa-id": id, title: content, disabled: disabled, onClick: onClick }, id);
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(ui_composer_1.MessageComposerActionsDivider, {}), featured.map((action) => action && renderAction(action)), (0, jsx_runtime_1.jsx)(ui_client_1.GenericMenu, { disabled: isRecording, "data-qa-id": 'menu-more-actions', detached: true, icon: 'plus', sections: [{ title: t('Create_new'), items: createNewFiltered }, { title: t('Share'), items: shareFiltered }, ...messageBoxActions], title: t('More_actions') })] }));
};
exports.default = (0, react_1.memo)(MessageBoxActionsToolbar);
