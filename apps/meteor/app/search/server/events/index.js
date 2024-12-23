"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchEventService = void 0;
const callbacks_1 = require("../../../../lib/callbacks");
const server_1 = require("../../../settings/server");
const service_1 = require("../service");
const EventService_1 = require("./EventService");
exports.searchEventService = new EventService_1.EventService();
/**
 * Listen to message changes via Hooks
 */
function afterSaveMessage(m) {
    exports.searchEventService.promoteEvent('message.save', m._id, m);
    return m;
}
function afterDeleteMessage(m) {
    exports.searchEventService.promoteEvent('message.delete', m._id);
    return m;
}
server_1.settings.watch('Search.Provider', () => {
    var _a;
    if ((_a = service_1.searchProviderService.activeProvider) === null || _a === void 0 ? void 0 : _a.on) {
        callbacks_1.callbacks.add('afterSaveMessage', afterSaveMessage, callbacks_1.callbacks.priority.MEDIUM, 'search-events');
        callbacks_1.callbacks.add('afterDeleteMessage', afterDeleteMessage, callbacks_1.callbacks.priority.MEDIUM, 'search-events-delete');
        return;
    }
    callbacks_1.callbacks.remove('afterSaveMessage', 'search-events');
    callbacks_1.callbacks.remove('afterDeleteMessage', 'search-events-delete');
});
