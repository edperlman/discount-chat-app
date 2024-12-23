"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const Field_1 = __importDefault(require("../../../components/Field"));
const Info_1 = __importDefault(require("../../../components/Info"));
const Label_1 = __importDefault(require("../../../components/Label"));
const useDepartmentInfo_1 = require("../../hooks/useDepartmentInfo");
const DepartmentField = ({ departmentId }) => {
    var _a;
    const { t } = (0, react_i18next_1.useTranslation)();
    const { data, isLoading, isError } = (0, useDepartmentInfo_1.useDepartmentInfo)(departmentId);
    return ((0, jsx_runtime_1.jsxs)(Field_1.default, { children: [(0, jsx_runtime_1.jsx)(Label_1.default, { children: t('Department') }), isLoading && (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, {}), isError && (0, jsx_runtime_1.jsx)(fuselage_1.Box, { color: 'danger', children: t('Something_went_wrong') }), !isLoading && !isError && (0, jsx_runtime_1.jsx)(Info_1.default, { children: ((_a = data === null || data === void 0 ? void 0 : data.department) === null || _a === void 0 ? void 0 : _a.name) || t('Department_not_found') })] }));
};
exports.default = DepartmentField;
