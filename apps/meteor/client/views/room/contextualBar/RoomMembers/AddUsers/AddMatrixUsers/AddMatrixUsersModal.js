"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const verificationStatusAsIcon = (verificationStatus) => {
    if (verificationStatus === 'VERIFIED') {
        return 'circle-check';
    }
    if (verificationStatus === 'UNVERIFIED') {
        return 'circle-cross';
    }
    if (verificationStatus === 'UNABLE_TO_VERIFY') {
        return 'circle-exclamation';
    }
};
const AddMatrixUsersModal = ({ onClose, matrixIdVerifiedStatus, onSave, completeUserList }) => {
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const usersToInvite = completeUserList.filter((user) => !(matrixIdVerifiedStatus.has(user) && matrixIdVerifiedStatus.get(user) === 'UNVERIFIED'));
    const rocketChatUsers = usersToInvite.filter((user) => !matrixIdVerifiedStatus.has(user));
    const { handleSubmit } = (0, react_hook_form_1.useForm)({
        defaultValues: {
            usersToInvite,
        },
    });
    const onSubmit = (data) => {
        onSave({ users: data.usersToInvite })
            .then(onClose)
            .catch((error) => dispatchToastMessage({ type: 'error', message: error }));
    };
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.HeaderText, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { children: t('Continue_Adding') }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { title: t('Close'), onClick: onClose })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Content, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'ul', children: [[...matrixIdVerifiedStatus.entries()].map(([_matrixId, _verificationStatus]) => ((0, jsx_runtime_1.jsxs)("li", { children: [_matrixId, ": ", (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: verificationStatusAsIcon(_verificationStatus), size: 'x20' })] }, _matrixId))), rocketChatUsers.map((_user) => ((0, jsx_runtime_1.jsx)("li", { children: _user }, `rocket-chat-${_user}`)))] }) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Footer, { justifyContent: 'center', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.FooterControllers, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: onClose, children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, onClick: handleSubmit(onSubmit), disabled: !(usersToInvite.length > 0), children: t('Yes_continue') })] }) })] }));
};
exports.default = AddMatrixUsersModal;
