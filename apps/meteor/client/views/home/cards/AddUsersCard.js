"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const GenericCard_1 = require("../../../components/GenericCard");
const AddUsersCard = (props) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const handleOpenUsersRoute = () => {
        router.navigate('/admin/users');
    };
    return ((0, jsx_runtime_1.jsx)(GenericCard_1.GenericCard, Object.assign({ title: t('Add_users'), body: t('Invite_and_add_members_to_this_workspace_to_start_communicating'), buttons: [(0, jsx_runtime_1.jsx)(GenericCard_1.GenericCardButton, { onClick: handleOpenUsersRoute, children: t('Add_users'), primary: true }, 1)], "data-qa-id": 'homepage-add-users-card', width: 'x340' }, props)));
};
exports.default = AddUsersCard;
