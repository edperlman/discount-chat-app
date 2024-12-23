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
exports.useOpenIncompatibleModal = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const IframeModal_1 = __importDefault(require("../IframeModal"));
const useAppsOrchestration_1 = require("./useAppsOrchestration");
const handleAPIError_1 = require("../helpers/handleAPIError");
const useOpenIncompatibleModal = () => {
    const setModal = (0, ui_contexts_1.useSetModal)();
    const appsOrchestrator = (0, useAppsOrchestration_1.useAppsOrchestration)();
    if (!appsOrchestrator) {
        throw new Error('Apps orchestrator is not available');
    }
    return (0, react_1.useCallback)((app, actionName, cancelAction) => __awaiter(void 0, void 0, void 0, function* () {
        const handleCancel = () => {
            setModal(null);
            cancelAction();
        };
        const handleConfirm = () => {
            setModal(null);
            cancelAction();
        };
        try {
            const incompatibleData = yield appsOrchestrator.buildIncompatibleExternalUrl(app.id, app.marketplaceVersion, actionName);
            setModal((0, jsx_runtime_1.jsx)(IframeModal_1.default, { url: incompatibleData.url, cancel: handleCancel, confirm: handleConfirm }));
        }
        catch (e) {
            (0, handleAPIError_1.handleAPIError)(e);
        }
    }), [appsOrchestrator, setModal]);
};
exports.useOpenIncompatibleModal = useOpenIncompatibleModal;
