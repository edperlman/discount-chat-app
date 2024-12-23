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
exports.PrioritiesSelect = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const useHasLicenseModule_1 = require("../../hooks/useHasLicenseModule");
const PriorityIcon_1 = require("../priorities/PriorityIcon");
const PrioritiesSelect = ({ value = '', label, options, onChange }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const hasLicense = (0, useHasLicenseModule_1.useHasLicenseModule)('livechat-enterprise');
    const [sorting] = (0, react_1.useState)({});
    const formattedOptions = (0, react_1.useMemo)(() => {
        const opts = options === null || options === void 0 ? void 0 : options.map(({ dirty, name, i18n, _id, sortItem }) => {
            const label = dirty && name ? name : t(i18n);
            sorting[_id] = sortItem;
            return [_id, label];
        });
        return [['', t('Unprioritized')], ...opts];
    }, [options, sorting, t]);
    const renderOption = (0, react_1.useCallback)((label, value) => {
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(PriorityIcon_1.PriorityIcon, { level: sorting[value] || core_typings_1.LivechatPriorityWeight.NOT_SPECIFIED, showUnprioritized: true }), " ", label] }));
    }, [sorting]);
    // eslint-disable-next-line react/no-multi-comp
    const renderOptions = (0, react_1.forwardRef)(function OptionsWrapper(props, ref) {
        return (0, jsx_runtime_1.jsx)(fuselage_1.Options, Object.assign({ ref: ref }, props, { maxHeight: 200 }));
    });
    if (!hasLicense) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: label }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.SelectLegacy, { value: value, onChange: onChange, options: formattedOptions, renderOptions: renderOptions, renderSelected: ({ label, value }) => (0, jsx_runtime_1.jsx)(fuselage_1.Box, { flexGrow: '1', children: renderOption(label, value) }), renderItem: (_a) => {
                        var { label, value } = _a, props = __rest(_a, ["label", "value"]);
                        return (0, jsx_runtime_1.jsx)(fuselage_1.Option, Object.assign({}, props, { label: renderOption(label, value) }));
                    } }) })] }));
};
exports.PrioritiesSelect = PrioritiesSelect;
exports.default = exports.PrioritiesSelect;
