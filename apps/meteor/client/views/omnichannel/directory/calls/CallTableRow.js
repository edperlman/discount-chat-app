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
exports.CallTableRow = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const moment_1 = __importDefault(require("moment"));
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericTable_1 = require("../../../../components/GenericTable");
const CallContext_1 = require("../../../../contexts/CallContext");
const parseOutboundPhoneNumber_1 = require("../../../../lib/voip/parseOutboundPhoneNumber");
const CallDialpadButton_1 = require("../components/CallDialpadButton");
const CallTableRow = ({ room, onRowClick }) => {
    var _a;
    const { t } = (0, react_i18next_1.useTranslation)();
    const isCallReady = (0, CallContext_1.useIsCallReady)();
    const { _id, fname, callStarted, queue, callDuration = 0, v, direction } = room;
    const duration = moment_1.default.duration(callDuration / 1000, 'seconds');
    const phoneNumber = Array.isArray(v === null || v === void 0 ? void 0 : v.phone) ? (_a = v === null || v === void 0 ? void 0 : v.phone[0]) === null || _a === void 0 ? void 0 : _a.phoneNumber : v === null || v === void 0 ? void 0 : v.phone;
    const resolveDirectionLabel = (0, react_1.useCallback)((direction) => {
        const labels = {
            inbound: 'Incoming',
            outbound: 'Outgoing',
        };
        return t(labels[direction] || 'Not_Available');
    }, [t]);
    return ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableRow, { "rcx-show-call-button-on-hover": true, tabIndex: 0, role: 'link', onClick: () => onRowClick(_id, v === null || v === void 0 ? void 0 : v.token), action: true, "qa-user-id": _id, height: '40px', children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: (0, parseOutboundPhoneNumber_1.parseOutboundPhoneNumber)(fname) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: (0, parseOutboundPhoneNumber_1.parseOutboundPhoneNumber)(phoneNumber) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: queue }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: (0, moment_1.default)(callStarted).format('L LTS') }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: duration.isValid() && duration.humanize() }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: resolveDirectionLabel(direction) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { children: isCallReady && (0, jsx_runtime_1.jsx)(CallDialpadButton_1.CallDialpadButton, { phoneNumber: phoneNumber }) })] }, _id));
};
exports.CallTableRow = CallTableRow;
