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
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const MarkdownText_1 = __importDefault(require("../../../components/MarkdownText"));
const clampStyle = (0, css_in_js_1.css) `
	display: -webkit-box;
	overflow: hidden;
	-webkit-line-clamp: 5;
	-webkit-box-orient: vertical;
`;
const SettingsGroupCard = (_a) => {
    var { id, title, description } = _a, props = __rest(_a, ["id", "title", "description"]);
    const { t, i18n } = (0, react_i18next_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const cardId = (0, fuselage_hooks_1.useUniqueId)();
    const descriptionId = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Card, Object.assign({ "data-qa-id": id, "aria-labelledby": cardId, "aria-describedby": descriptionId }, props, { height: 'full', role: 'region', children: [(0, jsx_runtime_1.jsx)(fuselage_1.CardTitle, { id: cardId, children: t(title) }), (0, jsx_runtime_1.jsx)(fuselage_1.CardBody, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { className: clampStyle, id: descriptionId, children: description && i18n.exists(description) && (0, jsx_runtime_1.jsx)(MarkdownText_1.default, { variant: 'inlineWithoutBreaks', content: t(description) }) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.CardControls, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { is: 'a', href: router.buildRoutePath({
                        pattern: '/admin/settings/:group?',
                        params: { group: id },
                    }), medium: true, children: t('Open') }) })] })));
};
exports.default = SettingsGroupCard;
