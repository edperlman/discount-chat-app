"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDownloadFromServiceWorker = exports.forAttachmentDownload = exports.registerDownloadForUid = void 0;
const emitter_1 = require("@rocket.chat/emitter");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const download_1 = require("../lib/download");
const ee = new emitter_1.Emitter();
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'attachment-download-result') {
            const { result } = event.data;
            ee.emit(event.data.id, { result, id: event.data.id });
        }
    });
}
const registerDownloadForUid = (uid, t, title) => {
    ee.once(uid, ({ result }) => {
        (0, download_1.downloadAs)({ data: [new Blob([result])] }, title !== null && title !== void 0 ? title : t('Download'));
    });
};
exports.registerDownloadForUid = registerDownloadForUid;
const forAttachmentDownload = (uid, href, controller) => {
    var _a;
    if (!controller) {
        controller = (_a = navigator === null || navigator === void 0 ? void 0 : navigator.serviceWorker) === null || _a === void 0 ? void 0 : _a.controller;
    }
    if (!controller) {
        return;
    }
    controller === null || controller === void 0 ? void 0 : controller.postMessage({
        type: 'attachment-download',
        url: href,
        id: uid,
    });
};
exports.forAttachmentDownload = forAttachmentDownload;
const useDownloadFromServiceWorker = (href, title) => {
    const { controller } = (navigator === null || navigator === void 0 ? void 0 : navigator.serviceWorker) || {};
    const uid = (0, fuselage_hooks_1.useUniqueId)();
    const { t } = (0, react_i18next_1.useTranslation)();
    (0, react_1.useEffect)(() => (0, exports.registerDownloadForUid)(uid, t, title), [title, t, uid]);
    return {
        disabled: !controller,
        onContextMenu: (0, react_1.useCallback)((e) => e.preventDefault(), []),
        onClick: (0, react_1.useCallback)((e) => {
            e.preventDefault();
            (0, exports.forAttachmentDownload)(uid, href, controller);
        }, [href, uid, controller]),
    };
};
exports.useDownloadFromServiceWorker = useDownloadFromServiceWorker;
