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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const useFormatDateAndTime_1 = require("../../../hooks/useFormatDateAndTime");
function DropTargetOverlay({ enabled, reason, onFileDrop, visible = true, onDismiss }) {
    const { t } = (0, react_i18next_1.useTranslation)();
    const handleDragLeave = (0, fuselage_hooks_1.useMutableCallback)((event) => {
        event.stopPropagation();
        onDismiss === null || onDismiss === void 0 ? void 0 : onDismiss();
    });
    const handleDragOver = (0, fuselage_hooks_1.useMutableCallback)((event) => {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = ['move', 'linkMove'].includes(event.dataTransfer.effectAllowed) ? 'move' : 'copy';
    });
    const formatDateAndTime = (0, useFormatDateAndTime_1.useFormatDateAndTime)();
    const handleDrop = (0, fuselage_hooks_1.useMutableCallback)((event) => __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        event.stopPropagation();
        onDismiss === null || onDismiss === void 0 ? void 0 : onDismiss();
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files);
        if (event.dataTransfer.types.includes('text/uri-list') && event.dataTransfer.types.includes('text/html')) {
            const fragment = document.createRange().createContextualFragment(event.dataTransfer.getData('text/html'));
            try {
                for (var _d = true, _e = __asyncValues(Array.from(fragment.querySelectorAll('img'))), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                    _c = _f.value;
                    _d = false;
                    const { src } = _c;
                    try {
                        const response = yield fetch(src);
                        const data = yield response.blob();
                        const extension = (yield Promise.resolve().then(() => __importStar(require('../../../../app/utils/lib/mimeTypes')))).mime.extension(data.type);
                        const filename = `File - ${formatDateAndTime(new Date())}.${extension}`;
                        const file = new File([data], filename, { type: data.type });
                        files.push(file);
                    }
                    catch (error) {
                        console.warn(error);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        onFileDrop === null || onFileDrop === void 0 ? void 0 : onFileDrop(files);
    }));
    if (!visible) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { role: 'dialog', "data-qa": 'DropTargetOverlay', position: 'absolute', zIndex: 1000000, inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontScale: 'hero', textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderWidth: 4, borderStyle: 'dashed', borderColor: 'currentColor', color: enabled ? 'primary' : 'danger', className: (0, css_in_js_1.css) `
				animation-name: zoom-in;
				animation-duration: 0.1s;
			`, onDragLeave: handleDragLeave, onDragOver: handleDragOver, onDrop: handleDrop, children: enabled ? t('Drop_to_upload_file') : reason }));
}
exports.default = (0, react_1.memo)(DropTargetOverlay);
