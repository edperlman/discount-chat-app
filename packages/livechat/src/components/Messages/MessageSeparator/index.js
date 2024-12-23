"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const compat_1 = require("preact/compat");
const react_i18next_1 = require("react-i18next");
const createClassName_1 = require("../../../helpers/createClassName");
const styles_scss_1 = __importDefault(require("./styles.scss"));
// TODO: find a better way to pass `use` and do not default to a string
// eslint-disable-next-line @typescript-eslint/naming-convention
const MessageSeparator = ({ date, unread, use: Element = 'div', className, style = {}, t }) => ((0, jsx_runtime_1.jsxs)(Element, { className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'separator', {
        date: !!date && !unread,
        unread: !date && !!unread,
    }, [className]), style: style, children: [(0, jsx_runtime_1.jsx)("hr", { className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'separator__line') }), (date || unread) && ((0, jsx_runtime_1.jsx)("span", { className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'separator__text'), children: (!!date &&
                t('message_separator_date', {
                    val: new Date(date),
                    formatParams: {
                        val: { month: 'short', day: '2-digit', year: 'numeric' },
                    },
                }).toUpperCase()) ||
                (unread && t('unread_messages')) })), (0, jsx_runtime_1.jsx)("hr", { className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'separator__line') })] }));
exports.default = (0, react_i18next_1.withTranslation)()((0, compat_1.memo)(MessageSeparator));
