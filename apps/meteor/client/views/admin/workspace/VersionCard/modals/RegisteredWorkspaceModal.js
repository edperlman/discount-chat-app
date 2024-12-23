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
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const useFeatureBullets_1 = __importDefault(require("../hooks/useFeatureBullets"));
const RegisteredWorkspaceModal = (_a) => {
    var { onClose, onStatusChange } = _a, props = __rest(_a, ["onClose", "onStatusChange"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const bulletFeatures = (0, useFeatureBullets_1.default)();
    const [isSyncing, setSyncing] = (0, fuselage_hooks_1.useSafely)((0, react_1.useState)(false));
    const syncWorkspace = (0, ui_contexts_1.useMethod)('cloud:syncWorkspace');
    const handleSyncAction = () => __awaiter(void 0, void 0, void 0, function* () {
        setSyncing(true);
        try {
            const isSynced = yield syncWorkspace();
            if (!isSynced) {
                throw Error(t('RegisterWorkspace_Syncing_Error'));
            }
            dispatchToastMessage({ type: 'success', message: t('RegisterWorkspace_Syncing_Complete') });
            setModal(null);
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
        finally {
            onStatusChange === null || onStatusChange === void 0 ? void 0 : onStatusChange();
            setSyncing(false);
        }
    });
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal, Object.assign({}, props, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.HeaderText, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { children: t('Workspace_registered') }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { onClick: onClose })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Content, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { withRichContent: true, children: [(0, jsx_runtime_1.jsx)("span", { children: `${t('RegisterWorkspace_Registered_Subtitle')}: ` }), (0, jsx_runtime_1.jsx)("ul", { children: bulletFeatures.map((item, index) => ((0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("strong", { children: item.title }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'p', mbs: 4, children: item.description })] }, index))) })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Footer, { children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { align: 'end', children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: 'reload', onClick: handleSyncAction, loading: isSyncing, children: t('Sync') }) }) })] })));
};
exports.default = RegisteredWorkspaceModal;
