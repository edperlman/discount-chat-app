"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const preact_1 = require("preact");
const react_i18next_1 = require("react-i18next");
const Button_1 = require("../../components/Button");
const ButtonGroup_1 = require("../../components/ButtonGroup");
const MarkdownBlock_1 = __importDefault(require("../../components/MarkdownBlock"));
const Screen_1 = __importDefault(require("../../components/Screen"));
const createClassName_1 = require("../../helpers/createClassName");
const styles_scss_1 = __importDefault(require("./styles.scss"));
class GDPR extends preact_1.Component {
    constructor() {
        super(...arguments);
        this.handleClick = () => {
            const { onAgree } = this.props;
            onAgree === null || onAgree === void 0 ? void 0 : onAgree();
        };
        this.render = ({ title, consentText, instructions, t }) => ((0, jsx_runtime_1.jsxs)(Screen_1.default, { title: title, className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'gdpr'), children: [(0, jsx_runtime_1.jsxs)(Screen_1.default.Content, { children: [consentText ? ((0, jsx_runtime_1.jsx)("p", { className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'gdpr__consent-text'), children: (0, jsx_runtime_1.jsx)(MarkdownBlock_1.default, { text: consentText }) })) : ((0, jsx_runtime_1.jsx)("p", { className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'gdpr__consent-text'), children: (0, jsx_runtime_1.jsx)(react_i18next_1.Trans, { i18nKey: 'the_controller_of_your_personal_data_is_company_na' }) })), instructions ? ((0, jsx_runtime_1.jsx)("p", { className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'gdpr__instructions'), children: (0, jsx_runtime_1.jsx)(MarkdownBlock_1.default, { text: instructions }) })) : ((0, jsx_runtime_1.jsx)("p", { className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'gdpr__instructions'), children: (0, jsx_runtime_1.jsxs)(react_i18next_1.Trans, { i18nKey: 'go_to_menu_options_forget_remove_my_personal_data', children: ["Go to ", (0, jsx_runtime_1.jsx)("strong", { children: "menu options \u2192 Forget/Remove my personal data" }), " to request the immediate removal of your data."] }) })), (0, jsx_runtime_1.jsx)(ButtonGroup_1.ButtonGroup, { children: (0, jsx_runtime_1.jsx)(Button_1.Button, { onClick: this.handleClick, stack: true, children: t('i_agree') }) })] }), (0, jsx_runtime_1.jsx)(Screen_1.default.Footer, {})] }));
    }
}
exports.default = (0, react_i18next_1.withTranslation)()(GDPR);
