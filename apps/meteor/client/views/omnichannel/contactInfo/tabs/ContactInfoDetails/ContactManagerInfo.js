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
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const UserStatus_1 = require("../../../../../components/UserStatus");
const ContactManagerInfo = ({ userId }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const getContactManagerByUsername = (0, ui_contexts_1.useEndpoint)('GET', '/v1/users.info');
    const { data, isLoading, isError } = (0, react_query_1.useQuery)(['getContactManagerByUserId', userId], () => __awaiter(void 0, void 0, void 0, function* () { return getContactManagerByUsername({ userId }); }));
    if (isError) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbe: 4, children: t('Contact_Manager') }), isLoading && (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, {}), !isLoading && ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', children: [data.user.username && (0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { size: 'x18', username: data.user.username }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mi: 8, children: (0, jsx_runtime_1.jsx)(UserStatus_1.UserStatus, { status: data.user.status }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2', children: data.user.name })] }))] }));
};
exports.default = ContactManagerInfo;
