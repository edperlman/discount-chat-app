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
exports.useQuickActions = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const usePutChatOnHoldMutation_1 = require("./usePutChatOnHoldMutation");
const useReturnChatToQueueMutation_1 = require("./useReturnChatToQueueMutation");
const LivechatInquiry_1 = require("../../../../../../../app/livechat/client/collections/LivechatInquiry");
const PlaceChatOnHoldModal_1 = __importDefault(require("../../../../../../../app/livechat-enterprise/client/components/modals/PlaceChatOnHoldModal"));
const client_1 = require("../../../../../../../app/ui-utils/client");
const CloseChatModal_1 = __importDefault(require("../../../../../../components/Omnichannel/modals/CloseChatModal"));
const CloseChatModalData_1 = __importDefault(require("../../../../../../components/Omnichannel/modals/CloseChatModalData"));
const ForwardChatModal_1 = __importDefault(require("../../../../../../components/Omnichannel/modals/ForwardChatModal"));
const ReturnChatQueueModal_1 = __importDefault(require("../../../../../../components/Omnichannel/modals/ReturnChatQueueModal"));
const TranscriptModal_1 = __importDefault(require("../../../../../../components/Omnichannel/modals/TranscriptModal"));
const useIsRoomOverMacLimit_1 = require("../../../../../../hooks/omnichannel/useIsRoomOverMacLimit");
const useOmnichannelRouteConfig_1 = require("../../../../../../hooks/omnichannel/useOmnichannelRouteConfig");
const useHasLicenseModule_1 = require("../../../../../../hooks/useHasLicenseModule");
const ui_1 = require("../../../../../../ui");
const RoomContext_1 = require("../../../../contexts/RoomContext");
const quickActions_1 = require("../../../../lib/quickActions");
const useQuickActions = () => {
    var _a, _b, _c;
    const room = (0, RoomContext_1.useOmnichannelRoom)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const router = (0, ui_contexts_1.useRouter)();
    const t = (0, ui_contexts_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const [onHoldModalActive, setOnHoldModalActive] = (0, react_1.useState)(false);
    const visitorRoomId = room.v._id;
    const rid = room._id;
    const uid = (0, ui_contexts_1.useUserId)();
    const roomLastMessage = room.lastMessage;
    const getVisitorInfo = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/visitors.info');
    const getVisitorEmail = (0, fuselage_hooks_1.useMutableCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        if (!visitorRoomId) {
            return;
        }
        const { visitor: { visitorEmails }, } = yield getVisitorInfo({ visitorId: visitorRoomId });
        if ((visitorEmails === null || visitorEmails === void 0 ? void 0 : visitorEmails.length) && visitorEmails[0].address) {
            return visitorEmails[0].address;
        }
    }));
    (0, react_1.useEffect)(() => {
        if (onHoldModalActive && (roomLastMessage === null || roomLastMessage === void 0 ? void 0 : roomLastMessage.token)) {
            setModal(null);
        }
    }, [roomLastMessage, onHoldModalActive, setModal]);
    const closeModal = (0, react_1.useCallback)(() => setModal(null), [setModal]);
    const requestTranscript = (0, ui_contexts_1.useEndpoint)('POST', '/v1/livechat/transcript/:rid', { rid });
    const handleRequestTranscript = (0, react_1.useCallback)((email, subject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield requestTranscript({ email, subject });
            closeModal();
            dispatchToastMessage({
                type: 'success',
                message: t('Livechat_email_transcript_has_been_requested'),
            });
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }), [closeModal, dispatchToastMessage, requestTranscript, t]);
    const sendTranscriptPDF = (0, ui_contexts_1.useEndpoint)('POST', '/v1/omnichannel/:rid/request-transcript', { rid });
    const handleSendTranscriptPDF = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield sendTranscriptPDF();
            dispatchToastMessage({
                type: 'success',
                message: t('Livechat_transcript_has_been_requested'),
            });
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }), [dispatchToastMessage, sendTranscriptPDF, t]);
    const sendTranscript = (0, ui_contexts_1.useMethod)('livechat:sendTranscript');
    const handleSendTranscript = (0, react_1.useCallback)((email, subject, token) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield sendTranscript(token, rid, email, subject);
            closeModal();
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }), [closeModal, dispatchToastMessage, rid, sendTranscript]);
    const discardTranscript = (0, ui_contexts_1.useEndpoint)('DELETE', '/v1/livechat/transcript/:rid', { rid });
    const handleDiscardTranscript = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield discardTranscript();
            dispatchToastMessage({
                type: 'success',
                message: t('Livechat_transcript_request_has_been_canceled'),
            });
            closeModal();
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }), [closeModal, discardTranscript, dispatchToastMessage, t]);
    const forwardChat = (0, ui_contexts_1.useEndpoint)('POST', '/v1/livechat/room.forward');
    const handleForwardChat = (0, react_1.useCallback)((departmentId, userId, comment) => __awaiter(void 0, void 0, void 0, function* () {
        if (departmentId && userId) {
            return;
        }
        const transferData = {
            roomId: rid,
            comment,
            clientAction: true,
        };
        if (departmentId) {
            transferData.departmentId = departmentId;
        }
        if (userId) {
            transferData.userId = userId;
        }
        try {
            yield forwardChat(transferData);
            dispatchToastMessage({ type: 'success', message: t('Transferred') });
            router.navigate('/home');
            client_1.LegacyRoomManager.close(room.t + rid);
            closeModal();
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }), [closeModal, dispatchToastMessage, forwardChat, room.t, rid, router, t]);
    const closeChat = (0, ui_contexts_1.useEndpoint)('POST', '/v1/livechat/room.closeByUser');
    const handleClose = (0, react_1.useCallback)((comment, tags, preferences, requestData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield closeChat(Object.assign(Object.assign(Object.assign(Object.assign({ rid }, (comment && { comment })), (tags && { tags })), ((preferences === null || preferences === void 0 ? void 0 : preferences.omnichannelTranscriptPDF) && { generateTranscriptPdf: true })), ((preferences === null || preferences === void 0 ? void 0 : preferences.omnichannelTranscriptEmail) && requestData
                ? {
                    transcriptEmail: {
                        sendToVisitor: preferences === null || preferences === void 0 ? void 0 : preferences.omnichannelTranscriptEmail,
                        requestData,
                    },
                }
                : { transcriptEmail: { sendToVisitor: false } })));
            LivechatInquiry_1.LivechatInquiry.remove({ rid });
            closeModal();
            dispatchToastMessage({ type: 'success', message: t('Chat_closed_successfully') });
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }), [closeChat, closeModal, dispatchToastMessage, rid, t]);
    const returnChatToQueueMutation = (0, useReturnChatToQueueMutation_1.useReturnChatToQueueMutation)({
        onSuccess: () => {
            client_1.LegacyRoomManager.close(room.t + rid);
            router.navigate('/home');
        },
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
        onSettled: () => {
            closeModal();
        },
    });
    const putChatOnHoldMutation = (0, usePutChatOnHoldMutation_1.usePutChatOnHoldMutation)({
        onSuccess: () => {
            dispatchToastMessage({ type: 'success', message: t('Chat_On_Hold_Successfully') });
        },
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
        onSettled: () => {
            closeModal();
        },
    });
    const handleAction = (0, fuselage_hooks_1.useMutableCallback)((id) => __awaiter(void 0, void 0, void 0, function* () {
        switch (id) {
            case quickActions_1.QuickActionsEnum.MoveQueue:
                setModal((0, jsx_runtime_1.jsx)(ReturnChatQueueModal_1.default, { onMoveChat: () => returnChatToQueueMutation.mutate(rid), onCancel: () => {
                        closeModal();
                    } }));
                break;
            case quickActions_1.QuickActionsEnum.TranscriptPDF:
                handleSendTranscriptPDF();
                break;
            case quickActions_1.QuickActionsEnum.TranscriptEmail:
                const visitorEmail = yield getVisitorEmail();
                if (!visitorEmail) {
                    dispatchToastMessage({ type: 'error', message: t('Customer_without_registered_email') });
                    break;
                }
                setModal((0, jsx_runtime_1.jsx)(TranscriptModal_1.default, { room: room, email: visitorEmail, onRequest: handleRequestTranscript, onSend: handleSendTranscript, onDiscard: handleDiscardTranscript, onCancel: closeModal }));
                break;
            case quickActions_1.QuickActionsEnum.ChatForward:
                setModal((0, jsx_runtime_1.jsx)(ForwardChatModal_1.default, { room: room, onForward: handleForwardChat, onCancel: closeModal }));
                break;
            case quickActions_1.QuickActionsEnum.CloseChat:
                const email = yield getVisitorEmail();
                setModal(room.departmentId ? ((0, jsx_runtime_1.jsx)(CloseChatModalData_1.default, { visitorEmail: email, departmentId: room.departmentId, onConfirm: handleClose, onCancel: closeModal })) : ((0, jsx_runtime_1.jsx)(CloseChatModal_1.default, { visitorEmail: email, onConfirm: handleClose, onCancel: closeModal })));
                break;
            case quickActions_1.QuickActionsEnum.OnHoldChat:
                setModal((0, jsx_runtime_1.jsx)(PlaceChatOnHoldModal_1.default, { onOnHoldChat: () => putChatOnHoldMutation.mutate(rid), onCancel: () => {
                        closeModal();
                        setOnHoldModalActive(false);
                    } }));
                setOnHoldModalActive(true);
                break;
            default:
                break;
        }
    }));
    const omnichannelRouteConfig = (0, useOmnichannelRouteConfig_1.useOmnichannelRouteConfig)();
    const manualOnHoldAllowed = (0, ui_contexts_1.useSetting)('Livechat_allow_manual_on_hold');
    const hasManagerRole = (0, ui_contexts_1.useRole)('livechat-manager');
    const hasMonitorRole = (0, ui_contexts_1.useRole)('livechat-monitor');
    const roomOpen = (room === null || room === void 0 ? void 0 : room.open) && (((_a = room.u) === null || _a === void 0 ? void 0 : _a._id) === uid || hasManagerRole || hasMonitorRole) && ((_b = room === null || room === void 0 ? void 0 : room.lastMessage) === null || _b === void 0 ? void 0 : _b.t) !== 'livechat-close';
    const canMoveQueue = !!(omnichannelRouteConfig === null || omnichannelRouteConfig === void 0 ? void 0 : omnichannelRouteConfig.returnQueue) && (room === null || room === void 0 ? void 0 : room.u) !== undefined;
    const canForwardGuest = (0, ui_contexts_1.usePermission)('transfer-livechat-guest');
    const canSendTranscriptEmail = (0, ui_contexts_1.usePermission)('send-omnichannel-chat-transcript');
    const hasLicense = (0, useHasLicenseModule_1.useHasLicenseModule)('livechat-enterprise');
    const canSendTranscriptPDF = (0, ui_contexts_1.usePermission)('request-pdf-transcript');
    const canCloseRoom = (0, ui_contexts_1.usePermission)('close-livechat-room');
    const canCloseOthersRoom = (0, ui_contexts_1.usePermission)('close-others-livechat-room');
    const restrictedOnHold = (0, ui_contexts_1.useSetting)('Livechat_allow_manual_on_hold_upon_agent_engagement_only');
    const canRoomBePlacedOnHold = !room.onHold && room.u;
    const canAgentPlaceOnHold = !((_c = room.lastMessage) === null || _c === void 0 ? void 0 : _c.token);
    const canPlaceChatOnHold = Boolean(manualOnHoldAllowed && canRoomBePlacedOnHold && (!restrictedOnHold || canAgentPlaceOnHold));
    const isRoomOverMacLimit = (0, useIsRoomOverMacLimit_1.useIsRoomOverMacLimit)(room);
    const hasPermissionButtons = (id) => {
        switch (id) {
            case quickActions_1.QuickActionsEnum.MoveQueue:
                return !isRoomOverMacLimit && !!roomOpen && canMoveQueue;
            case quickActions_1.QuickActionsEnum.ChatForward:
                return !isRoomOverMacLimit && !!roomOpen && canForwardGuest;
            case quickActions_1.QuickActionsEnum.Transcript:
                return !isRoomOverMacLimit && (canSendTranscriptEmail || (hasLicense && canSendTranscriptPDF));
            case quickActions_1.QuickActionsEnum.TranscriptEmail:
                return !isRoomOverMacLimit && canSendTranscriptEmail;
            case quickActions_1.QuickActionsEnum.TranscriptPDF:
                return hasLicense && !isRoomOverMacLimit && canSendTranscriptPDF;
            case quickActions_1.QuickActionsEnum.CloseChat:
                return !!roomOpen && (canCloseRoom || canCloseOthersRoom);
            case quickActions_1.QuickActionsEnum.OnHoldChat:
                return !!roomOpen && canPlaceChatOnHold;
            default:
                break;
        }
        return false;
    };
    const quickActions = ui_1.quickActionHooks
        .map((quickActionHook) => quickActionHook())
        .filter((quickAction) => !!quickAction)
        .filter((action) => {
        const { options, id } = action;
        if (options) {
            action.options = options.filter(({ id }) => hasPermissionButtons(id));
        }
        return hasPermissionButtons(id);
    })
        .sort((a, b) => { var _a, _b; return ((_a = a.order) !== null && _a !== void 0 ? _a : 0) - ((_b = b.order) !== null && _b !== void 0 ? _b : 0); });
    const actionDefault = (0, fuselage_hooks_1.useMutableCallback)((actionId) => {
        handleAction(actionId);
    });
    return { quickActions, actionDefault };
};
exports.useQuickActions = useQuickActions;
