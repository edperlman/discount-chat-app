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
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const GenericMenuItem_1 = __importDefault(require("./GenericMenuItem"));
const useHandleMenuAction_1 = require("./hooks/useHandleMenuAction");
const GenericMenu = (_a) => {
    var { title, icon = 'menu', disabled, onAction, callbackAction, button, className } = _a, props = __rest(_a, ["title", "icon", "disabled", "onAction", "callbackAction", "button", "className"]);
    const { t, i18n } = (0, react_i18next_1.useTranslation)();
    const sections = 'sections' in props && props.sections;
    const items = 'items' in props && props.items;
    const itemsList = sections ? sections.reduce((acc, { items }) => [...acc, ...items], []) : items || [];
    const disabledKeys = itemsList.filter(({ disabled }) => disabled).map(({ id }) => id);
    const handleAction = (0, useHandleMenuAction_1.useHandleMenuAction)(itemsList || [], callbackAction);
    const hasIcon = itemsList.some(({ icon }) => icon);
    const handleItems = (items) => hasIcon ? items.map((item) => { var _a; return (Object.assign(Object.assign({}, item), { gap: (_a = item.gap) !== null && _a !== void 0 ? _a : (!item.icon && !item.status) })); }) : items;
    const isMenuEmpty = !(sections && sections.length > 0) && !(items && items.length > 0);
    if (isMenuEmpty || disabled) {
        if (button) {
            // FIXME: deprecate prop `button` as there's no way to ensure it is actually a button
            // (e.g cloneElement could be passing props to a fragment)
            return (0, react_1.cloneElement)(button, { small: true, icon, disabled, title, className });
        }
        return (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { small: true, icon: icon, className: className, title: title, disabled: true });
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [sections && ((0, jsx_runtime_1.jsx)(fuselage_1.MenuV2, Object.assign({ icon: icon, title: i18n.exists(title) ? t(title) : title, onAction: onAction || handleAction, className: className, button: button }, (disabledKeys && { disabledKeys }), props, { children: sections.map(({ title, items }, key) => ((0, jsx_runtime_1.jsx)(fuselage_1.MenuSection, { title: typeof title === 'string' && i18n.exists(title) ? t(title) : title, items: handleItems(items), children: (item) => ((0, jsx_runtime_1.jsx)(fuselage_1.MenuItem, { children: (0, jsx_runtime_1.jsx)(GenericMenuItem_1.default, Object.assign({}, item)) }, item.id)) }, `${title}-${key}`))) }))), items && ((0, jsx_runtime_1.jsx)(fuselage_1.MenuV2, Object.assign({ icon: icon, title: i18n.exists(title) ? t(title) : title, onAction: onAction || handleAction, className: className, button: button }, (disabledKeys && { disabledKeys }), props, { children: handleItems(items).map((item) => ((0, jsx_runtime_1.jsx)(fuselage_1.MenuItem, { children: (0, jsx_runtime_1.jsx)(GenericMenuItem_1.default, Object.assign({}, item)) }, item.id))) })))] }));
};
exports.default = GenericMenu;
