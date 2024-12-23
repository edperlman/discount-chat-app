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
const AssignAgentModal_1 = __importDefault(require("./AssignAgentModal"));
const GenericTable_1 = require("../../../../../components/GenericTable");
const AssignAgentButton = ({ extension, reload }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const handleAssociation = (0, fuselage_hooks_1.useMutableCallback)((e) => {
        e.stopPropagation();
        setModal((0, jsx_runtime_1.jsx)(AssignAgentModal_1.default, { existingExtension: extension, closeModal: () => setModal(), reload: reload }));
    });
    return ((0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { fontScale: 'p2', color: 'hint', withTruncatedText: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { icon: 'user-plus', small: true, title: t('Associate_Agent'), onClick: handleAssociation }) }));
};
exports.default = AssignAgentButton;
