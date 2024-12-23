"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLegacyThreadMessages = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const client_1 = require("../../../../../../app/models/client");
const RoomHistoryManager_1 = require("../../../../../../app/ui-utils/client/lib/RoomHistoryManager");
const useReactiveValue_1 = require("../../../../../hooks/useReactiveValue");
const useLegacyThreadMessages = (tmid) => {
    const messages = (0, useReactiveValue_1.useReactiveValue)((0, react_1.useCallback)(() => {
        return client_1.Messages.find({
            $or: [{ tmid }, { _id: tmid }],
            _hidden: { $ne: true },
            tmid,
            _id: { $ne: tmid },
        }, {
            fields: {
                collapsed: 0,
                threadMsg: 0,
                repliesCount: 0,
            },
            sort: { ts: 1 },
        })
            .fetch()
            .filter(core_typings_1.isThreadMessage);
    }, [tmid]));
    const [loading, setLoading] = (0, react_1.useState)(false);
    const getThreadMessages = (0, ui_contexts_1.useMethod)('getThreadMessages');
    (0, react_1.useEffect)(() => {
        setLoading(true);
        getThreadMessages({ tmid }).then((messages) => {
            (0, RoomHistoryManager_1.upsertMessageBulk)({ msgs: messages }, client_1.Messages);
            setLoading(false);
        });
    }, [getThreadMessages, tmid]);
    return { messages, loading };
};
exports.useLegacyThreadMessages = useLegacyThreadMessages;
