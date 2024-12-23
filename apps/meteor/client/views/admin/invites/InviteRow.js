"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericTable_1 = require("../../../components/GenericTable");
const useFormatDateAndTime_1 = require("../../../hooks/useFormatDateAndTime");
const useTimeFromNow_1 = require("../../../hooks/useTimeFromNow");
const isExpired = (expires) => {
    if (expires && expires.getTime() < new Date().getTime()) {
        return true;
    }
    return false;
};
const InviteRow = ({ _id, createdAt, expires, uses, maxUses, onRemove }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const formatDateAndTime = (0, useFormatDateAndTime_1.useFormatDateAndTime)();
    const removeInvite = (0, ui_contexts_1.useEndpoint)('DELETE', '/v1/removeInvite/:_id', { _id });
    const getTimeFromNow = (0, useTimeFromNow_1.useTimeFromNow)(false);
    const daysToExpire = (expires) => {
        if (expires) {
            if (isExpired(expires)) {
                return t('Expired');
            }
            return getTimeFromNow(expires);
        }
        return t('Never');
    };
    const maxUsesLeft = (maxUses, uses) => {
        if (maxUses > 0) {
            if (uses >= maxUses) {
                return 0;
            }
            return maxUses - uses;
        }
        return t('Unlimited');
    };
    const handleRemoveButtonClick = (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.stopPropagation();
        onRemove(() => removeInvite());
    });
    const notSmall = (0, fuselage_hooks_1.useMediaQuery)('(min-width: 768px)');
    return ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableRow, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { color: 'hint', fontScale: 'p2', children: _id }) }), notSmall && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { children: formatDateAndTime(new Date(createdAt)) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { children: daysToExpire(expires ? new Date(expires) : null) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { children: uses }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { children: maxUsesLeft(maxUses, uses) })] })), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { children: (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { icon: 'cross', danger: true, small: true, onClick: handleRemoveButtonClick }) })] }));
};
exports.default = InviteRow;
