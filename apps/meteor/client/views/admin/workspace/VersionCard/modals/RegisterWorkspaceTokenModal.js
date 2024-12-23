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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const RegisterWorkspaceModal_1 = __importDefault(require("./RegisterWorkspaceModal"));
const RegisterWorkspaceTokenModal = (_a) => {
    var { onClose, onStatusChange } = _a, props = __rest(_a, ["onClose", "onStatusChange"]);
    const setModal = (0, ui_contexts_1.useSetModal)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const connectWorkspace = (0, ui_contexts_1.useMethod)('cloud:connectWorkspace');
    const [token, setToken] = (0, react_1.useState)('');
    const [processing, setProcessing] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(false);
    const handleBackAction = () => {
        const handleModalClose = () => setModal(null);
        setModal((0, jsx_runtime_1.jsx)(RegisterWorkspaceModal_1.default, { onClose: handleModalClose }));
    };
    const handleTokenChange = (event) => {
        setToken(event.target.value);
    };
    const isToken = token.length > 0;
    const handleConnectButtonClick = () => __awaiter(void 0, void 0, void 0, function* () {
        setProcessing(true);
        setError(false);
        try {
            const isConnected = yield connectWorkspace(token);
            if (!isConnected) {
                throw Error(t('RegisterWorkspace_Connection_Error'));
            }
            setModal(null);
            dispatchToastMessage({ type: 'success', message: t('Connected') });
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
            setError(true);
        }
        finally {
            yield (onStatusChange === null || onStatusChange === void 0 ? void 0 : onStatusChange());
            setProcessing(false);
        }
    });
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal, Object.assign({}, props, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.HeaderText, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { children: t('RegisterWorkspace_Token_Title') }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { onClick: onClose })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Content, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'p', children: (0, jsx_runtime_1.jsxs)(react_i18next_1.Trans, { i18nKey: 'RegisterWorkspace_Token_Step_One', children: ["1. Go to:", ' ', (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'span', fontWeight: 600, children: ["cloud.rocket.chat ", '>', " Workspaces"] }), ' ', "and click", ' ', (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', fontWeight: 600, children: "\"Register self-managed\"" }), "."] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'p', fontSize: 'p2', children: `2. ${t('RegisterWorkspace_Token_Step_Two')}` }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { pbs: 10, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Registration_Token') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { onChange: handleTokenChange, value: token }) }), error && (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: t('Token_Not_Recognized') })] })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Footer, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { align: 'end', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: handleBackAction, children: t('Back') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, disabled: !isToken, loading: processing, onClick: handleConnectButtonClick, children: t('Next') })] }) })] })));
};
exports.default = RegisterWorkspaceTokenModal;
