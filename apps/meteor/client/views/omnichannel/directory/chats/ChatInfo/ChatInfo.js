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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const meteor_1 = require("meteor/meteor");
const moment_1 = __importDefault(require("moment"));
const react_1 = __importStar(require("react"));
const DepartmentField_1 = __importDefault(require("./DepartmentField"));
const VisitorClientInfo_1 = __importDefault(require("./VisitorClientInfo"));
const Contextualbar_1 = require("../../../../../components/Contextualbar");
const InfoPanel_1 = require("../../../../../components/InfoPanel");
const MarkdownText_1 = __importDefault(require("../../../../../components/MarkdownText"));
const useEndpointData_1 = require("../../../../../hooks/useEndpointData");
const useFormatDateAndTime_1 = require("../../../../../hooks/useFormatDateAndTime");
const useFormatDuration_1 = require("../../../../../hooks/useFormatDuration");
const CustomField_1 = __importDefault(require("../../../components/CustomField"));
const components_1 = require("../../components");
const PriorityField_1 = __importDefault(require("../../components/PriorityField"));
const useOmnichannelRoomInfo_1 = require("../../hooks/useOmnichannelRoomInfo");
const formatQueuedAt_1 = require("../../utils/formatQueuedAt");
// TODO: Remove moment we are mixing moment and our own formatters :sadface:
function ChatInfo({ id, route }) {
    var _a;
    const t = (0, ui_contexts_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const formatDateAndTime = (0, useFormatDateAndTime_1.useFormatDateAndTime)();
    const { value: allCustomFields, phase: stateCustomFields } = (0, useEndpointData_1.useEndpointData)('/v1/livechat/custom-fields');
    const [customFields, setCustomFields] = (0, react_1.useState)([]);
    const formatDuration = (0, useFormatDuration_1.useFormatDuration)();
    const { data: room } = (0, useOmnichannelRoomInfo_1.useOmnichannelRoomInfo)(id); // FIXME: `room` is serialized, but we need to deserialize it
    const { ts, tags, closedAt, departmentId, v, servedBy, metrics, topic, waitingResponse, responseBy, slaId, priorityId, livechatData, source, queuedAt, } = room || { v: {} };
    const routePath = (0, ui_contexts_1.useRoute)(route || 'omnichannel-directory');
    const canViewCustomFields = (0, ui_contexts_1.usePermission)('view-livechat-room-customfields');
    const subscription = (0, ui_contexts_1.useUserSubscription)(id);
    const hasGlobalEditRoomPermission = (0, ui_contexts_1.usePermission)('save-others-livechat-room-info');
    const hasLocalEditRoomPermission = (servedBy === null || servedBy === void 0 ? void 0 : servedBy._id) === meteor_1.Meteor.userId();
    const visitorId = v === null || v === void 0 ? void 0 : v._id;
    const queueStartedAt = queuedAt || ts;
    const queueTime = (0, react_1.useMemo)(() => (0, formatQueuedAt_1.formatQueuedAt)(room), [room]);
    (0, react_1.useEffect)(() => {
        if (allCustomFields) {
            const { customFields: customFieldsAPI } = allCustomFields;
            setCustomFields(customFieldsAPI);
        }
    }, [allCustomFields, stateCustomFields]);
    const checkIsVisibleAndScopeRoom = (key) => {
        const field = customFields.find(({ _id }) => _id === key);
        return (field === null || field === void 0 ? void 0 : field.visibility) === 'visible' && (field === null || field === void 0 ? void 0 : field.scope) === 'room';
    };
    const onEditClick = (0, fuselage_hooks_1.useMutableCallback)(() => {
        const hasEditAccess = !!subscription || hasLocalEditRoomPermission || hasGlobalEditRoomPermission;
        if (!hasEditAccess) {
            return dispatchToastMessage({ type: 'error', message: t('Not_authorized') });
        }
        routePath.push(route
            ? {
                tab: 'room-info',
                context: 'edit',
                id,
            }
            : {
                page: 'chats',
                id,
                bar: 'edit',
            });
    });
    const customFieldEntries = Object.entries(livechatData || {}).filter(([key]) => checkIsVisibleAndScopeRoom(key) && livechatData[key]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarScrollableContent, { p: 24, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Margins, { block: 'x4', children: [source && (0, jsx_runtime_1.jsx)(components_1.SourceField, { room: room }), room && v && (0, jsx_runtime_1.jsx)(components_1.ContactField, { contact: v, room: room }), visitorId && (0, jsx_runtime_1.jsx)(VisitorClientInfo_1.default, { uid: visitorId }), servedBy && (0, jsx_runtime_1.jsx)(components_1.AgentField, { agent: servedBy }), departmentId && (0, jsx_runtime_1.jsx)(DepartmentField_1.default, { departmentId: departmentId }), tags && tags.length > 0 && ((0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: t('Tags') }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelText, { children: tags.map((tag) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { mie: 4, display: 'inline', children: (0, jsx_runtime_1.jsx)(fuselage_1.Tag, { style: { display: 'inline' }, disabled: true, children: tag }) }, tag))) })] })), topic && ((0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: t('Topic') }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelText, { withTruncatedText: false, children: (0, jsx_runtime_1.jsx)(MarkdownText_1.default, { variant: 'inline', content: topic }) })] })), queueStartedAt && ((0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: t('Queue_Time') }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelText, { children: queueTime })] })), closedAt && ((0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: t('Chat_Duration') }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelText, { children: (0, moment_1.default)(closedAt).from((0, moment_1.default)(ts), true) })] })), ts && ((0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: t('Created_at') }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelText, { children: formatDateAndTime(ts) })] })), closedAt && ((0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: t('Closed_At') }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelText, { children: formatDateAndTime(closedAt) })] })), (servedBy === null || servedBy === void 0 ? void 0 : servedBy.ts) && ((0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: t('Taken_at') }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelText, { children: formatDateAndTime(servedBy.ts) })] })), ((_a = metrics === null || metrics === void 0 ? void 0 : metrics.response) === null || _a === void 0 ? void 0 : _a.avg) && formatDuration(metrics.response.avg) && ((0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: t('Avg_response_time') }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelText, { children: formatDuration(metrics.response.avg) })] })), !waitingResponse && (responseBy === null || responseBy === void 0 ? void 0 : responseBy.lastMessageTs) && ((0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: t('Inactivity_Time') }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelText, { children: (0, moment_1.default)(responseBy.lastMessageTs).fromNow(true) })] })), canViewCustomFields && customFieldEntries.map(([key, value]) => (0, jsx_runtime_1.jsx)(CustomField_1.default, { id: key, value: value }, key)), slaId && (0, jsx_runtime_1.jsx)(components_1.SlaField, { id: slaId }), priorityId && (0, jsx_runtime_1.jsx)(PriorityField_1.default, { id: priorityId })] }) }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarFooter, { children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { stretch: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: 'pencil', onClick: onEditClick, "data-qa-id": 'room-info-edit', children: t('Edit') }) }) })] }));
}
exports.default = ChatInfo;
