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
exports.useStatusItems = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const useCustomStatusModalHandler_1 = require("./useCustomStatusModalHandler");
const callbacks_1 = require("../../../../../lib/callbacks");
const MarkdownText_1 = __importDefault(require("../../../../components/MarkdownText"));
const UserStatus_1 = require("../../../../components/UserStatus");
const userStatuses_1 = require("../../../../lib/userStatuses");
const useStatusDisabledModal_1 = require("../../../../views/admin/customUserStatus/hooks/useStatusDisabledModal");
const useStatusItems = () => {
    // We should lift this up to somewhere else if we want to use it in other places
    userStatuses_1.userStatuses.invisibleAllowed = (0, ui_contexts_1.useSetting)('Accounts_AllowInvisibleStatusOption', true);
    const queryClient = (0, react_query_1.useQueryClient)();
    (0, react_1.useEffect)(() => userStatuses_1.userStatuses.watch(() => {
        queryClient.setQueryData(['user-statuses'], Array.from(userStatuses_1.userStatuses));
    }), [queryClient]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const setStatus = (0, ui_contexts_1.useEndpoint)('POST', '/v1/users.setStatus');
    const setStatusMutation = (0, react_query_1.useMutation)({
        mutationFn: (status) => __awaiter(void 0, void 0, void 0, function* () {
            void setStatus({ status: status.statusType, message: userStatuses_1.userStatuses.isValidType(status.id) ? '' : status.name });
            void callbacks_1.callbacks.run('userStatusManuallySet', status);
        }),
    });
    const presenceDisabled = (0, ui_contexts_1.useSetting)('Presence_broadcast_disabled', false);
    const { data: statuses } = (0, react_query_1.useQuery)({
        queryKey: ['user-statuses'],
        queryFn: () => __awaiter(void 0, void 0, void 0, function* () {
            yield userStatuses_1.userStatuses.sync();
            return Array.from(userStatuses_1.userStatuses);
        }),
        staleTime: Infinity,
        select: (statuses) => statuses.map((status) => {
            const content = status.localizeName ? t(status.name) : status.name;
            return {
                id: status.id,
                status: (0, jsx_runtime_1.jsx)(UserStatus_1.UserStatus, { status: status.statusType }),
                content: (0, jsx_runtime_1.jsx)(MarkdownText_1.default, { content: content, parseEmoji: true, variant: 'inline' }),
                disabled: presenceDisabled,
                onClick: () => setStatusMutation.mutate(status),
            };
        }),
    });
    const handleStatusDisabledModal = (0, useStatusDisabledModal_1.useStatusDisabledModal)();
    const handleCustomStatus = (0, useCustomStatusModalHandler_1.useCustomStatusModalHandler)();
    return [
        ...(presenceDisabled
            ? [
                {
                    id: 'presence-disabled',
                    content: ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { fontScale: 'p2', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbe: 4, wordBreak: 'break-word', style: { whiteSpace: 'normal' }, children: t('User_status_disabled') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'a', color: 'info', onClick: handleStatusDisabledModal, children: t('Learn_more') })] })),
                },
            ]
            : []),
        ...(statuses !== null && statuses !== void 0 ? statuses : []),
        { id: 'custom-status', icon: 'emoji', content: t('Custom_Status'), onClick: handleCustomStatus, disabled: presenceDisabled },
    ];
};
exports.useStatusItems = useStatusItems;
