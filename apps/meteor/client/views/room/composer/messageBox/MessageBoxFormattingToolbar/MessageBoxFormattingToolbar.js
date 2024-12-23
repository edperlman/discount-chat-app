"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_composer_1 = require("@rocket.chat/ui-composer");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const FormattingToolbarDropdown_1 = __importDefault(require("./FormattingToolbarDropdown"));
const messageBoxFormatting_1 = require("../../../../../../app/ui-message/client/messageBox/messageBoxFormatting");
const MessageBoxFormattingToolbar = ({ items, variant = 'large', composer, disabled }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    if (variant === 'small') {
        const collapsedItems = [...items];
        const featuredFormatter = collapsedItems.splice(0, 1)[0];
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ['icon' in featuredFormatter && ((0, jsx_runtime_1.jsx)(ui_composer_1.MessageComposerAction, { onClick: () => (0, messageBoxFormatting_1.isPromptButton)(featuredFormatter) ? featuredFormatter.prompt(composer) : composer.wrapSelection(featuredFormatter.pattern), icon: featuredFormatter.icon, title: t(featuredFormatter.label), disabled: disabled })), (0, jsx_runtime_1.jsx)(FormattingToolbarDropdown_1.default, { composer: composer, items: collapsedItems, disabled: disabled })] }));
    }
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: items.map((formatter) => 'icon' in formatter ? ((0, jsx_runtime_1.jsx)(ui_composer_1.MessageComposerAction, { disabled: disabled, icon: formatter.icon, "data-id": formatter.label, title: t(formatter.label), onClick: () => {
                if ((0, messageBoxFormatting_1.isPromptButton)(formatter)) {
                    formatter.prompt(composer);
                    return;
                }
                if ('link' in formatter) {
                    window.open(formatter.link, '_blank', 'rel=noreferrer noopener');
                    return;
                }
                composer.wrapSelection(formatter.pattern);
            } }, formatter.label)) : ((0, jsx_runtime_1.jsx)("span", Object.assign({}, (disabled && { style: { pointerEvents: 'none' } }), { title: formatter.label, children: (0, jsx_runtime_1.jsx)("a", { href: formatter.link, target: '_blank', rel: 'noopener noreferrer', children: formatter.text() }) }), formatter.label))) }));
};
exports.default = (0, react_1.memo)(MessageBoxFormattingToolbar);
