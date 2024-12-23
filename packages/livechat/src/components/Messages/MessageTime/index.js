"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fp_1 = require("date-fns/fp");
const isToday_1 = __importDefault(require("date-fns/isToday"));
const compat_1 = require("preact/compat");
const react_i18next_1 = require("react-i18next");
const createClassName_1 = require("../../../helpers/createClassName");
const styles_scss_1 = __importDefault(require("./styles.scss"));
const parseDate = (ts, t) => {
    const timestamp = new Date(ts).toISOString();
    return t('message_time', {
        val: new Date(timestamp),
        formatParams: {
            val: (0, isToday_1.default)((0, fp_1.parseISO)(timestamp)) ? { hour: 'numeric', minute: 'numeric' } : { day: 'numeric', hour: 'numeric', minute: 'numeric' },
        },
    });
};
const MessageTime = ({ ts, normal, inverted, className, style = {}, t }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'message-time-wrapper'), children: (0, jsx_runtime_1.jsx)("time", { dateTime: new Date(ts).toISOString(), className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'message-time', { normal, inverted }, [className]), style: style, children: parseDate(ts, t) }) }));
};
exports.default = (0, react_i18next_1.withTranslation)()((0, compat_1.memo)(MessageTime));
