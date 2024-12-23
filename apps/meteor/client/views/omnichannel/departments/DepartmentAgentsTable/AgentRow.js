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
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericTable_1 = require("../../../../components/GenericTable");
const AgentAvatar_1 = __importDefault(require("./AgentAvatar"));
const RemoveAgentButton_1 = __importDefault(require("./RemoveAgentButton"));
const AgentRow = ({ index, agent, register, onRemove }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableRow, { tabIndex: 0, role: 'link', action: true, "qa-user-id": agent.agentId, children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: (0, jsx_runtime_1.jsx)(AgentAvatar_1.default, { name: agent.name || '', username: agent.username || '' }) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { fontScale: 'p2', color: 'hint', withTruncatedText: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.NumberInput, Object.assign({ title: t('Count'), maxWidth: '100%' }, register(`agentList.${index}.count`, { valueAsNumber: true }))) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { fontScale: 'p2', color: 'hint', withTruncatedText: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.NumberInput, Object.assign({ title: t('Order'), maxWidth: '100%' }, register(`agentList.${index}.order`, { valueAsNumber: true }))) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { fontScale: 'p2', color: 'hint', children: (0, jsx_runtime_1.jsx)(RemoveAgentButton_1.default, { agentId: agent.agentId, onRemove: onRemove }) })] }, agent.agentId));
};
exports.default = (0, react_1.memo)(AgentRow);
