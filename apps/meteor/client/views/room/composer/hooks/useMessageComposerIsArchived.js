"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMessageComposerIsArchived = void 0;
const react_1 = require("react");
const useReactiveValue_1 = require("../../../../hooks/useReactiveValue");
const roomCoordinator_1 = require("../../../../lib/rooms/roomCoordinator");
const useMessageComposerIsArchived = (rid, subscription) => {
    const isArchived = (0, useReactiveValue_1.useReactiveValue)((0, react_1.useCallback)(() => roomCoordinator_1.roomCoordinator.archived(rid) || Boolean(subscription && subscription.t === 'd' && subscription.archived), [rid, subscription]));
    return Boolean(isArchived);
};
exports.useMessageComposerIsArchived = useMessageComposerIsArchived;
