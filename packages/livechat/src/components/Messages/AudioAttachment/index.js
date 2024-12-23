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
const compat_1 = require("preact/compat");
const react_i18next_1 = require("react-i18next");
const createClassName_1 = require("../../../helpers/createClassName");
const MessageBubble_1 = require("../MessageBubble");
const styles_scss_1 = __importDefault(require("./styles.scss"));
const AudioAttachment = (_a) => {
    var { url, className, t } = _a, messageBubbleProps = __rest(_a, ["url", "className", "t"]);
    return ((0, jsx_runtime_1.jsx)(MessageBubble_1.MessageBubble, Object.assign({ nude: true, className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'audio-attachment', {}, [className]) }, messageBubbleProps, { children: (0, jsx_runtime_1.jsx)("audio", { src: url, controls: true, className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'audio-attachment__inner'), children: t('you_browser_doesn_t_support_audio_element') }) })));
};
exports.default = (0, react_i18next_1.withTranslation)()((0, compat_1.memo)(AudioAttachment));
