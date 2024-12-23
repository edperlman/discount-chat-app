"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMessageComposerIsReadOnly = void 0;
const meteor_1 = require("meteor/meteor");
const react_1 = require("react");
const useReactiveValue_1 = require("../../../../hooks/useReactiveValue");
const roomCoordinator_1 = require("../../../../lib/rooms/roomCoordinator");
const useMessageComposerIsReadOnly = (rid) => {
    const isReadOnly = (0, useReactiveValue_1.useReactiveValue)((0, react_1.useCallback)(() => roomCoordinator_1.roomCoordinator.readOnly(rid, meteor_1.Meteor.users.findOne(meteor_1.Meteor.userId(), { fields: { username: 1 } })), [rid]));
    return Boolean(isReadOnly);
};
exports.useMessageComposerIsReadOnly = useMessageComposerIsReadOnly;
