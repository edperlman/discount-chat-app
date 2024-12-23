"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCreateRoomItems = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const CreateDiscussion_1 = __importDefault(require("../../../../components/CreateDiscussion"));
const CreateChannelModal_1 = __importDefault(require("../../CreateChannelModal"));
const CreateDirectMessage_1 = __importDefault(require("../../CreateDirectMessage"));
const CreateTeamModal_1 = __importDefault(require("../../CreateTeamModal"));
const useCreateRoomModal_1 = require("../../hooks/useCreateRoomModal");
const CREATE_CHANNEL_PERMISSIONS = ['create-c', 'create-p'];
const CREATE_TEAM_PERMISSIONS = ['create-team'];
const CREATE_DIRECT_PERMISSIONS = ['create-d'];
const CREATE_DISCUSSION_PERMISSIONS = ['start-discussion', 'start-discussion-other-user'];
const useCreateRoomItems = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const discussionEnabled = (0, ui_contexts_1.useSetting)('Discussion_enabled');
    const canCreateChannel = (0, ui_contexts_1.useAtLeastOnePermission)(CREATE_CHANNEL_PERMISSIONS);
    const canCreateTeam = (0, ui_contexts_1.useAtLeastOnePermission)(CREATE_TEAM_PERMISSIONS);
    const canCreateDirectMessages = (0, ui_contexts_1.useAtLeastOnePermission)(CREATE_DIRECT_PERMISSIONS);
    const canCreateDiscussion = (0, ui_contexts_1.useAtLeastOnePermission)(CREATE_DISCUSSION_PERMISSIONS);
    const createChannel = (0, useCreateRoomModal_1.useCreateRoomModal)(CreateChannelModal_1.default);
    const createTeam = (0, useCreateRoomModal_1.useCreateRoomModal)(CreateTeamModal_1.default);
    const createDiscussion = (0, useCreateRoomModal_1.useCreateRoomModal)(CreateDiscussion_1.default);
    const createDirectMessage = (0, useCreateRoomModal_1.useCreateRoomModal)(CreateDirectMessage_1.default);
    const createChannelItem = {
        id: 'channel',
        content: t('Channel'),
        icon: 'hashtag',
        onClick: () => {
            createChannel();
        },
    };
    const createTeamItem = {
        id: 'team',
        content: t('Team'),
        icon: 'team',
        onClick: () => {
            createTeam();
        },
    };
    const createDirectMessageItem = {
        id: 'direct',
        content: t('Direct_message'),
        icon: 'balloon',
        onClick: () => {
            createDirectMessage();
        },
    };
    const createDiscussionItem = {
        id: 'discussion',
        content: t('Discussion'),
        icon: 'discussion',
        onClick: () => {
            createDiscussion();
        },
    };
    return [
        ...(canCreateDirectMessages ? [createDirectMessageItem] : []),
        ...(canCreateDiscussion && discussionEnabled ? [createDiscussionItem] : []),
        ...(canCreateChannel ? [createChannelItem] : []),
        ...(canCreateTeam ? [createTeamItem] : []),
    ];
};
exports.useCreateRoomItems = useCreateRoomItems;
