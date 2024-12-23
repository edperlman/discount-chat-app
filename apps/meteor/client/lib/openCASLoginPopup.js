"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openCASLoginPopup = void 0;
const meteor_1 = require("meteor/meteor");
const client_1 = require("../../app/settings/client");
const openCenteredPopup = (url, width, height) => {
    var _a, _b, _c, _d;
    const screenX = (_a = window.screenX) !== null && _a !== void 0 ? _a : window.screenLeft;
    const screenY = (_b = window.screenY) !== null && _b !== void 0 ? _b : window.screenTop;
    const outerWidth = (_c = window.outerWidth) !== null && _c !== void 0 ? _c : document.body.clientWidth;
    const outerHeight = (_d = window.outerHeight) !== null && _d !== void 0 ? _d : document.body.clientHeight - 22;
    // XXX what is the 22? Probably the height of the title bar.
    // Use `outerWidth - width` and `outerHeight - height` for help in
    // positioning the popup centered relative to the current window
    const left = screenX + (outerWidth - width) / 2;
    const top = screenY + (outerHeight - height) / 2;
    const features = `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`;
    const newwindow = window.open(url, 'Login', features);
    if (!newwindow) {
        throw new Error('Could not open popup');
    }
    newwindow.focus();
    return newwindow;
};
const getPopupUrl = (credentialToken) => {
    const loginUrl = client_1.settings.get('CAS_login_url');
    if (!loginUrl) {
        throw new Error('CAS_login_url not set');
    }
    const appUrl = meteor_1.Meteor.absoluteUrl().replace(/\/$/, '') + __meteor_runtime_config__.ROOT_URL_PATH_PREFIX;
    const serviceUrl = `${appUrl}/_cas/${credentialToken}`;
    const url = new URL(loginUrl);
    url.searchParams.set('service', serviceUrl);
    return url.href;
};
const waitForPopupClose = (popup) => {
    return new Promise((resolve) => {
        const checkPopupOpen = setInterval(() => {
            if (popup.closed || popup.closed === undefined) {
                clearInterval(checkPopupOpen);
                resolve();
            }
        }, 100);
    });
};
const openCASLoginPopup = (credentialToken) => __awaiter(void 0, void 0, void 0, function* () {
    const popupWidth = client_1.settings.get('CAS_popup_width') || 800;
    const popupHeight = client_1.settings.get('CAS_popup_height') || 600;
    const popupUrl = getPopupUrl(credentialToken);
    const popup = openCenteredPopup(popupUrl, popupWidth, popupHeight);
    yield waitForPopupClose(popup);
});
exports.openCASLoginPopup = openCASLoginPopup;
