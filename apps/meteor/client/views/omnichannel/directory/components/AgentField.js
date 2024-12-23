"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const FormSkeleton_1 = require("./FormSkeleton");
const UserStatus_1 = require("../../../../components/UserStatus");
const AgentInfoDetails_1 = __importDefault(require("../../components/AgentInfoDetails"));
const Field_1 = __importDefault(require("../../components/Field"));
const Info_1 = __importDefault(require("../../components/Info"));
const Label_1 = __importDefault(require("../../components/Label"));
const AgentField = ({ agent, isSmall = false }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { username = '' } = agent !== null && agent !== void 0 ? agent : {};
    const getUserInfo = (0, ui_contexts_1.useEndpoint)('GET', '/v1/users.info');
    const { data, isLoading } = (0, react_query_1.useQuery)(['/v1/users.info', username], () => getUserInfo({ username }));
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(FormSkeleton_1.FormSkeleton, {});
    }
    const { user: { name, status }, } = data !== null && data !== void 0 ? data : { user: {} };
    const displayName = name || username;
    return ((0, jsx_runtime_1.jsxs)(Field_1.default, { children: [(0, jsx_runtime_1.jsx)(Label_1.default, { children: t('Agent') }), (0, jsx_runtime_1.jsxs)(Info_1.default, { style: { display: 'flex' }, children: [(0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { size: isSmall ? 'x28' : 'x40', title: username, username: username || '' }), (0, jsx_runtime_1.jsx)(AgentInfoDetails_1.default, { mis: isSmall ? 'x8' : 'x10', name: displayName, shortName: username, status: (0, jsx_runtime_1.jsx)(UserStatus_1.UserStatus, { status: status }) })] })] }));
};
exports.default = AgentField;
