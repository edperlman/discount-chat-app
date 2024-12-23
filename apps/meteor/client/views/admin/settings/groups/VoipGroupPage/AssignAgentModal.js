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
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const AutoCompleteAgentWithoutExtension_1 = __importDefault(require("../../../../../components/AutoCompleteAgentWithoutExtension"));
const useAsyncState_1 = require("../../../../../hooks/useAsyncState");
const useEndpointData_1 = require("../../../../../hooks/useEndpointData");
const AssignAgentModal = ({ existingExtension, closeModal, reload }) => {
    var _a;
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const [agent, setAgent] = (0, react_1.useState)('');
    const [extension, setExtension] = (0, react_1.useState)(existingExtension || '');
    const query = (0, react_1.useMemo)(() => ({ type: 'available', userId: agent }), [agent]);
    const assignAgent = (0, ui_contexts_1.useEndpoint)('POST', '/v1/omnichannel/agent/extension');
    const handleAssignment = (0, fuselage_hooks_1.useMutableCallback)((e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        try {
            yield assignAgent({ username: agent, extension });
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
        reload();
        closeModal();
    }));
    const handleAgentChange = (0, fuselage_hooks_1.useMutableCallback)((e) => setAgent(e));
    const { value: availableExtensions, phase: state } = (0, useEndpointData_1.useEndpointData)('/v1/omnichannel/extension', { params: query });
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal, { wrapperFunction: (props) => (0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ is: 'form', onSubmit: handleAssignment }, props)), children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { children: t('Associate_Agent_to_Extension') }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { onClick: closeModal })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Content, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Agent_Without_Extensions') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(AutoCompleteAgentWithoutExtension_1.default, { value: agent, onChange: handleAgentChange, currentExtension: extension }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Available_extensions') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Select, { disabled: state === useAsyncState_1.AsyncStatePhase.LOADING || agent === '', options: ((_a = availableExtensions === null || availableExtensions === void 0 ? void 0 : availableExtensions.extensions) === null || _a === void 0 ? void 0 : _a.map((extension) => [extension, extension])) || [], value: extension, placeholder: t('Select_an_option'), onChange: (value) => setExtension(String(value)) }) })] })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Footer, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.FooterControllers, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: closeModal, children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, disabled: !agent || !extension, type: 'submit', children: t('Associate') })] }) })] }));
};
exports.default = AssignAgentModal;
