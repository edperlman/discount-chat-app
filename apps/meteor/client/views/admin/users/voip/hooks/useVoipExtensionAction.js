"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVoipExtensionAction = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const AssignExtensionModal_1 = __importDefault(require("../AssignExtensionModal"));
const RemoveExtensionModal_1 = __importDefault(require("../RemoveExtensionModal"));
const useVoipExtensionAction = ({ name, username, extension, enabled }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const handleExtensionAssignment = (0, fuselage_hooks_1.useEffectEvent)(() => {
        if (extension) {
            setModal((0, jsx_runtime_1.jsx)(RemoveExtensionModal_1.default, { name: name, username: username, extension: extension, onClose: () => setModal(null) }));
            return;
        }
        setModal((0, jsx_runtime_1.jsx)(AssignExtensionModal_1.default, { defaultUsername: username, onClose: () => setModal(null) }));
    });
    return enabled
        ? {
            icon: extension ? 'phone-disabled' : 'phone',
            label: extension ? t('Unassign_extension') : t('Assign_extension'),
            action: handleExtensionAssignment,
        }
        : undefined;
};
exports.useVoipExtensionAction = useVoipExtensionAction;
