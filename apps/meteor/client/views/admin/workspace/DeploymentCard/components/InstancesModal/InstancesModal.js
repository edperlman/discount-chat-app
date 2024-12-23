"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const DescriptionList_1 = __importDefault(require("./DescriptionList"));
const DescriptionListEntry_1 = __importDefault(require("./DescriptionListEntry"));
const GenericModal_1 = __importDefault(require("../../../../../../components/GenericModal"));
const useFormatDateAndTime_1 = require("../../../../../../hooks/useFormatDateAndTime");
const InstancesModal = ({ instances = [], onClose }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const formatDateAndTime = (0, useFormatDateAndTime_1.useFormatDateAndTime)();
    return ((0, jsx_runtime_1.jsx)(GenericModal_1.default, { onConfirm: onClose, confirmText: t('Close'), icon: null, title: t('Instances'), onClose: onClose, children: (0, jsx_runtime_1.jsx)(fuselage_1.Accordion, { children: instances.map(({ address, broadcastAuth, currentStatus, instanceRecord }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Accordion.Item, { defaultExpanded: true, title: address, children: (0, jsx_runtime_1.jsxs)(DescriptionList_1.default, { children: [(0, jsx_runtime_1.jsx)(DescriptionListEntry_1.default, { label: t('Address'), children: address }), (0, jsx_runtime_1.jsx)(DescriptionListEntry_1.default, { label: t('Auth'), children: broadcastAuth ? 'true' : 'false' }), (0, jsx_runtime_1.jsx)(DescriptionListEntry_1.default, { label: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [t('Current_Status'), " > ", t('Connected')] }), children: currentStatus.connected ? 'true' : 'false' }), (0, jsx_runtime_1.jsx)(DescriptionListEntry_1.default, { label: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [t('Current_Status'), " > ", t('Local')] }), children: currentStatus.local ? 'true' : 'false' }), (0, jsx_runtime_1.jsx)(DescriptionListEntry_1.default, { label: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [t('Current_Status'), " > ", t('Last_Heartbeat_Time')] }), children: currentStatus.lastHeartbeatTime }), (0, jsx_runtime_1.jsx)(DescriptionListEntry_1.default, { label: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [t('Instance_Record'), " > ID"] }), children: instanceRecord === null || instanceRecord === void 0 ? void 0 : instanceRecord._id }), (0, jsx_runtime_1.jsx)(DescriptionListEntry_1.default, { label: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [t('Instance_Record'), " > ", t('PID')] }), children: instanceRecord === null || instanceRecord === void 0 ? void 0 : instanceRecord.pid }), (0, jsx_runtime_1.jsx)(DescriptionListEntry_1.default, { label: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [t('Instance_Record'), " > ", t('Created_at')] }), children: formatDateAndTime(instanceRecord === null || instanceRecord === void 0 ? void 0 : instanceRecord._createdAt) }), (0, jsx_runtime_1.jsx)(DescriptionListEntry_1.default, { label: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [t('Instance_Record'), " > ", t('Updated_at')] }), children: formatDateAndTime(instanceRecord === null || instanceRecord === void 0 ? void 0 : instanceRecord._updatedAt) })] }) }, address))) }) }));
};
exports.default = InstancesModal;
