"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomActionHooksForE2EESetup = exports.quickActionHooks = exports.roomActionHooks = void 0;
const useChatForwardQuickAction_1 = require("./hooks/quickActions/useChatForwardQuickAction");
const useCloseChatQuickAction_1 = require("./hooks/quickActions/useCloseChatQuickAction");
const useMoveQueueQuickAction_1 = require("./hooks/quickActions/useMoveQueueQuickAction");
const useOnHoldChatQuickAction_1 = require("./hooks/quickActions/useOnHoldChatQuickAction");
const useTranscriptQuickAction_1 = require("./hooks/quickActions/useTranscriptQuickAction");
const useAppsRoomStarActions_1 = require("./hooks/roomActions/useAppsRoomStarActions");
const useAutotranslateRoomAction_1 = require("./hooks/roomActions/useAutotranslateRoomAction");
const useCallsRoomAction_1 = require("./hooks/roomActions/useCallsRoomAction");
const useCannedResponsesRoomAction_1 = require("./hooks/roomActions/useCannedResponsesRoomAction");
const useChannelSettingsRoomAction_1 = require("./hooks/roomActions/useChannelSettingsRoomAction");
const useCleanHistoryRoomAction_1 = require("./hooks/roomActions/useCleanHistoryRoomAction");
const useContactProfileRoomAction_1 = require("./hooks/roomActions/useContactProfileRoomAction");
const useDiscussionsRoomAction_1 = require("./hooks/roomActions/useDiscussionsRoomAction");
const useE2EERoomAction_1 = require("./hooks/roomActions/useE2EERoomAction");
const useExportMessagesRoomAction_1 = require("./hooks/roomActions/useExportMessagesRoomAction");
const useGameCenterRoomAction_1 = require("./hooks/roomActions/useGameCenterRoomAction");
const useKeyboardShortcutListRoomAction_1 = require("./hooks/roomActions/useKeyboardShortcutListRoomAction");
const useMembersListRoomAction_1 = require("./hooks/roomActions/useMembersListRoomAction");
const useMentionsRoomAction_1 = require("./hooks/roomActions/useMentionsRoomAction");
const useOTRRoomAction_1 = require("./hooks/roomActions/useOTRRoomAction");
const useOmnichannelExternalFrameRoomAction_1 = require("./hooks/roomActions/useOmnichannelExternalFrameRoomAction");
const useOutlookCalenderRoomAction_1 = require("./hooks/roomActions/useOutlookCalenderRoomAction");
const usePinnedMessagesRoomAction_1 = require("./hooks/roomActions/usePinnedMessagesRoomAction");
const usePushNotificationsRoomAction_1 = require("./hooks/roomActions/usePushNotificationsRoomAction");
const useRocketSearchRoomAction_1 = require("./hooks/roomActions/useRocketSearchRoomAction");
const useRoomInfoRoomAction_1 = require("./hooks/roomActions/useRoomInfoRoomAction");
const useStarredMessagesRoomAction_1 = require("./hooks/roomActions/useStarredMessagesRoomAction");
const useStartCallRoomAction_1 = require("./hooks/roomActions/useStartCallRoomAction");
const useTeamChannelsRoomAction_1 = require("./hooks/roomActions/useTeamChannelsRoomAction");
const useTeamInfoRoomAction_1 = require("./hooks/roomActions/useTeamInfoRoomAction");
const useThreadRoomAction_1 = require("./hooks/roomActions/useThreadRoomAction");
const useUploadedFilesListRoomAction_1 = require("./hooks/roomActions/useUploadedFilesListRoomAction");
const useUserInfoGroupRoomAction_1 = require("./hooks/roomActions/useUserInfoGroupRoomAction");
const useUserInfoRoomAction_1 = require("./hooks/roomActions/useUserInfoRoomAction");
const useVoIPRoomInfoRoomAction_1 = require("./hooks/roomActions/useVoIPRoomInfoRoomAction");
const useWebRTCVideoRoomAction_1 = require("./hooks/roomActions/useWebRTCVideoRoomAction");
exports.roomActionHooks = [
    useChannelSettingsRoomAction_1.useChannelSettingsRoomAction,
    useTeamInfoRoomAction_1.useTeamInfoRoomAction,
    useUserInfoGroupRoomAction_1.useUserInfoGroupRoomAction,
    useUserInfoRoomAction_1.useUserInfoRoomAction,
    useThreadRoomAction_1.useThreadRoomAction,
    useAutotranslateRoomAction_1.useAutotranslateRoomAction,
    useCallsRoomAction_1.useCallsRoomAction,
    useCannedResponsesRoomAction_1.useCannedResponsesRoomAction,
    useCleanHistoryRoomAction_1.useCleanHistoryRoomAction,
    useContactProfileRoomAction_1.useContactProfileRoomAction,
    useDiscussionsRoomAction_1.useDiscussionsRoomAction,
    useE2EERoomAction_1.useE2EERoomAction,
    useExportMessagesRoomAction_1.useExportMessagesRoomAction,
    useGameCenterRoomAction_1.useGameCenterRoomAction,
    useKeyboardShortcutListRoomAction_1.useKeyboardShortcutListRoomAction,
    useMembersListRoomAction_1.useMembersListRoomAction,
    useMentionsRoomAction_1.useMentionsRoomAction,
    useOTRRoomAction_1.useOTRRoomAction,
    useOmnichannelExternalFrameRoomAction_1.useOmnichannelExternalFrameRoomAction,
    useOutlookCalenderRoomAction_1.useOutlookCalenderRoomAction,
    usePinnedMessagesRoomAction_1.usePinnedMessagesRoomAction,
    usePushNotificationsRoomAction_1.usePushNotificationsRoomAction,
    useRocketSearchRoomAction_1.useRocketSearchRoomAction,
    useRoomInfoRoomAction_1.useRoomInfoRoomAction,
    useStarredMessagesRoomAction_1.useStarredMessagesRoomAction,
    useStartCallRoomAction_1.useStartCallRoomAction,
    useTeamChannelsRoomAction_1.useTeamChannelsRoomAction,
    useUploadedFilesListRoomAction_1.useUploadedFilesListRoomAction,
    useVoIPRoomInfoRoomAction_1.useVoIPRoomInfoRoomAction,
    useWebRTCVideoRoomAction_1.useWebRTCVideoRoomAction,
    useAppsRoomStarActions_1.useAppsRoomStarActions,
];
exports.quickActionHooks = [
    useMoveQueueQuickAction_1.useMoveQueueQuickAction,
    useChatForwardQuickAction_1.useChatForwardQuickAction,
    useTranscriptQuickAction_1.useTranscriptQuickAction,
    useCloseChatQuickAction_1.useCloseChatQuickAction,
    useOnHoldChatQuickAction_1.useOnHoldChatQuickAction,
];
exports.roomActionHooksForE2EESetup = [useChannelSettingsRoomAction_1.useChannelSettingsRoomAction, useMembersListRoomAction_1.useMembersListRoomAction, useE2EERoomAction_1.useE2EERoomAction];
