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
const InfoPanel_1 = require("../../../components/InfoPanel");
const FormSkeleton_1 = require("../directory/components/FormSkeleton");
const CustomField = ({ id, value }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const getCustomField = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/custom-fields/:_id', { _id: id });
    const { data, isLoading, isError } = (0, react_query_1.useQuery)(['/v1/livechat/custom-field', id], () => getCustomField());
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(FormSkeleton_1.FormSkeleton, {});
    }
    if (isError || !(data === null || data === void 0 ? void 0 : data.customField)) {
        return (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbs: 16, children: t('Custom_Field_Not_Found') });
    }
    const { label } = data.customField;
    if (!label) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: label }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelText, { children: value })] }));
};
exports.default = CustomField;
