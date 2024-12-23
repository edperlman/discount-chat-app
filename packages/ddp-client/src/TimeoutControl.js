"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeoutControl = void 0;
const emitter_1 = require("@rocket.chat/emitter");
class TimeoutControl extends emitter_1.Emitter {
    constructor(timeout = 60000, heartbeat = timeout / 2) {
        super();
        this.timeout = timeout;
        this.heartbeat = heartbeat;
        /* istanbul ignore next */
        if (this.heartbeat >= this.timeout) {
            throw new Error('Heartbeat must be less than timeout');
        }
    }
    reset() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        if (this.heartbeatId) {
            clearTimeout(this.heartbeatId);
        }
        this.timeoutId = setTimeout(() => this.emit('timeout'), this.timeout);
        this.heartbeatId = setTimeout(() => this.emit('heartbeat'), this.heartbeat);
    }
    stop() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        if (this.heartbeatId) {
            clearTimeout(this.heartbeatId);
        }
    }
    static create(ddp, connection, timeout, heartbeat) {
        const timeoutControl = new TimeoutControl(timeout, heartbeat);
        timeoutControl.on('heartbeat', () => {
            ddp.ping();
        });
        timeoutControl.on('timeout', () => {
            connection.close();
        });
        ddp.onMessage(() => timeoutControl.reset());
        connection.on('close', () => {
            timeoutControl.stop();
        });
        connection.on('disconnected', () => {
            timeoutControl.stop();
        });
        connection.on('connected', () => {
            timeoutControl.reset();
        });
        return timeoutControl;
    }
}
exports.TimeoutControl = TimeoutControl;
