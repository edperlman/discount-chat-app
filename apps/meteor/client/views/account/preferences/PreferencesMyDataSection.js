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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const MyDataModal_1 = __importDefault(require("./MyDataModal"));
const PreferencesMyDataSection = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const requestDataDownload = (0, ui_contexts_1.useMethod)('requestDataDownload');
    const downloadData = (0, react_1.useCallback)((fullExport) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield requestDataDownload({ fullExport });
            if (result.requested) {
                const text = t('UserDataDownload_Requested_Text', {
                    pending_operations: result.pendingOperationsBeforeMyRequest,
                });
                setModal((0, jsx_runtime_1.jsx)(MyDataModal_1.default, { title: t('UserDataDownload_Requested'), text: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { dangerouslySetInnerHTML: { __html: text } }), onCancel: () => setModal(null) }));
                return;
            }
            if (result.exportOperation) {
                if (result.exportOperation.status === 'completed') {
                    const text = result.url
                        ? t('UserDataDownload_CompletedRequestExistedWithLink_Text', {
                            download_link: result.url,
                        })
                        : t('UserDataDownload_CompletedRequestExisted_Text');
                    setModal((0, jsx_runtime_1.jsx)(MyDataModal_1.default, { title: t('UserDataDownload_Requested'), text: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { dangerouslySetInnerHTML: { __html: text } }), onCancel: () => setModal(null) }));
                    return;
                }
                const text = t('UserDataDownload_RequestExisted_Text', {
                    pending_operations: result.pendingOperationsBeforeMyRequest,
                });
                setModal((0, jsx_runtime_1.jsx)(MyDataModal_1.default, { title: t('UserDataDownload_Requested'), text: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { dangerouslySetInnerHTML: { __html: text } }), onCancel: () => setModal(null) }));
                return;
            }
            setModal((0, jsx_runtime_1.jsx)(MyDataModal_1.default, { title: t('UserDataDownload_Requested'), onCancel: () => setModal(null) }));
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }), [dispatchToastMessage, requestDataDownload, setModal, t]);
    const handleClickDownload = (0, react_1.useCallback)(() => downloadData(false), [downloadData]);
    const handleClickExport = (0, react_1.useCallback)(() => downloadData(true), [downloadData]);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Accordion.Item, { title: t('My Data'), children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { stretch: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: 'download', onClick: handleClickDownload, children: t('Download_My_Data') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: 'download', onClick: handleClickExport, children: t('Export_My_Data') })] }) }));
};
exports.default = PreferencesMyDataSection;
