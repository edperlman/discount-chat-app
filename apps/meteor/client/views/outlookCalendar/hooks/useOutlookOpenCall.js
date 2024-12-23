"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOutlookOpenCall = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const useUserDisplayName_1 = require("../../../hooks/useUserDisplayName");
const useVideoConfOpenCall_1 = require("../../room/contextualBar/VideoConference/hooks/useVideoConfOpenCall");
const useOutlookOpenCall = (meetingUrl) => {
    const user = (0, ui_contexts_1.useUser)();
    const handleOpenCall = (0, useVideoConfOpenCall_1.useVideoConfOpenCall)();
    const userDisplayName = (0, useUserDisplayName_1.useUserDisplayName)({ name: user === null || user === void 0 ? void 0 : user.name, username: user === null || user === void 0 ? void 0 : user.username });
    const namedMeetingUrl = `${meetingUrl}&name=${userDisplayName}`;
    if (!meetingUrl) {
        return;
    }
    return () => handleOpenCall(namedMeetingUrl);
};
exports.useOutlookOpenCall = useOutlookOpenCall;
