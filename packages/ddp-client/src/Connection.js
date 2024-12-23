"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionImpl = void 0;
const emitter_1 = require("@rocket.chat/emitter");
class ConnectionImpl extends emitter_1.Emitter {
    constructor(url, WS, client, retryOptions = { retryCount: 0, retryTime: 1000 }) {
        super();
        this.WS = WS;
        this.client = client;
        this.retryOptions = retryOptions;
        this.status = 'idle';
        this.retryCount = 0;
        this.queue = new Set();
        this.ssl = url.startsWith('https') || url.startsWith('wss');
        this.url = url.replace(/^https?:\/\//, '').replace(/^wss?:\/\//, '');
        this.client.onDispatchMessage((message) => {
            if (this.ws && this.ws.readyState === this.ws.OPEN) {
                this.ws.send(message);
                return;
            }
            this.queue.add(message);
        });
        this.on('connected', () => {
            this.queue.forEach((message) => {
                var _a;
                (_a = this.ws) === null || _a === void 0 ? void 0 : _a.send(message);
            });
            this.queue.clear();
        });
    }
    emitStatus() {
        this.emit('connection', this.status);
    }
    reconnect() {
        if (this.status === 'connecting' || this.status === 'connected') {
            return Promise.reject(new Error('Connection in progress'));
        }
        clearTimeout(this.retryOptions.retryTimer);
        this.emit('reconnecting');
        this.emit('connection', 'reconnecting');
        return this.connect();
    }
    connect() {
        if (this.status === 'connecting' || this.status === 'connected') {
            return Promise.reject(new Error('Connection in progress'));
        }
        this.status = 'connecting';
        this.emit('connecting');
        this.emitStatus();
        const ws = new this.WS(`${this.ssl ? 'wss://' : 'ws://'}${this.url}/websocket`);
        this.ws = ws;
        return new Promise((resolve, reject) => {
            ws.onopen = () => {
                ws.onmessage = (event) => {
                    this.client.handleMessage(String(event.data));
                };
                // The server may send an initial message which is a JSON object lacking a msg key. If so, the client should ignore it. The client does not have to wait for this message.
                // (The message was once used to help implement Meteor's hot code reload feature; it is now only included to force old clients to update).
                // this.client.onceMessage((data) => {
                // 	if (data.msg === undefined) {
                // 		return;
                // 	}
                // 	if (data.msg === 'failed') {
                // 		return;
                // 	}
                // 	if (data.msg === 'connected') {
                // 		return;
                // 	}
                // 	this.close();
                // });
                // The client sends a connect message.
                this.client.connect();
                // If the server is willing to speak the version of the protocol specified in the connect message, it sends back a connected message.
                // Otherwise the server sends back a failed message with a version of DDP it would rather speak, informed by the connect message's support field, and closes the underlying transport.
                this.client.onConnection((payload) => {
                    if (payload.msg === 'connected') {
                        this.status = 'connected';
                        this.emitStatus();
                        this.emit('connected', payload.session);
                        this.session = payload.session;
                        return resolve(true);
                    }
                    if (payload.msg === 'failed') {
                        this.status = 'failed';
                        this.emitStatus();
                        this.emit('disconnected');
                        return reject(payload.version);
                    }
                    /* istanbul ignore next */
                    reject(new Error('Unknown message type'));
                });
            };
            ws.onclose = () => {
                clearTimeout(this.retryOptions.retryTimer);
                if (this.status === 'closed') {
                    return;
                }
                this.status = 'disconnected';
                this.emitStatus();
                this.emit('disconnected');
                if (this.retryCount >= this.retryOptions.retryCount) {
                    return;
                }
                this.retryCount += 1;
                this.retryOptions.retryTimer = setTimeout(() => {
                    this.reconnect();
                }, this.retryOptions.retryTime * this.retryCount);
            };
        });
    }
    close() {
        var _a;
        this.status = 'closed';
        (_a = this.ws) === null || _a === void 0 ? void 0 : _a.close();
        this.emitStatus();
    }
    static create(url, webSocketImpl, client, retryOptions = { retryCount: 0, retryTime: 1000 }) {
        return new ConnectionImpl(url, webSocketImpl, client, retryOptions);
    }
}
exports.ConnectionImpl = ConnectionImpl;
