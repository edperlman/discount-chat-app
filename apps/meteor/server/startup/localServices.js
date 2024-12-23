"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_services_1 = require("@rocket.chat/core-services");
const streamer_module_1 = require("../modules/streamer/streamer.module");
const broker = new core_services_1.LocalBroker();
broker.onBroadcast((eventName, args) => {
    streamer_module_1.StreamerCentral.emit('broadcast', 'local', 'broadcast', [{ eventName, args }]);
});
core_services_1.api.setBroker(broker);
void core_services_1.api.start();
