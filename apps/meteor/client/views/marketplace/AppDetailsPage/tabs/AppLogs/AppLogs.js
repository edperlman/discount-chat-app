"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const AppLogsItem_1 = __importDefault(require("./AppLogsItem"));
const useFormatDateAndTime_1 = require("../../../../../hooks/useFormatDateAndTime");
const AccordionLoading_1 = __importDefault(require("../../../components/AccordionLoading"));
const useLogs_1 = require("../../../hooks/useLogs");
const AppLogs = ({ id }) => {
    var _a;
    const { t } = (0, react_i18next_1.useTranslation)();
    const formatDateAndTime = (0, useFormatDateAndTime_1.useFormatDateAndTime)();
    const { data, isSuccess, isError, isLoading } = (0, useLogs_1.useLogs)(id);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [isLoading && (0, jsx_runtime_1.jsx)(AccordionLoading_1.default, {}), isError && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { maxWidth: 'x600', alignSelf: 'center', children: t('App_not_found') })), isSuccess && ((0, jsx_runtime_1.jsx)(fuselage_1.Accordion, { width: '100%', alignSelf: 'center', children: (_a = data === null || data === void 0 ? void 0 : data.logs) === null || _a === void 0 ? void 0 : _a.map((log) => ((0, jsx_runtime_1.jsx)(AppLogsItem_1.default, { title: `${formatDateAndTime(log._createdAt)}: "${log.method}" (${log.totalTime}ms)`, instanceId: log.instanceId, entries: log.entries }, log._createdAt))) }))] }));
};
exports.default = AppLogs;
