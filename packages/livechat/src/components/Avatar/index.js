"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Avatar = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const preact_1 = require("preact");
const createClassName_1 = require("../../helpers/createClassName");
const styles_scss_1 = __importDefault(require("./styles.scss"));
class Avatar extends preact_1.Component {
    constructor() {
        super(...arguments);
        this.state = {
            errored: false,
        };
        this.handleError = () => {
            this.setState({ errored: true });
        };
        this.render = ({ small, large, src, description, status, className, style }, { errored }) => ((0, jsx_runtime_1.jsxs)("div", { "aria-label": 'User picture', className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'avatar', { small, large, nobg: src && !errored }, [className]), style: style, children: [src && !errored && ((0, jsx_runtime_1.jsx)("img", { src: src, alt: description, className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'avatar__image'), onError: this.handleError })), status && (0, jsx_runtime_1.jsx)("span", { className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'avatar__status', { small, large, status }) })] }));
    }
    static getDerivedStateFromProps(props) {
        if (props.src) {
            return { errored: false };
        }
        return null;
    }
}
exports.Avatar = Avatar;
