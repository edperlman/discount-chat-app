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
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const MessageContextFooter_1 = __importDefault(require("./MessageContextFooter"));
const ContextMessage_1 = __importDefault(require("./helpers/ContextMessage"));
const Contextualbar_1 = require("../../../components/Contextualbar");
const GenericNoResults_1 = __importDefault(require("../../../components/GenericNoResults"));
const UserMessages = ({ userId, onRedirect }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const getUserMessages = (0, ui_contexts_1.useEndpoint)('GET', '/v1/moderation.user.reportedMessages');
    const { data: report, refetch: reloadUserMessages, isLoading, isSuccess, isError, } = (0, react_query_1.useQuery)(['moderation', 'msgReports', 'fetchDetails', { userId }], () => __awaiter(void 0, void 0, void 0, function* () {
        const messages = yield getUserMessages({ userId });
        return messages;
    }), {
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
    });
    const handleChange = (0, fuselage_hooks_1.useMutableCallback)(() => {
        reloadUserMessages();
    });
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', width: 'full', height: 'full', overflowY: 'auto', overflowX: 'hidden', children: [isLoading && (0, jsx_runtime_1.jsx)(fuselage_1.Message, { children: t('Loading') }), isSuccess && ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { padding: 24, children: [report.messages.length > 0 && ((0, jsx_runtime_1.jsx)(fuselage_1.Callout, { title: t('Moderation_Duplicate_messages'), type: 'warning', icon: 'warning', children: t('Moderation_Duplicate_messages_warning') })), !report.user && ((0, jsx_runtime_1.jsx)(fuselage_1.Callout, { mbs: 8, type: 'warning', icon: 'warning', children: t('Moderation_User_deleted_warning') }))] })), isSuccess &&
                        report.messages.length > 0 &&
                        report.messages.map((message) => ((0, jsx_runtime_1.jsx)(react_1.Fragment, { children: (0, jsx_runtime_1.jsx)(ContextMessage_1.default, { message: message.message, room: message.room, onRedirect: onRedirect, onChange: handleChange, deleted: !report.user }) }, message._id))), isSuccess && report.messages.length === 0 && (0, jsx_runtime_1.jsx)(GenericNoResults_1.default, { title: t('No_message_reports'), icon: 'message' }), isError && ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', alignItems: 'center', pb: 20, color: 'default', children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: 'warning', variation: 'danger' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: t('Something_went_wrong') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesActions, { children: (0, jsx_runtime_1.jsx)(fuselage_1.StatesAction, { onClick: handleChange, children: t('Reload_page') }) })] }))] }), isSuccess && report.messages.length > 0 && ((0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarFooter, { children: (0, jsx_runtime_1.jsx)(MessageContextFooter_1.default, { userId: userId, deleted: !report.user }) }))] }));
};
exports.default = UserMessages;
