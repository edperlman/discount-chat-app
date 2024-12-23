"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinimalDDPClient = void 0;
const emitter_1 = require("@rocket.chat/emitter");
/**
 * Creates a unique id for a DDP client.
 * @returns {string} - A unique id for a DDP client.
 */
const getUniqueId = (() => {
    let id = 0;
    return () => `rc-ddp-client-${++id}`;
})();
const SUPPORTED_DDP_VERSIONS = ['1', 'pre2', 'pre1'];
/**
 * This class was created to be used together with the `WebSocket` class.
 * It is responsible for low-level communication with the server.
 * It is responsible for sending and receiving messages.
 * It does not provide any procedures for connecting or reconnecting.
 * It does not provide any procedure to handle collections.
 * @example
 * ```ts
 * const socket = new WebSocket('ws://localhost:3000/websocket');
 * const ddp = new MinimalDDPClient(socket.send.bind(socket));
 * ddp.on('message', (data) => {
 *  console.log('Received message', data);
 * });
 * socket.onmessage = ({ data }) => {
 * ddp.handleMessage(data);
 * };
 * ```
 */
class MinimalDDPClient extends emitter_1.Emitter {
    constructor(send, encode = JSON.stringify, decode = JSON.parse) {
        super();
        this.encode = encode;
        this.decode = decode;
        if (send) {
            this.onDispatchMessage(send);
        }
    }
    /**
     * @remarks
     * if the received message is a valid DDP message, it will be emitted as an event.
     *
     * @param payload - The incoming message as a string.
     * @throws {Error} - If the message is not a string.
     * @throws {Error} - If the message is not a valid JSON.
     */
    handleMessage(payload) {
        const data = this.decode(payload);
        Object.freeze(data);
        switch (data.msg) {
            case 'ping':
                this.pong(data.id);
                break;
            case 'pong':
                this.emit('pong', data);
                break;
            // Streamer related messages
            case 'nosub':
                this.emit(`publication/${data.id}`, data);
                this.emit(`nosub/${data.id}`, data);
                break;
            case 'ready':
                data.subs.forEach((id) => {
                    // 	this.emit(`publication/${id}`, { msg: 'ready', id });
                    this.emit(`publication/${id}`, { msg: 'ready', subs: [id] });
                });
                break;
            case 'added':
            case 'changed':
            case 'removed':
                this.emit(`collection/${data.collection}`, data);
                break;
            // DDP/RCP related messages
            case 'result':
                this.emit(`result/${data.id}`, data);
                break;
            case 'updated':
                data.methods.forEach((id) => {
                    this.emit(`updated/${id}`, data);
                });
                break;
            case 'connected':
            case 'failed':
                this.emit('connection', data);
                break;
        }
        this.emit('message', data);
    }
    onDispatchMessage(callback) {
        return this.on('send', (payload) => {
            callback(this.encode(payload));
        });
    }
    dispatch(payload) {
        this.emit('send', payload);
    }
    call(method, params = []) {
        const id = getUniqueId();
        const payload = {
            msg: 'method',
            method,
            params,
            id,
        };
        return payload;
    }
    subscribe(name, params) {
        const id = getUniqueId();
        return this.subscribeWithId(id, name, params);
    }
    subscribeWithId(id, name, params) {
        const payload = {
            msg: 'sub',
            id,
            name,
            params,
        };
        this.dispatch(payload);
        return id;
    }
    unsubscribe(id) {
        const payload = {
            msg: 'unsub',
            id,
        };
        this.dispatch(payload);
    }
    connect() {
        const payload = {
            msg: 'connect',
            version: '1',
            support: SUPPORTED_DDP_VERSIONS,
        };
        this.dispatch(payload);
    }
    onPublish(name, callback) {
        return this.once(`publication/${name}`, callback);
    }
    onResult(id, callback) {
        return this.once(`result/${id}`, callback);
    }
    onUpdate(id, callback) {
        return this.on(`updated/${id}`, callback);
    }
    onNoSub(id, callback) {
        return this.once(`nosub/${id}`, callback);
    }
    onCollection(name, callback) {
        return this.on(`collection/${name}`, callback);
    }
    onConnection(callback) {
        return this.once('connection', callback);
    }
    onceMessage(callback) {
        return this.once('message', callback);
    }
    onMessage(callback) {
        return this.on('message', callback);
    }
    ping(id) {
        this.dispatch(Object.assign({ msg: 'ping' }, (id && { id })));
    }
    pong(id) {
        this.dispatch(Object.assign({ msg: 'pong' }, (id && { id })));
    }
}
exports.MinimalDDPClient = MinimalDDPClient;
