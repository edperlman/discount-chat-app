"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMessages = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const client_1 = require("../../../../../app/models/client");
const useReactiveValue_1 = require("../../../../hooks/useReactiveValue");
const RoomContext_1 = require("../../contexts/RoomContext");
const mergeHideSysMessages = (sysMesArray1, sysMesArray2) => {
    return Array.from(new Set([...sysMesArray1, ...sysMesArray2]));
};
const useMessages = ({ rid }) => {
    const showThreadsInMainChannel = (0, ui_contexts_1.useUserPreference)('showThreadsInMainChannel', false);
    const hideSysMesSetting = (0, ui_contexts_1.useSetting)('Hide_System_Messages', []);
    const room = (0, RoomContext_1.useRoom)();
    const hideRoomSysMes = Array.isArray(room.sysMes) ? room.sysMes : [];
    const hideSysMessages = (0, fuselage_hooks_1.useStableArray)(mergeHideSysMessages(hideSysMesSetting, hideRoomSysMes));
    const query = (0, react_1.useMemo)(() => (Object.assign({ rid, _hidden: { $ne: true }, t: { $nin: hideSysMessages } }, (!showThreadsInMainChannel && {
        $or: [{ tmid: { $exists: false } }, { tshow: { $eq: true } }],
    }))), [rid, hideSysMessages, showThreadsInMainChannel]);
    return (0, useReactiveValue_1.useReactiveValue)((0, react_1.useCallback)(() => client_1.Messages.find(query, {
        sort: {
            ts: 1,
        },
    }).fetch(), [query]));
};
exports.useMessages = useMessages;
