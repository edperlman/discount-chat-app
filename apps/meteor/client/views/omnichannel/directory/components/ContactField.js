"use strict";
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
const FormSkeleton_1 = require("./FormSkeleton");
const UserStatus_1 = require("../../../../components/UserStatus");
const roomCoordinator_1 = require("../../../../lib/rooms/roomCoordinator");
const AgentInfoDetails_1 = __importDefault(require("../../components/AgentInfoDetails"));
const Field_1 = __importDefault(require("../../components/Field"));
const Info_1 = __importDefault(require("../../components/Info"));
const Label_1 = __importDefault(require("../../components/Label"));
const ContactField = ({ contact, room }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { status } = contact;
    const { fname, t: type } = room;
    const avatarUrl = roomCoordinator_1.roomCoordinator.getRoomDirectives(type).getAvatarPath(room) || '';
    const getVisitorInfo = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/visitors.info');
    const { data, isLoading, isError } = (0, react_query_1.useQuery)(['/v1/livechat/visitors.info', contact._id], () => getVisitorInfo({ visitorId: contact._id }));
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(FormSkeleton_1.FormSkeleton, {});
    }
    if (isError || !(data === null || data === void 0 ? void 0 : data.visitor)) {
        return (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbs: 16, children: t('Contact_not_found') });
    }
    const { visitor: { username, name }, } = data;
    const displayName = name || username;
    return ((0, jsx_runtime_1.jsxs)(Field_1.default, { children: [(0, jsx_runtime_1.jsx)(Label_1.default, { children: t('Contact') }), (0, jsx_runtime_1.jsxs)(Info_1.default, { style: { display: 'flex' }, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Avatar, { size: 'x40', title: fname, url: avatarUrl }), (0, jsx_runtime_1.jsx)(AgentInfoDetails_1.default, { "data-qa-id": 'contactInfo-name', mis: 10, name: displayName, shortName: username, status: (0, jsx_runtime_1.jsx)(UserStatus_1.UserStatus, { status: status }) })] })] }));
};
exports.default = ContactField;
