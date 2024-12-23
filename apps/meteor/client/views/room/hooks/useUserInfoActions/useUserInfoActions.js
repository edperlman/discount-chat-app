"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUserInfoActions = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useAddUserAction_1 = require("./actions/useAddUserAction");
const useBlockUserAction_1 = require("./actions/useBlockUserAction");
const useChangeLeaderAction_1 = require("./actions/useChangeLeaderAction");
const useChangeModeratorAction_1 = require("./actions/useChangeModeratorAction");
const useChangeOwnerAction_1 = require("./actions/useChangeOwnerAction");
const useDirectMessageAction_1 = require("./actions/useDirectMessageAction");
const useIgnoreUserAction_1 = require("./actions/useIgnoreUserAction");
const useMuteUserAction_1 = require("./actions/useMuteUserAction");
const useRedirectModerationConsole_1 = require("./actions/useRedirectModerationConsole");
const useRemoveUserAction_1 = require("./actions/useRemoveUserAction");
const useReportUser_1 = require("./actions/useReportUser");
const useVideoCallAction_1 = require("./actions/useVideoCallAction");
const useVoipCallAction_1 = require("./actions/useVoipCallAction");
const useEmbeddedLayout_1 = require("../../../../hooks/useEmbeddedLayout");
const useUserInfoActions = ({ user, rid, reload, size = 2, isMember, }) => {
    const addUser = (0, useAddUserAction_1.useAddUserAction)(user, rid, reload);
    const blockUser = (0, useBlockUserAction_1.useBlockUserAction)(user, rid);
    const changeLeader = (0, useChangeLeaderAction_1.useChangeLeaderAction)(user, rid);
    const changeModerator = (0, useChangeModeratorAction_1.useChangeModeratorAction)(user, rid);
    const openModerationConsole = (0, useRedirectModerationConsole_1.useRedirectModerationConsole)(user._id);
    const changeOwner = (0, useChangeOwnerAction_1.useChangeOwnerAction)(user, rid);
    const openDirectMessage = (0, useDirectMessageAction_1.useDirectMessageAction)(user, rid);
    const ignoreUser = (0, useIgnoreUserAction_1.useIgnoreUserAction)(user, rid);
    const muteUser = (0, useMuteUserAction_1.useMuteUserAction)(user, rid);
    const removeUser = (0, useRemoveUserAction_1.useRemoveUserAction)(user, rid, reload);
    const videoCall = (0, useVideoCallAction_1.useVideoCallAction)(user);
    const voipCall = (0, useVoipCallAction_1.useVoipCallAction)(user);
    const reportUserOption = (0, useReportUser_1.useReportUser)(user);
    const isLayoutEmbedded = (0, useEmbeddedLayout_1.useEmbeddedLayout)();
    const { userToolbox: hiddenActions } = (0, ui_contexts_1.useLayoutHiddenActions)();
    const userinfoActions = (0, react_1.useMemo)(() => (Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (openDirectMessage && !isLayoutEmbedded && { openDirectMessage })), (videoCall && { videoCall })), (voipCall && { voipCall })), (!isMember && addUser && { addUser })), (isMember && changeOwner && { changeOwner })), (isMember && changeLeader && { changeLeader })), (isMember && changeModerator && { changeModerator })), (isMember && openModerationConsole && { openModerationConsole })), (isMember && ignoreUser && { ignoreUser })), (isMember && muteUser && { muteUser })), (blockUser && { toggleBlock: blockUser })), (reportUserOption && { reportUser: reportUserOption })), (isMember && removeUser && { removeUser }))), [
        openDirectMessage,
        isLayoutEmbedded,
        videoCall,
        voipCall,
        changeOwner,
        changeLeader,
        changeModerator,
        ignoreUser,
        muteUser,
        blockUser,
        removeUser,
        reportUserOption,
        openModerationConsole,
        addUser,
        isMember,
    ]);
    const actionSpread = (0, react_1.useMemo)(() => {
        const entries = Object.entries(userinfoActions).filter(([key]) => !hiddenActions.includes(key));
        const options = entries.slice(0, size);
        const slicedOptions = entries.slice(size, entries.length);
        const menuActions = slicedOptions.reduce((acc, [_key, item]) => {
            const group = item.type ? item.type : '';
            const section = acc.find((section) => section.id === group);
            const newItem = Object.assign(Object.assign({}, item), { id: item.content || item.title || '', content: item.content || item.title });
            if (section) {
                section.items.push(newItem);
                return acc;
            }
            const newSection = { id: group, title: '', items: [newItem] };
            acc.push(newSection);
            return acc;
        }, []);
        return { actions: options, menuActions };
    }, [size, userinfoActions, hiddenActions]);
    return actionSpread;
};
exports.useUserInfoActions = useUserInfoActions;
