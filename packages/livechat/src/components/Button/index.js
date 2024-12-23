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
exports.Button = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_i18next_1 = require("react-i18next");
const createClassName_1 = require("../../helpers/createClassName");
const styles_scss_1 = __importDefault(require("./styles.scss"));
const handleMouseUp = ({ target }) => target === null || target === void 0 ? void 0 : target.blur();
const Button = (_a) => {
    var { submit, form, disabled, outline, nude, danger, secondary, stack, small, loading, badge, icon, onClick, className, style = {}, children, img, full } = _a, props = __rest(_a, ["submit", "form", "disabled", "outline", "nude", "danger", "secondary", "stack", "small", "loading", "badge", "icon", "onClick", "className", "style", "children", "img", "full"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)("button", Object.assign({ type: submit ? 'submit' : 'button', form: form, disabled: disabled, onClick: onClick, onMouseUp: handleMouseUp, "aria-label": icon && Array.isArray(children) ? children[0] : children, className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'button', {
            disabled,
            outline,
            nude,
            danger,
            secondary,
            stack,
            small,
            loading,
            icon: !!icon,
            img,
            full,
        }, [className]), style: Object.assign({}, style, img && {
            backgroundImage: `url(${img})`,
        }) }, props, { children: [badge ? ((0, jsx_runtime_1.jsx)("span", { role: 'status', "aria-label": t('unread_messages_count', { count: badge }), className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'button__badge'), children: badge })) : null, !img && (icon || children)] })));
};
exports.Button = Button;
