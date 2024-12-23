"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const GenericCard_1 = require("../../../components/GenericCard");
const JoinRoomsCard = (props) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const handleDirectory = () => {
        router.navigate('/directory');
    };
    return ((0, jsx_runtime_1.jsx)(GenericCard_1.GenericCard, Object.assign({ title: t('Join_rooms'), body: t('Discover_public_channels_and_teams_in_the_workspace_directory'), buttons: [(0, jsx_runtime_1.jsx)(GenericCard_1.GenericCardButton, { onClick: handleDirectory, children: t('Open_directory') }, 1)], "data-qa-id": 'homepage-join-rooms-card', width: 'x340' }, props)));
};
exports.default = JoinRoomsCard;
