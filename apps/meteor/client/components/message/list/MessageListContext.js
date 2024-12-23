"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMessageListRef = exports.useOpenEmojiPicker = exports.useUserHasReacted = exports.useMessageListJumpToMessageParam = exports.useMessageListHighlights = exports.useMessageListShowUsername = exports.useMessageListShowRealName = exports.useMessageListShowRoles = exports.useMessageDateFormatter = exports.useShowFollowing = exports.useShowStarred = exports.useShowTranslated = exports.MessageListContext = void 0;
const react_1 = require("react");
exports.MessageListContext = (0, react_1.createContext)({
    useShowTranslated: () => false,
    useShowStarred: () => false,
    useShowFollowing: () => false,
    useUserHasReacted: () => () => false,
    useMessageDateFormatter: () => (date) => date.toString(),
    useOpenEmojiPicker: () => () => undefined,
    showRoles: false,
    showRealName: false,
    showUsername: false,
    showColors: false,
    username: undefined,
    messageListRef: { current: null },
});
const useShowTranslated = (...args) => (0, react_1.useContext)(exports.MessageListContext).useShowTranslated(...args);
exports.useShowTranslated = useShowTranslated;
const useShowStarred = (...args) => (0, react_1.useContext)(exports.MessageListContext).useShowStarred(...args);
exports.useShowStarred = useShowStarred;
const useShowFollowing = (...args) => (0, react_1.useContext)(exports.MessageListContext).useShowFollowing(...args);
exports.useShowFollowing = useShowFollowing;
const useMessageDateFormatter = (...args) => (0, react_1.useContext)(exports.MessageListContext).useMessageDateFormatter(...args);
exports.useMessageDateFormatter = useMessageDateFormatter;
const useMessageListShowRoles = () => (0, react_1.useContext)(exports.MessageListContext).showRoles;
exports.useMessageListShowRoles = useMessageListShowRoles;
const useMessageListShowRealName = () => (0, react_1.useContext)(exports.MessageListContext).showRealName;
exports.useMessageListShowRealName = useMessageListShowRealName;
const useMessageListShowUsername = () => (0, react_1.useContext)(exports.MessageListContext).showUsername;
exports.useMessageListShowUsername = useMessageListShowUsername;
const useMessageListHighlights = () => (0, react_1.useContext)(exports.MessageListContext).highlights;
exports.useMessageListHighlights = useMessageListHighlights;
const useMessageListJumpToMessageParam = () => (0, react_1.useContext)(exports.MessageListContext).jumpToMessageParam;
exports.useMessageListJumpToMessageParam = useMessageListJumpToMessageParam;
const useUserHasReacted = (message) => (0, react_1.useContext)(exports.MessageListContext).useUserHasReacted(message);
exports.useUserHasReacted = useUserHasReacted;
const useOpenEmojiPicker = (...args) => (0, react_1.useContext)(exports.MessageListContext).useOpenEmojiPicker(...args);
exports.useOpenEmojiPicker = useOpenEmojiPicker;
const useMessageListRef = () => (0, react_1.useContext)(exports.MessageListContext).messageListRef;
exports.useMessageListRef = useMessageListRef;
