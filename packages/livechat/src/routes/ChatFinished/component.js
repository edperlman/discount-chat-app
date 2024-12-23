"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_i18next_1 = require("react-i18next");
const Button_1 = require("../../components/Button");
const ButtonGroup_1 = require("../../components/ButtonGroup");
const Screen_1 = __importDefault(require("../../components/Screen"));
const createClassName_1 = require("../../helpers/createClassName");
const triggers_1 = __importDefault(require("../../lib/triggers"));
const styles_scss_1 = __importDefault(require("./styles.scss"));
const ChatFinished = ({ title, greeting, message, onRedirectChat, t }) => {
    const handleClick = () => {
        var _a;
        onRedirectChat === null || onRedirectChat === void 0 ? void 0 : onRedirectChat();
        (_a = triggers_1.default.callbacks) === null || _a === void 0 ? void 0 : _a.emit('chat-visitor-registered');
    };
    const defaultGreeting = t('thanks_for_talking_with_us');
    const defaultMessage = t('if_you_have_any_other_questions_just_press_the_but');
    return ((0, jsx_runtime_1.jsxs)(Screen_1.default, { title: title, className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'chat-finished'), children: [(0, jsx_runtime_1.jsxs)(Screen_1.default.Content, { children: [(0, jsx_runtime_1.jsx)("p", { className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'chat-finished__greeting'), children: greeting || defaultGreeting }), (0, jsx_runtime_1.jsx)("p", { className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'chat-finished__message'), children: message || defaultMessage }), (0, jsx_runtime_1.jsx)(ButtonGroup_1.ButtonGroup, { children: (0, jsx_runtime_1.jsx)(Button_1.Button, { onClick: handleClick, stack: true, children: t('new_chat') }) })] }), (0, jsx_runtime_1.jsx)(Screen_1.default.Footer, {})] }));
};
exports.default = (0, react_i18next_1.withTranslation)()(ChatFinished);
