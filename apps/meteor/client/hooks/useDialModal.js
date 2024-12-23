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
exports.useDialModal = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const CallContext_1 = require("../contexts/CallContext");
const toast_1 = require("../lib/toast");
const DialPadModal = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../voip/modal/DialPad/DialPadModal'))));
const useDialModal = () => {
    const setModal = (0, ui_contexts_1.useSetModal)();
    const isEnterprise = (0, CallContext_1.useIsVoipEnterprise)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const closeDialModal = (0, react_1.useCallback)(() => setModal(null), [setModal]);
    const openDialModal = (0, react_1.useCallback)(({ initialValue, errorMessage } = {}) => {
        if (!isEnterprise) {
            (0, toast_1.dispatchToastMessage)({ type: 'error', message: t('You_do_not_have_permission_to_do_this') });
            return;
        }
        setModal(
        // TODO: Revisit Modal's FocusScope which currently does not accept null as children.
        // Added dummy div fallback for that reason.
        (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)("div", {}), children: (0, jsx_runtime_1.jsx)(DialPadModal, { initialValue: initialValue, errorMessage: errorMessage, handleClose: closeDialModal }) }));
    }, [setModal, isEnterprise, t, closeDialModal]);
    return (0, react_1.useMemo)(() => ({
        openDialModal,
        closeDialModal,
    }), [openDialModal, closeDialModal]);
};
exports.useDialModal = useDialModal;
