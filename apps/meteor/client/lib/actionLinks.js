"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionLinks = void 0;
const meteor_1 = require("meteor/meteor");
const fireGlobalEvent_1 = require("./utils/fireGlobalEvent");
const isLayoutEmbedded_1 = require("./utils/isLayoutEmbedded");
// Action Links namespace creation.
exports.actionLinks = {
    actions: new Map(),
    register(name, fn) {
        exports.actionLinks.actions.set(name, fn);
    },
    run(actionMethodId, message) {
        var _a;
        const embedded = (0, isLayoutEmbedded_1.isLayoutEmbedded)();
        if (embedded) {
            (0, fireGlobalEvent_1.fireGlobalEvent)('click-action-link', {
                actionlink: actionMethodId,
                value: message._id,
                message,
            });
            return;
        }
        const actionLink = (_a = message.actionLinks) === null || _a === void 0 ? void 0 : _a.find((action) => action.method_id === actionMethodId);
        if (!actionLink) {
            throw new meteor_1.Meteor.Error('error-invalid-actionlink', 'Invalid action link');
        }
        if (!exports.actionLinks.actions.has(actionLink.method_id)) {
            throw new meteor_1.Meteor.Error('error-invalid-actionlink', 'Invalid action link');
        }
        const fn = exports.actionLinks.actions.get(actionLink.method_id);
        fn === null || fn === void 0 ? void 0 : fn(message, actionLink.params);
    },
};
