"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fireGlobalEvent = void 0;
const tracker_1 = require("meteor/tracker");
const client_1 = require("../../../app/settings/client");
const fireGlobalEvent = (eventName, detail) => {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
    tracker_1.Tracker.autorun((computation) => {
        const enabled = client_1.settings.get('Iframe_Integration_send_enable');
        if (enabled === undefined) {
            return;
        }
        computation.stop();
        if (enabled) {
            parent.postMessage({
                eventName,
                data: detail,
            }, client_1.settings.get('Iframe_Integration_send_target_origin'));
        }
    });
};
exports.fireGlobalEvent = fireGlobalEvent;
