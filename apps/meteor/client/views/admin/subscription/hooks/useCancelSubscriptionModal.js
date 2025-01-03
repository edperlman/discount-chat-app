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
exports.useCancelSubscriptionModal = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const useRemoveLicense_1 = require("./useRemoveLicense");
const useLicense_1 = require("../../../../hooks/useLicense");
const CancelSubscriptionModal_1 = require("../components/CancelSubscriptionModal");
const useCancelSubscriptionModal = () => {
    const { data: planName = '' } = (0, useLicense_1.useLicenseName)();
    const removeLicense = (0, useRemoveLicense_1.useRemoveLicense)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const open = (0, react_1.useCallback)(() => {
        const closeModal = () => setModal(null);
        const handleConfirm = () => {
            removeLicense.mutateAsync();
            closeModal();
        };
        setModal((0, jsx_runtime_1.jsx)(CancelSubscriptionModal_1.CancelSubscriptionModal, { planName: planName, onConfirm: handleConfirm, onCancel: closeModal }));
    }, [removeLicense, planName, setModal]);
    return {
        open,
        isLoading: removeLicense.isLoading,
    };
};
exports.useCancelSubscriptionModal = useCancelSubscriptionModal;