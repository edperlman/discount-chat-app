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
const jsx_runtime_1 = require("react/jsx-runtime");
const emitter_1 = require("@rocket.chat/emitter");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const client_1 = require("../../../../../../app/utils/client");
const download_1 = require("../../../../../lib/download");
const RoomContext_1 = require("../../../contexts/RoomContext");
const useMessageDeletionIsAllowed_1 = require("../hooks/useMessageDeletionIsAllowed");
const ee = new emitter_1.Emitter();
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'attachment-download-result') {
            const { result } = event.data;
            ee.emit(event.data.id, { result, id: event.data.id });
        }
    });
}
const FileItemMenu = ({ fileData, onClickDelete }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const room = (0, RoomContext_1.useRoom)();
    const userId = (0, ui_contexts_1.useUserId)();
    const isDeletionAllowed = (0, useMessageDeletionIsAllowed_1.useMessageDeletionIsAllowed)(room._id, fileData, userId);
    const canDownloadFile = !fileData.encryption || 'serviceWorker' in navigator;
    const { controller } = (navigator === null || navigator === void 0 ? void 0 : navigator.serviceWorker) || {};
    const uid = (0, fuselage_hooks_1.useUniqueId)();
    (0, react_1.useEffect)(() => ee.once(uid, ({ result }) => {
        var _a;
        (0, download_1.downloadAs)({ data: [new Blob([result])] }, (_a = fileData.name) !== null && _a !== void 0 ? _a : t('Download'));
    }), [fileData, t, uid]);
    const menuOptions = Object.assign({ downLoad: {
            label: ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { mie: 4, name: 'download', size: 'x16' }), t('Download')] })),
            action: () => {
                var _a, _b;
                if ((_a = fileData.path) === null || _a === void 0 ? void 0 : _a.includes('/file-decrypt/')) {
                    if (!controller) {
                        return;
                    }
                    controller === null || controller === void 0 ? void 0 : controller.postMessage({
                        type: 'attachment-download',
                        url: fileData.path,
                        id: uid,
                    });
                    return;
                }
                if (fileData.url && fileData.name) {
                    const URL = (_b = window.webkitURL) !== null && _b !== void 0 ? _b : window.URL;
                    const href = (0, client_1.getURL)(fileData.url);
                    (0, download_1.download)(href, fileData.name);
                    URL.revokeObjectURL(fileData.url);
                }
            },
            disabled: !canDownloadFile,
        } }, (isDeletionAllowed &&
        onClickDelete && {
        delete: {
            label: ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', color: 'status-font-on-danger', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { mie: 4, name: 'trash', size: 'x16' }), t('Delete')] })),
            action: () => onClickDelete(fileData._id),
        },
    }));
    return (0, jsx_runtime_1.jsx)(fuselage_1.Menu, { options: menuOptions });
};
exports.default = (0, react_1.memo)(FileItemMenu);
