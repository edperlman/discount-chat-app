"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const GenericCard_1 = require("../../../components/GenericCard");
const CreateChannel_1 = __importDefault(require("../../../sidebar/header/CreateChannel"));
const CreateChannelsCard = (props) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const openCreateChannelModal = () => setModal((0, jsx_runtime_1.jsx)(CreateChannel_1.default, { onClose: () => setModal(null) }));
    return ((0, jsx_runtime_1.jsx)(GenericCard_1.GenericCard, Object.assign({ title: t('Create_channels'), body: t('Create_a_public_channel_that_new_workspace_members_can_join'), buttons: [(0, jsx_runtime_1.jsx)(GenericCard_1.GenericCardButton, { onClick: openCreateChannelModal, children: t('Create_channel') }, 1)], "data-qa-id": 'homepage-create-channels-card', width: 'x340' }, props)));
};
exports.default = CreateChannelsCard;
