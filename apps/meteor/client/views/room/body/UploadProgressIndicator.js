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
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const ErroredUploadProgressIndicator_1 = __importDefault(require("./ErroredUploadProgressIndicator"));
const UploadProgressIndicator = ({ id, name, percentage, error, onClose }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const handleCloseClick = (0, react_1.useCallback)(() => {
        onClose === null || onClose === void 0 ? void 0 : onClose(id);
    }, [id, onClose]);
    if (error) {
        return (0, jsx_runtime_1.jsx)(ErroredUploadProgressIndicator_1.default, { id: id, error: error, onClose: onClose });
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: 'upload-progress color-primary-action-color background-component-color', children: [(0, jsx_runtime_1.jsx)("div", { className: 'upload-progress-progress', style: { width: `${percentage}%` } }), (0, jsx_runtime_1.jsxs)("div", { className: 'upload-progress-text', children: ["[", percentage, "%] ", name] }), (0, jsx_runtime_1.jsx)("button", { type: 'button', className: 'upload-progress-close', onClick: handleCloseClick, children: t('Cancel') })] }));
};
exports.default = UploadProgressIndicator;