"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentBusinessHours = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useHasLicenseModule_1 = require("../../hooks/useHasLicenseModule");
const DepartmentBusinessHours = ({ bhId }) => {
    var _a;
    const { t } = (0, react_i18next_1.useTranslation)();
    const hasLicense = (0, useHasLicenseModule_1.useHasLicenseModule)('livechat-enterprise');
    const getBusinessHour = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/business-hour');
    const { data } = (0, react_query_1.useQuery)(['/v1/livechat/business-hour', bhId], () => getBusinessHour({ _id: bhId, type: 'custom' }));
    const name = (_a = data === null || data === void 0 ? void 0 : data.businessHour) === null || _a === void 0 ? void 0 : _a.name;
    if (!hasLicense) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Business_Hour') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { readOnly: true, value: name || '' }) })] }));
};
exports.DepartmentBusinessHours = DepartmentBusinessHours;
exports.default = exports.DepartmentBusinessHours;
