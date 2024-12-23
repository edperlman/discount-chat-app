"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const Contextualbar_1 = require("../../../../components/Contextualbar");
const ContactInfoError_1 = __importDefault(require("../ContactInfoError"));
const ContactInfo_1 = __importDefault(require("./ContactInfo"));
const ContactInfoWithData = ({ id: contactId, onClose }) => {
    const canViewCustomFields = (0, ui_contexts_1.usePermission)('view-livechat-room-customfields');
    const getContact = (0, ui_contexts_1.useEndpoint)('GET', '/v1/omnichannel/contacts.get');
    const { data, isLoading, isError } = (0, react_query_1.useQuery)(['getContactById', contactId], () => getContact({ contactId }), {
        enabled: canViewCustomFields && !!contactId,
    });
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarSkeleton, {});
    }
    if (isError || !(data === null || data === void 0 ? void 0 : data.contact)) {
        return (0, jsx_runtime_1.jsx)(ContactInfoError_1.default, { onClose: onClose });
    }
    return (0, jsx_runtime_1.jsx)(ContactInfo_1.default, { contact: data === null || data === void 0 ? void 0 : data.contact, onClose: onClose });
};
exports.default = ContactInfoWithData;
