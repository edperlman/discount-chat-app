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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const useRemoveBusinessHour_1 = require("./useRemoveBusinessHour");
const GenericTable_1 = require("../../components/GenericTable");
const BusinessHoursRow = ({ _id, name, timezone, workHours, active, type }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const handleRemove = (0, useRemoveBusinessHour_1.useRemoveBusinessHour)();
    const handleClick = () => router.navigate(`/omnichannel/businessHours/edit/${type}/${_id}`);
    const handleKeyDown = (e) => {
        if (!['Enter', 'Space'].includes(e.nativeEvent.code)) {
            return;
        }
        handleClick();
    };
    const openDays = (0, react_1.useMemo)(() => workHours.filter(({ open }) => !!open).map(({ day }) => day), [workHours]);
    return ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableRow, { role: 'link', action: true, tabIndex: 0, onClick: handleClick, onKeyDown: handleKeyDown, children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: name || t('Default') }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: t(timezone.name) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: openDays.join(', ') }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: active ? t('Yes') : t('No') }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: name && ((0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { icon: 'trash', small: true, title: t('Remove'), onClick: (e) => {
                        e.stopPropagation();
                        handleRemove(_id, type);
                    } })) })] }, _id));
};
exports.default = (0, react_1.memo)(BusinessHoursRow);
