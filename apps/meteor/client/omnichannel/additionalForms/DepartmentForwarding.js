"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentForwarding = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const useDepartmentsList_1 = require("../../components/Omnichannel/hooks/useDepartmentsList");
const useRecordList_1 = require("../../hooks/lists/useRecordList");
const useAsyncState_1 = require("../../hooks/useAsyncState");
const useHasLicenseModule_1 = require("../../hooks/useHasLicenseModule");
const DepartmentForwarding = ({ departmentId, value = [], handler, label }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [departmentsFilter, setDepartmentsFilter] = (0, react_1.useState)('');
    const hasLicense = (0, useHasLicenseModule_1.useHasLicenseModule)('livechat-enterprise');
    const debouncedDepartmentsFilter = (0, fuselage_hooks_1.useDebouncedValue)(departmentsFilter, 500);
    const { itemsList: departmentsList, loadMoreItems: loadMoreDepartments } = (0, useDepartmentsList_1.useDepartmentsList)((0, react_1.useMemo)(() => ({ filter: departmentsFilter, departmentId, showArchived: true }), [departmentId, departmentsFilter]));
    const { phase: departmentsPhase, items: departmentsItems, itemCount: departmentsTotal } = (0, useRecordList_1.useRecordList)(departmentsList);
    const options = (0, react_1.useMemo)(() => {
        const pending = value.filter(({ value }) => !departmentsItems.find((dep) => dep.value === value));
        return [...departmentsItems, ...pending];
    }, [departmentsItems, value]);
    if (!hasLicense) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t(label) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { w: '100%', children: (0, jsx_runtime_1.jsx)(fuselage_1.PaginatedMultiSelectFiltered, { withTitle: true, maxWidth: '100%', w: '100%', flexGrow: 1, filter: debouncedDepartmentsFilter, setFilter: setDepartmentsFilter, onChange: handler, options: options, value: value, placeholder: t('Select_an_option'), endReached: departmentsPhase === useAsyncState_1.AsyncStatePhase.LOADING
                            ? () => undefined
                            : (start) => {
                                if (start === undefined) {
                                    return;
                                }
                                loadMoreDepartments(start, Math.min(50, departmentsTotal));
                            }, renderItem: (_a) => {
                            var { label } = _a, props = __rest(_a, ["label"]);
                            return ((0, jsx_runtime_1.jsx)(fuselage_1.CheckOption, Object.assign({}, props, { label: (0, jsx_runtime_1.jsx)("span", { style: { whiteSpace: 'normal' }, children: label }), selected: value.some((item) => item.value === props.value) })));
                        } }) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { children: t('List_of_departments_for_forward_description') })] }));
};
exports.DepartmentForwarding = DepartmentForwarding;
exports.default = exports.DepartmentForwarding;
