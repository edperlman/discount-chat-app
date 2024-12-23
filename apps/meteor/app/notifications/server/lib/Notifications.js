"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_services_1 = require("@rocket.chat/core-services");
const ddp_common_1 = require("meteor/ddp-common");
const meteor_1 = require("meteor/meteor");
const notifications_module_1 = require("../../../../server/modules/notifications/notifications.module");
const streamer_module_1 = require("../../../../server/modules/streamer/streamer.module");
require("./Presence");
class Stream extends streamer_module_1.Streamer {
    registerPublication(name, fn) {
        meteor_1.Meteor.publish(name, function (eventName, options) {
            return fn.call(this, eventName, options);
        });
    }
    registerMethod(methods) {
        meteor_1.Meteor.methods(methods);
    }
    changedPayload(collection, id, fields) {
        return ddp_common_1.DDPCommon.stringifyDDP({
            msg: 'changed',
            collection,
            id,
            fields,
        });
    }
}
const notifications = new notifications_module_1.NotificationsModule(Stream);
notifications.configure();
notifications.streamLocal.on('broadcast', ({ eventName, args }) => {
    void core_services_1.api.broadcastLocal(eventName, ...args);
});
exports.default = notifications;
