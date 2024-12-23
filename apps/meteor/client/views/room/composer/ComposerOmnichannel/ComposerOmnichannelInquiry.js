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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComposerOmnichannelInquiry = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_composer_1 = require("@rocket.chat/ui-composer");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const useOmnichannelAgentAvailable_1 = require("../../../../hooks/omnichannel/useOmnichannelAgentAvailable");
const RoomContext_1 = require("../../contexts/RoomContext");
const ComposerOmnichannelInquiry = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const user = (0, ui_contexts_1.useUser)();
    const agentAvailable = (0, useOmnichannelAgentAvailable_1.useOmnichannelAgentAvailable)();
    const room = (0, RoomContext_1.useOmnichannelRoom)();
    const getInquire = (0, ui_contexts_1.useEndpoint)('GET', `/v1/livechat/inquiries.getOne`);
    const result = (0, react_query_1.useQuery)(['inquire', room._id], () => getInquire({
        roomId: room._id,
    }));
    const takeInquiry = (0, ui_contexts_1.useMethod)('livechat:takeInquiry');
    const handleTakeInquiry = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!result.isSuccess) {
            return;
        }
        if (!result.data.inquiry) {
            return;
        }
        try {
            yield takeInquiry(result.data.inquiry._id, { clientAction: true });
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    });
    const title = (0, react_1.useMemo)(() => {
        if ((user === null || user === void 0 ? void 0 : user.status) === 'offline') {
            return t('You_cant_take_chats_offline');
        }
        if (!agentAvailable) {
            return t('You_cant_take_chats_unavailable');
        }
    }, [agentAvailable, t, user === null || user === void 0 ? void 0 : user.status]);
    return ((0, jsx_runtime_1.jsxs)(ui_composer_1.MessageFooterCallout, { "aria-busy": result.isLoading, children: [(0, jsx_runtime_1.jsx)(ui_composer_1.MessageFooterCalloutContent, { children: t('you_are_in_preview_mode_of_incoming_livechat') }), (0, jsx_runtime_1.jsx)(ui_composer_1.MessageFooterCalloutAction, Object.assign({}, (title && { title }), { disabled: result.isLoading || (user === null || user === void 0 ? void 0 : user.status) === 'offline' || !agentAvailable, onClick: handleTakeInquiry, children: t('Take_it') }))] }));
};
exports.ComposerOmnichannelInquiry = ComposerOmnichannelInquiry;
