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
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importStar(require("react"));
const useRecordList_1 = require("../hooks/lists/useRecordList");
const asyncState_1 = require("../lib/asyncState");
const useAgentsList_1 = require("./Omnichannel/hooks/useAgentsList");
const AutoCompleteAgent = ({ value, error, placeholder, haveAll = false, haveNoAgentsSelectedOption = false, excludeId, showIdleAgents = true, onlyAvailable = false, withTitle = false, onChange, }) => {
    const [agentsFilter, setAgentsFilter] = (0, react_1.useState)('');
    const debouncedAgentsFilter = (0, fuselage_hooks_1.useDebouncedValue)(agentsFilter, 500);
    const { itemsList: AgentsList, loadMoreItems: loadMoreAgents } = (0, useAgentsList_1.useAgentsList)((0, react_1.useMemo)(() => ({ text: debouncedAgentsFilter, onlyAvailable, haveAll, haveNoAgentsSelectedOption, excludeId, showIdleAgents }), [debouncedAgentsFilter, excludeId, haveAll, haveNoAgentsSelectedOption, onlyAvailable, showIdleAgents]));
    const { phase: agentsPhase, itemCount: agentsTotal, items: agentsItems } = (0, useRecordList_1.useRecordList)(AgentsList);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.PaginatedSelectFiltered, { withTitle: withTitle, value: value, error: error, placeholder: placeholder, onChange: onChange, flexShrink: 0, filter: agentsFilter, setFilter: setAgentsFilter, options: agentsItems, "data-qa": 'autocomplete-agent', endReached: agentsPhase === asyncState_1.AsyncStatePhase.LOADING ? () => undefined : (start) => loadMoreAgents(start, Math.min(50, agentsTotal)) }));
};
exports.default = (0, react_1.memo)(AutoCompleteAgent);
