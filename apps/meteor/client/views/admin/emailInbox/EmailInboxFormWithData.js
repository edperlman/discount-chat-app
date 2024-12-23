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
const EmailInboxForm_1 = __importDefault(require("./EmailInboxForm"));
const Skeleton_1 = require("../../../components/Skeleton");
const EmailInboxFormWithData = ({ id }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const getEmailInboxById = (0, ui_contexts_1.useEndpoint)('GET', '/v1/email-inbox/:_id', { _id: id });
    const { data, isLoading, error } = (0, react_query_1.useQuery)(['email-inbox', id], () => getEmailInboxById());
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(Skeleton_1.FormSkeleton, {});
    }
    if (error || !data) {
        return ((0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: 'circle-exclamation', variation: 'danger' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: t('error-email-inbox-not-found') })] }));
    }
    return (0, jsx_runtime_1.jsx)(EmailInboxForm_1.default, { inboxData: data });
};
exports.default = EmailInboxFormWithData;
