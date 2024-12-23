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
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const useRecordList_1 = require("../hooks/lists/useRecordList");
const useAsyncState_1 = require("../hooks/useAsyncState");
const useDepartmentsList_1 = require("./Omnichannel/hooks/useDepartmentsList");
const AutoCompleteDepartment = (_a) => {
    var { value, excludeDepartmentId, onlyMyDepartments, onChange, haveAll, haveNone, showArchived = false } = _a, props = __rest(_a, ["value", "excludeDepartmentId", "onlyMyDepartments", "onChange", "haveAll", "haveNone", "showArchived"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const [departmentsFilter, setDepartmentsFilter] = (0, react_1.useState)('');
    const debouncedDepartmentsFilter = (0, fuselage_hooks_1.useDebouncedValue)(departmentsFilter, 500);
    const { itemsList: departmentsList, loadMoreItems: loadMoreDepartments } = (0, useDepartmentsList_1.useDepartmentsList)((0, react_1.useMemo)(() => ({
        filter: debouncedDepartmentsFilter,
        onlyMyDepartments,
        haveAll,
        haveNone,
        excludeDepartmentId,
        showArchived,
        selectedDepartment: value,
    }), [debouncedDepartmentsFilter, onlyMyDepartments, haveAll, haveNone, excludeDepartmentId, showArchived, value]));
    const { phase: departmentsPhase, items: departmentsItems, itemCount: departmentsTotal } = (0, useRecordList_1.useRecordList)(departmentsList);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.PaginatedSelectFiltered, Object.assign({ withTitle: true }, props, { value: value, onChange: onChange, filter: departmentsFilter, setFilter: setDepartmentsFilter, options: departmentsItems, placeholder: t('Select_an_option'), "data-qa": 'autocomplete-department', endReached: departmentsPhase === useAsyncState_1.AsyncStatePhase.LOADING
            ? () => undefined
            : (start) => loadMoreDepartments(start, Math.min(50, departmentsTotal)) })));
};
exports.default = (0, react_1.memo)(AutoCompleteDepartment);
