"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const asyncState_1 = require("../../../lib/asyncState");
const GenericNoResults_1 = __importDefault(require("../../GenericNoResults/GenericNoResults"));
const GenericTable_1 = require("../../GenericTable");
// TODO: Missing error state
const DeviceManagementTable = ({ data, phase, error, reload, headers, renderRow, current, itemsPerPage, setCurrent, setItemsPerPage, paginationProps, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    if (!data && phase === asyncState_1.AsyncStatePhase.REJECTED) {
        return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', children: (0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: 'warning', variation: 'danger' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: t('Something_went_wrong') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesSubtitle, { children: t('We_Could_not_retrive_any_data') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesSubtitle, { children: error === null || error === void 0 ? void 0 : error.message }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesActions, { children: (0, jsx_runtime_1.jsx)(fuselage_1.StatesAction, { onClick: reload, children: t('Retry') }) })] }) }));
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(data === null || data === void 0 ? void 0 : data.sessions.length) === 0 && phase === asyncState_1.AsyncStatePhase.RESOLVED && (0, jsx_runtime_1.jsx)(GenericNoResults_1.default, {}), (0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTable, { children: [(data === null || data === void 0 ? void 0 : data.sessions) && data.sessions.length > 0 && headers && (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableHeader, { children: headers }), (0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableBody, { children: [phase === asyncState_1.AsyncStatePhase.LOADING && (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableLoadingTable, { headerCells: headers.filter(Boolean).length }), phase === asyncState_1.AsyncStatePhase.RESOLVED && (data === null || data === void 0 ? void 0 : data.sessions) && data.sessions.map(renderRow)] })] }), phase === asyncState_1.AsyncStatePhase.RESOLVED && ((0, jsx_runtime_1.jsx)(fuselage_1.Pagination, Object.assign({ divider: true, current: current, itemsPerPage: itemsPerPage, count: (data === null || data === void 0 ? void 0 : data.total) || 0, onSetCurrent: setCurrent, onSetItemsPerPage: setItemsPerPage }, paginationProps)))] }));
};
exports.default = DeviceManagementTable;
