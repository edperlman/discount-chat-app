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
const EditDepartment_1 = __importDefault(require("./EditDepartment"));
const EditDepartmentWithAllowedForwardData_1 = __importDefault(require("./EditDepartmentWithAllowedForwardData"));
const Skeleton_1 = require("../../../components/Skeleton");
const params = { onlyMyDepartments: 'true' };
const EditDepartmentWithData = ({ id, title }) => {
    var _a, _b;
    const { t } = (0, react_i18next_1.useTranslation)();
    const getDepartment = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/department/:_id', { _id: id !== null && id !== void 0 ? id : '' });
    const { data, isInitialLoading, isError } = (0, react_query_1.useQuery)(['/v1/livechat/department/:_id', id], () => getDepartment(params), {
        enabled: !!id,
    });
    if (isInitialLoading) {
        return (0, jsx_runtime_1.jsx)(Skeleton_1.FormSkeleton, { padding: '1.5rem 1rem', maxWidth: '37.5rem', margin: '0 auto' });
    }
    if (isError || (id && !(data === null || data === void 0 ? void 0 : data.department))) {
        return (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbs: 16, children: t('Department_not_found') });
    }
    if (((_a = data === null || data === void 0 ? void 0 : data.department) === null || _a === void 0 ? void 0 : _a.archived) === true) {
        return (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbs: 16, children: t('Department_archived') });
    }
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: ((_b = data === null || data === void 0 ? void 0 : data.department) === null || _b === void 0 ? void 0 : _b.departmentsAllowedToForward) && data.department.departmentsAllowedToForward.length > 0 ? ((0, jsx_runtime_1.jsx)(EditDepartmentWithAllowedForwardData_1.default, { id: id, data: data, title: title })) : ((0, jsx_runtime_1.jsx)(EditDepartment_1.default, { id: id, data: data, title: title })) }));
};
exports.default = EditDepartmentWithData;
