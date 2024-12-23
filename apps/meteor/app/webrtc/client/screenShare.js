"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChromeScreenShare = void 0;
const fireGlobalEvent_1 = require("../../../client/lib/utils/fireGlobalEvent");
exports.ChromeScreenShare = {
    callbacks: {
        'get-RocketChatScreenSharingExtensionVersion': (version) => {
            if (version) {
                exports.ChromeScreenShare.installed = true;
            }
        },
        'getSourceId': (_sourceId) => undefined,
    },
    installed: false,
    init() {
        window.postMessage('get-RocketChatScreenSharingExtensionVersion', '*');
    },
    getSourceId(navigator, callback) {
        if (!callback) {
            throw new Error('"callback" parameter is mandatory.');
        }
        this.callbacks.getSourceId = callback;
        if (navigator === 'electron') {
            return (0, fireGlobalEvent_1.fireGlobalEvent)('get-sourceId', '*');
        }
        return window.postMessage('get-sourceId', '*');
    },
};
exports.ChromeScreenShare.init();
window.addEventListener('message', (e) => {
    var _a, _b;
    if (e.origin !== window.location.origin) {
        return;
    }
    if (e.data === 'PermissionDeniedError') {
        if (exports.ChromeScreenShare.callbacks.getSourceId != null) {
            return exports.ChromeScreenShare.callbacks.getSourceId('PermissionDeniedError');
        }
        throw new Error('PermissionDeniedError');
    }
    if (e.data.version != null) {
        (_b = (_a = exports.ChromeScreenShare.callbacks)['get-RocketChatScreenSharingExtensionVersion']) === null || _b === void 0 ? void 0 : _b.call(_a, e.data.version);
    }
    else if (e.data.sourceId != null) {
        return typeof exports.ChromeScreenShare.callbacks.getSourceId === 'function' && exports.ChromeScreenShare.callbacks.getSourceId(e.data.sourceId);
    }
});
