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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const LoginServicesButton = (_a) => {
    var { buttonLabelText, icon, title, service, className, disabled, setError, buttonColor, buttonLabelColor } = _a, props = __rest(_a, ["buttonLabelText", "icon", "title", "service", "className", "disabled", "setError", "buttonColor", "buttonLabelColor"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const handler = (0, ui_contexts_1.useLoginWithService)(Object.assign({ service, buttonLabelText }, props));
    const handleOnClick = (0, react_1.useCallback)(() => {
        handler().catch((e) => {
            if (!e.error || typeof e.error !== 'string') {
                return;
            }
            setError === null || setError === void 0 ? void 0 : setError([e.error, e.reason]);
        });
    }, [handler, setError]);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: icon, className: className, onClick: handleOnClick, title: buttonLabelText && buttonLabelText !== title ? title : undefined, disabled: disabled, alignItems: 'center', display: 'flex', justifyContent: 'center', color: buttonLabelColor, backgroundColor: buttonColor, children: buttonLabelText || t('Sign_in_with__provider__', { provider: title }) }));
};
exports.default = LoginServicesButton;
