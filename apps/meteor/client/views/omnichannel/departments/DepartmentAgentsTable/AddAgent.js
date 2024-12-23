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
const AutoCompleteAgent_1 = __importDefault(require("../../../../components/AutoCompleteAgent"));
const useEndpointAction_1 = require("../../../../hooks/useEndpointAction");
function AddAgent({ agentList, onAdd }) {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [userId, setUserId] = (0, react_1.useState)('');
    const getAgent = (0, useEndpointAction_1.useEndpointAction)('GET', '/v1/livechat/users/agent/:_id', { keys: { _id: userId } });
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const handleAgent = (0, fuselage_hooks_1.useMutableCallback)((e) => setUserId(e));
    const handleSave = (0, fuselage_hooks_1.useMutableCallback)(() => __awaiter(this, void 0, void 0, function* () {
        if (!userId) {
            return;
        }
        const { user: { _id, username, name }, } = yield getAgent();
        if (!agentList.some(({ agentId }) => agentId === _id)) {
            setUserId('');
            onAdd({ agentId: _id, username: username !== null && username !== void 0 ? username : '', name, count: 0, order: 0 });
        }
        else {
            dispatchToastMessage({ type: 'error', message: t('This_agent_was_already_selected') });
        }
    }));
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(AutoCompleteAgent_1.default, { value: userId, onChange: handleAgent }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { disabled: !userId, onClick: handleSave, mis: 8, primary: true, children: t('Add') })] }));
}
exports.default = AddAgent;
