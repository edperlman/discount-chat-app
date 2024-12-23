"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_client_1 = require("@rocket.chat/ui-client");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const BoldSpan_1 = __importDefault(require("./BoldSpan"));
const ItalicSpan_1 = __importDefault(require("./ItalicSpan"));
const PlainSpan_1 = __importDefault(require("./PlainSpan"));
const StrikeSpan_1 = __importDefault(require("./StrikeSpan"));
const LinkSpan = ({ href, label }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const children = (0, react_1.useMemo)(() => {
        const labelArray = Array.isArray(label) ? label : [label];
        const labelElements = labelArray.map((child, index) => {
            switch (child.type) {
                case 'PLAIN_TEXT':
                    return (0, jsx_runtime_1.jsx)(PlainSpan_1.default, { text: child.value }, index);
                case 'STRIKE':
                    return (0, jsx_runtime_1.jsx)(StrikeSpan_1.default, { children: child.value }, index);
                case 'ITALIC':
                    return (0, jsx_runtime_1.jsx)(ItalicSpan_1.default, { children: child.value }, index);
                case 'BOLD':
                    return (0, jsx_runtime_1.jsx)(BoldSpan_1.default, { children: child.value }, index);
                default:
                    return null;
            }
        });
        return labelElements;
    }, [label]);
    if ((0, ui_client_1.isExternal)(href)) {
        return ((0, jsx_runtime_1.jsx)("a", { href: href, title: href, rel: 'noopener noreferrer', target: '_blank', children: children }));
    }
    return ((0, jsx_runtime_1.jsx)("a", { href: href, title: t('Go_to_href', { href: href.replace((0, ui_client_1.getBaseURI)(), '') }), children: children }));
};
exports.default = LinkSpan;
