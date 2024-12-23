"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
const EditDepartment_1 = __importDefault(require("./EditDepartment"));
const Skeleton_1 = require("../../../components/Skeleton");
const EditDepartmentWithAllowedForwardData = (_a) => {
    var _b;
    var { data } = _a, props = __rest(_a, ["data"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const getDepartmentListByIds = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/department.listByIds');
    const { data: allowedToForwardData, isInitialLoading, isError, } = (0, react_query_1.useQuery)(['/v1/livechat/department.listByIds', (_b = data === null || data === void 0 ? void 0 : data.department) === null || _b === void 0 ? void 0 : _b.departmentsAllowedToForward], () => {
        var _a, _b;
        return getDepartmentListByIds({
            ids: (_b = (_a = data === null || data === void 0 ? void 0 : data.department) === null || _a === void 0 ? void 0 : _a.departmentsAllowedToForward) !== null && _b !== void 0 ? _b : [],
        });
    });
    if (isInitialLoading) {
        return (0, jsx_runtime_1.jsx)(Skeleton_1.FormSkeleton, {});
    }
    if (isError) {
        return (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbs: 16, children: t('Not_Available') });
    }
    return (0, jsx_runtime_1.jsx)(EditDepartment_1.default, Object.assign({ data: data, allowedToForwardData: allowedToForwardData }, props));
};
exports.default = EditDepartmentWithAllowedForwardData;
