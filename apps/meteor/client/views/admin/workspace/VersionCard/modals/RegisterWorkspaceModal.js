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
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const RegisterWorkspaceSetupModal_1 = __importDefault(require("./RegisterWorkspaceSetupModal"));
const RegisterWorkspaceTokenModal_1 = __importDefault(require("./RegisterWorkspaceTokenModal"));
const useFeatureBullets_1 = __importDefault(require("../hooks/useFeatureBullets"));
const documentationLink = 'https://go.rocket.chat/i/register-info-collected';
const RegisterWorkspaceModal = (_a) => {
    var { onClose, onStatusChange } = _a, props = __rest(_a, ["onClose", "onStatusChange"]);
    const setModal = (0, ui_contexts_1.useSetModal)();
    const bulletFeatures = (0, useFeatureBullets_1.default)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const handleTokenModal = () => {
        const handleModalClose = () => setModal(null);
        setModal((0, jsx_runtime_1.jsx)(RegisterWorkspaceTokenModal_1.default, { onClose: handleModalClose, onStatusChange: onStatusChange }));
    };
    const handleSetupModal = () => {
        const handleModalClose = () => setModal(null);
        setModal((0, jsx_runtime_1.jsx)(RegisterWorkspaceSetupModal_1.default, { onClose: handleModalClose, onStatusChange: onStatusChange }));
    };
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal, Object.assign({}, props, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.HeaderText, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { children: t('RegisterWorkspace_NotRegistered_Title') }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { onClick: onClose })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Content, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { withRichContent: true, children: [(0, jsx_runtime_1.jsx)("span", { children: `${t('RegisterWorkspace_NotRegistered_Subtitle')}:` }), (0, jsx_runtime_1.jsx)("ul", { children: bulletFeatures.map((features) => ((0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("strong", { children: features.title }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'p', mbs: 4, children: features.description })] }, features.key))) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'p', fontSize: 'p2', children: t('RegisterWorkspace_Registered_Benefits') })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Footer, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'div', display: 'flex', justifyContent: 'space-between', alignItems: 'center', w: 'full', children: [(0, jsx_runtime_1.jsx)(ui_client_1.ExternalLink, { to: documentationLink, children: t('Learn_more') }), (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { align: 'end', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: handleTokenModal, children: t('Use_token') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, onClick: handleSetupModal, children: t('RegisterWorkspace_Button') })] })] }) })] })));
};
exports.default = RegisterWorkspaceModal;
