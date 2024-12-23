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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const Call_1 = __importDefault(require("./calls/Call"));
const VoipInfo_1 = require("./calls/contextualBar/VoipInfo");
const FormSkeleton_1 = require("./components/FormSkeleton");
const Contextualbar_1 = require("../../../components/Contextualbar");
const useAsyncState_1 = require("../../../hooks/useAsyncState");
const useEndpointData_1 = require("../../../hooks/useEndpointData");
const CallsContextualBarDirectory = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const id = (0, ui_contexts_1.useRouteParameter)('id');
    const token = (0, ui_contexts_1.useSearchParameter)('token');
    const context = (0, ui_contexts_1.useRouteParameter)('context');
    const directoryRoute = (0, ui_contexts_1.useRoute)('omnichannel-directory');
    const handleClose = () => {
        directoryRoute.push({ tab: 'calls' });
    };
    const query = (0, react_1.useMemo)(() => ({
        rid: id || '',
        token: token || '',
    }), [id, token]);
    const { value: data, phase: state, error } = (0, useEndpointData_1.useEndpointData)(`/v1/voip/room`, { params: query });
    if (context === 'view' && id) {
        return (0, jsx_runtime_1.jsx)(Call_1.default, { rid: id });
    }
    if (state === useAsyncState_1.AsyncStatePhase.LOADING) {
        return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { pi: 24, children: (0, jsx_runtime_1.jsx)(FormSkeleton_1.FormSkeleton, {}) }));
    }
    if (error || !data || !data.room) {
        return (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbs: 16, children: t('Room_not_found') });
    }
    const room = data.room; // TODO Check why types are incompatible even though the endpoint returns an IVoipRooms
    return (0, jsx_runtime_1.jsx)(Contextualbar_1.Contextualbar, { children: context === 'info' && (0, jsx_runtime_1.jsx)(VoipInfo_1.VoipInfo, { room: room, onClickClose: handleClose }) });
};
exports.default = CallsContextualBarDirectory;
