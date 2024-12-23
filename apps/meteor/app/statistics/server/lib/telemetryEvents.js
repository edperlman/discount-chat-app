"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TelemetryEvent {
    constructor() {
        this.events = new Map();
    }
    register(name, fn) {
        this.events.set(name, fn);
    }
    call(eventName, data) {
        const fn = this.events.get(eventName);
        if (!fn) {
            throw new Error('event not found');
        }
        return fn(data);
    }
}
const telemetryEvent = new TelemetryEvent();
exports.default = telemetryEvent;
