"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const ContactInfoDetailsGroup_1 = __importDefault(require("./ContactInfoDetailsGroup"));
const ContactManagerInfo_1 = __importDefault(require("./ContactManagerInfo"));
const Contextualbar_1 = require("../../../../../components/Contextualbar");
const useFormatDate_1 = require("../../../../../hooks/useFormatDate");
const CustomField_1 = __importDefault(require("../../../components/CustomField"));
const Field_1 = __importDefault(require("../../../components/Field"));
const Info_1 = __importDefault(require("../../../components/Info"));
const Label_1 = __importDefault(require("../../../components/Label"));
const ContactInfoDetails = ({ emails, phones, createdAt, customFieldEntries, contactManager }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const formatDate = (0, useFormatDate_1.useFormatDate)();
    return ((0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarScrollableContent, { children: [(emails === null || emails === void 0 ? void 0 : emails.length) ? (0, jsx_runtime_1.jsx)(ContactInfoDetailsGroup_1.default, { type: 'email', label: t('Email'), values: emails }) : null, (phones === null || phones === void 0 ? void 0 : phones.length) ? (0, jsx_runtime_1.jsx)(ContactInfoDetailsGroup_1.default, { type: 'phone', label: t('Phone_number'), values: phones }) : null, contactManager && (0, jsx_runtime_1.jsx)(ContactManagerInfo_1.default, { userId: contactManager }), (0, jsx_runtime_1.jsxs)(fuselage_1.Margins, { block: 4, children: [createdAt && ((0, jsx_runtime_1.jsxs)(Field_1.default, { children: [(0, jsx_runtime_1.jsx)(Label_1.default, { children: t('Created_at') }), (0, jsx_runtime_1.jsx)(Info_1.default, { children: formatDate(createdAt) })] })), customFieldEntries.length > 0 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Divider, { mi: -24 }), customFieldEntries === null || customFieldEntries === void 0 ? void 0 : customFieldEntries.map(([key, value]) => (0, jsx_runtime_1.jsx)(CustomField_1.default, { id: key, value: value }, key))] }))] })] }));
};
exports.default = ContactInfoDetails;
