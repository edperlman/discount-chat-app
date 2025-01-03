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
exports.useReportUser = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const useUserDisplayName_1 = require("../../../../../hooks/useUserDisplayName");
const ReportUserModal_1 = __importDefault(require("../../../contextualBar/UserInfo/ReportUserModal"));
const useReportUser = (user) => {
    const { _id: uid, username, name } = user;
    const ownUserId = (0, ui_contexts_1.useUserId)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const displayName = (0, useUserDisplayName_1.useUserDisplayName)({ username, name });
    const reportUser = (0, ui_contexts_1.useEndpoint)('POST', '/v1/moderation.reportUser');
    const reportUserMutation = (0, react_query_1.useMutation)(['reportUser', uid], (description) => __awaiter(void 0, void 0, void 0, function* () {
        reportUser({ description, userId: uid });
    }), {
        onSuccess: () => dispatchToastMessage({ type: 'success', message: t('Report_has_been_sent') }),
        onError: (error) => dispatchToastMessage({ type: 'error', message: error }),
        onSettled: () => setModal(),
    });
    const openReportUserModal = (0, react_1.useMemo)(() => {
        const action = () => setModal((0, jsx_runtime_1.jsx)(ReportUserModal_1.default, { onConfirm: reportUserMutation.mutate, onClose: () => setModal(), displayName: displayName || '', username: username || '' }));
        return ownUserId !== uid
            ? {
                icon: 'warning',
                content: t('Report'),
                onClick: action,
                type: 'moderation',
                variant: 'danger',
            }
            : undefined;
    }, [ownUserId, uid, t, setModal, username, reportUserMutation.mutate, displayName]);
    return openReportUserModal;
};
exports.useReportUser = useReportUser;