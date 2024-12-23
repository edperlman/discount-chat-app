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
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const Contextualbar_1 = require("../../../components/Contextualbar");
const InfoPanel_1 = require("../../../components/InfoPanel");
const UserInfo_1 = require("../../../components/UserInfo");
const UserStatus_1 = require("../../../components/UserStatus");
const additionalForms_1 = require("../additionalForms");
const AgentInfoAction_1 = __importDefault(require("./AgentInfoAction"));
const useRemoveAgent_1 = require("./hooks/useRemoveAgent");
const AgentInfo = ({ uid }) => {
    var _a;
    const { t } = (0, react_i18next_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const getAgentById = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/users/agent/:_id', { _id: uid });
    const { data, isLoading, isError } = (0, react_query_1.useQuery)(['livechat-getAgentInfoById', uid], () => __awaiter(void 0, void 0, void 0, function* () { return getAgentById(); }), {
        refetchOnWindowFocus: false,
    });
    const handleDelete = (0, useRemoveAgent_1.useRemoveAgent)(uid);
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(fuselage_1.ContextualbarSkeleton, {});
    }
    if (isError) {
        return (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbs: 16, children: t('User_not_found') });
    }
    const { username, statusLivechat, status: userStatus } = data === null || data === void 0 ? void 0 : data.user;
    return ((0, jsx_runtime_1.jsxs)(Contextualbar_1.Contextualbar, { "data-qa-id": 'agent-info-contextual-bar', children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: t('User_Info') }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: () => router.navigate('/omnichannel/agents') })] }), (0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarScrollableContent, { children: [username && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { alignSelf: 'center', children: (0, jsx_runtime_1.jsx)(UserInfo_1.UserInfoAvatar, { "data-qa": 'AgentUserInfoAvatar', username: username }) })), (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { align: 'center', children: [(0, jsx_runtime_1.jsx)(AgentInfoAction_1.default, { title: t('Edit'), label: t('Edit'), onClick: () => router.navigate(`/omnichannel/agents/edit/${uid}`), icon: 'edit' }, t('Edit')), (0, jsx_runtime_1.jsx)(AgentInfoAction_1.default, { title: t('Remove'), label: t('Remove'), onClick: handleDelete, icon: 'trash' }, t('Remove'))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Margins, { block: 4, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { mb: 2, children: (0, jsx_runtime_1.jsx)(UserInfo_1.UserInfoUsername, { "data-qa": 'AgentInfoUserInfoUserName', username: username, status: (0, jsx_runtime_1.jsx)(UserStatus_1.UserStatus, { status: userStatus }) }) }), statusLivechat && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { "data-qa": 'AgentInfoUserInfoLabel', children: t('Livechat_status') }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelText, { children: statusLivechat === 'available' ? t('Available') : t('Not_Available') })] })), additionalForms_1.MaxChatsPerAgentDisplay && (0, jsx_runtime_1.jsx)(additionalForms_1.MaxChatsPerAgentDisplay, { maxNumberSimultaneousChat: (_a = data.user.livechat) === null || _a === void 0 ? void 0 : _a.maxNumberSimultaneousChat })] })] })] }));
};
exports.default = AgentInfo;
