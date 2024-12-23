"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const AssignExtensionModal_1 = __importDefault(require("./AssignExtensionModal"));
const AssignExtensionButton = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const handleAssign = (0, fuselage_hooks_1.useEffectEvent)(() => {
        setModal((0, jsx_runtime_1.jsx)(AssignExtensionModal_1.default, { onClose: () => setModal(null) }));
    });
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: 'phone', onClick: handleAssign, children: t('Assign_extension') }));
};
exports.default = AssignExtensionButton;
