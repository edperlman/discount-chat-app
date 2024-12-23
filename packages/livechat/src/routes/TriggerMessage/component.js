"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const preact_1 = require("preact");
const react_i18next_1 = require("react-i18next");
const Screen_1 = __importDefault(require("../../components/Screen"));
const createClassName_1 = require("../../helpers/createClassName");
const parentCall_1 = require("../../lib/parentCall");
const styles_scss_1 = __importDefault(require("./styles.scss"));
class TriggerMessage extends preact_1.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.render = ({ title, messages, onStartChat = () => undefined, t }) => {
            const defaultTitle = t('messages');
            const { theme: { color } = {} } = this.props;
            return ((0, jsx_runtime_1.jsxs)(Screen_1.default, { title: title || defaultTitle, triggered: true, ref: this.ref, children: [(0, jsx_runtime_1.jsx)(Screen_1.default.Content, { triggered: true, children: messages === null || messages === void 0 ? void 0 : messages.map((message) => message.msg && (0, jsx_runtime_1.jsx)("p", { className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'trigger-message__message'), children: message.msg })) }), (0, jsx_runtime_1.jsxs)("footer", { className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'trigger-message__footer'), children: [(0, jsx_runtime_1.jsx)("hr", { className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'trigger-message__separator') }), (0, jsx_runtime_1.jsx)("button", { style: color && { color }, onClick: onStartChat, className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'trigger-message__link-reply'), children: t('start_chat') })] })] }));
        };
        this.ref = (0, preact_1.createRef)();
    }
    componentDidUpdate() {
        let height = 0;
        for (const el of this.ref.current.base.children) {
            height += el.scrollHeight;
        }
        (0, parentCall_1.parentCall)('resizeWidget', height);
    }
}
exports.default = (0, react_i18next_1.withTranslation)()(TriggerMessage);
