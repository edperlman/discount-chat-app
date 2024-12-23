"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCollapse = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const CollapsibleContent_1 = __importDefault(require("../content/collapsible/CollapsibleContent"));
const useCollapse = (attachmentCollapsed) => {
    const collpaseByDefault = (0, ui_contexts_1.useAttachmentIsCollapsedByDefault)();
    const [collapsed, toogleCollapsed] = (0, fuselage_hooks_1.useToggle)(collpaseByDefault || attachmentCollapsed);
    return [collapsed, (0, jsx_runtime_1.jsx)(CollapsibleContent_1.default, { collapsed: collapsed, onClick: toogleCollapsed }, 'collapsible-content-action')];
};
exports.useCollapse = useCollapse;
