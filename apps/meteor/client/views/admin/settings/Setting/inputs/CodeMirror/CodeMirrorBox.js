"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importDefault(require("react"));
const react_dom_1 = require("react-dom");
const react_i18next_1 = require("react-i18next");
const CodeMirrorBox = ({ label, children }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [fullScreen, toggleFullScreen] = (0, fuselage_hooks_1.useToggle)(false);
    if (fullScreen) {
        return (0, react_dom_1.createPortal)((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { className: 'code-mirror-box code-mirror-box-fullscreen', color: 'default', backgroundColor: 'light', position: 'absolute', zIndex: 100, display: 'flex', flexDirection: 'column', width: '100%', height: '100%', p: 40, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p1', mbe: 4, children: label }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', height: '100%', role: 'code', "aria-label": typeof label === 'string' ? label : undefined, children: children }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbs: 8, children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, onClick: () => toggleFullScreen(), children: t('Exit_Full_Screen') }) }) })] }), document.getElementById('main-content'));
    }
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { className: 'code-mirror-box', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', height: '100%', role: 'code', "aria-label": typeof label === 'string' ? label : undefined, children: children }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbs: 8, children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, onClick: () => toggleFullScreen(), children: t('Full_Screen') }) }) })] }));
};
exports.default = CodeMirrorBox;
