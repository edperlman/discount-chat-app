"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DDPSDK = void 0;
const api_client_1 = require("@rocket.chat/api-client");
const ClientStream_1 = require("./ClientStream");
const Connection_1 = require("./Connection");
const DDPDispatcher_1 = require("./DDPDispatcher");
const TimeoutControl_1 = require("./TimeoutControl");
const Account_1 = require("./types/Account");
const isValidPayload = (data) => {
    if (typeof data !== 'object' && (data !== null || data !== undefined)) {
        return false;
    }
    return true;
};
class DDPSDK {
    constructor(connection, client, account, timeoutControl, rest) {
        this.connection = connection;
        this.client = client;
        this.account = account;
        this.timeoutControl = timeoutControl;
        this.rest = rest;
    }
    call(method, ...params) {
        return this.client.callAsync(method, ...params);
    }
    stream(name, data, cb) {
        const [key, args] = Array.isArray(data) ? data : [data];
        const subscription = this.client.subscribe(`stream-${name}`, key, { useCollection: false, args: [args] });
        const stop = subscription.stop.bind(subscription);
        const cancel = [
            () => stop(),
            this.client.onCollection(`stream-${name}`, (data) => {
                if (!isValidPayload(data)) {
                    return;
                }
                if (data.collection !== `stream-${name}`) {
                    return;
                }
                if (data.msg !== 'changed') {
                    return;
                }
                if (data.fields.eventName === key) {
                    cb(...data.fields.args);
                }
            }),
        ];
        return Object.assign(subscription, {
            stop: () => {
                cancel.forEach((fn) => fn());
            },
        });
    }
    /**
     * Compounds the Objects responsible for the SDK and returns it through
     * SDK interface
     *
     * @param url - The URL of the server to connect to
     * @param retryOptions - The options for the retry strategy of the connection
     * @param retryOptions.retryCount - The number of times to retry the connection
     * @param retryOptions.retryTime - The time to wait between retries
     * @returns The SDK interface
     *
     * @example
     * ```ts
     * const sdk = DDPSDK.create('wss://open.rocket.chat/websocket');
     * sdk.connection.connect();
     * ```
     */
    static create(url, retryOptions = { retryCount: 1, retryTime: 100 }) {
        const ddp = new DDPDispatcher_1.DDPDispatcher();
        const connection = Connection_1.ConnectionImpl.create(url, WebSocket, ddp, retryOptions);
        const stream = new ClientStream_1.ClientStreamImpl(ddp, ddp);
        const account = new Account_1.AccountImpl(stream);
        const timeoutControl = TimeoutControl_1.TimeoutControl.create(ddp, connection);
        const rest = new (class RestApiClient extends api_client_1.RestClient {
            getCredentials() {
                var _a;
                if (!account.uid || !((_a = account.user) === null || _a === void 0 ? void 0 : _a.token)) {
                    return;
                }
                return {
                    'X-User-Id': account.uid,
                    'X-Auth-Token': account.user.token,
                };
            }
        })({ baseUrl: url });
        const sdk = new DDPSDK(connection, stream, account, timeoutControl, rest);
        connection.on('connected', () => {
            var _a;
            if ((_a = account.user) === null || _a === void 0 ? void 0 : _a.token) {
                account.loginWithToken(account.user.token);
            }
            [...stream.subscriptions.entries()].forEach(([, sub]) => {
                ddp.subscribeWithId(sub.id, sub.name, sub.params);
            });
        });
        return sdk;
    }
    /**
     * Same as `DDPSDK.create`, but also connects to the server and waits for the connection to be established
     * @param url - The URL of the server to connect to
     * @param retryOptions - The options for the retry strategy of the connection
     * @param retryOptions.retryCount - The number of times to retry the connection
     * @param retryOptions.retryTime - The time to wait between retries
     * @returns A promise that resolves to the SDK interface
     * @example
     * ```ts
     * const sdk = await DDPSDK.createAndConnect('wss://open.rocket.chat/websocket');
     * ```
     */
    static createAndConnect(url_1) {
        return __awaiter(this, arguments, void 0, function* (url, retryOptions = { retryCount: 1, retryTime: 100 }) {
            const sdk = DDPSDK.create(url, retryOptions);
            yield sdk.connection.connect();
            return sdk;
        });
    }
}
exports.DDPSDK = DDPSDK;
