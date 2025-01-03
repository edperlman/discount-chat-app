"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const AttachmentDownloadBase_1 = __importDefault(require("./AttachmentDownloadBase"));
const useDownloadFromServiceWorker_1 = require("../../../../../hooks/useDownloadFromServiceWorker");
const AttachmentEncryptedDownload = (_a) => {
    var { title, href } = _a, props = __rest(_a, ["title", "href"]);
    const encryptedAnchorProps = (0, useDownloadFromServiceWorker_1.useDownloadFromServiceWorker)(href, title);
    return (0, jsx_runtime_1.jsx)(AttachmentDownloadBase_1.default, Object.assign({}, props, encryptedAnchorProps, { title: title, href: href }));
};
exports.default = AttachmentEncryptedDownload;