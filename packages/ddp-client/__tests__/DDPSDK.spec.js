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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
/* eslint-disable no-debugger */
const util_1 = __importDefault(require("util"));
const jest_websocket_mock_1 = __importDefault(require("jest-websocket-mock"));
const ws_1 = require("ws");
const helpers_1 = require("./helpers");
const DDPSDK_1 = require("../src/DDPSDK");
global.WebSocket = global.WebSocket || ws_1.WebSocket;
const callXTimes = (fn, times) => {
    return ((...args) => __awaiter(void 0, void 0, void 0, function* () {
        const methods = [].concat(...Array(times));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const _ of methods) {
            // eslint-disable-next-line no-await-in-loop
            yield fn(...args);
        }
    }));
};
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    exports.server = new jest_websocket_mock_1.default('ws://localhost:1234/websocket');
}));
afterEach(() => {
    exports.server.close();
    jest_websocket_mock_1.default.clean();
    jest.useRealTimers();
});
it('should handle a stream of messages', () => __awaiter(void 0, void 0, void 0, function* () {
    const cb = jest.fn();
    const streamName = 'stream';
    const streamParams = '123';
    const sdk = DDPSDK_1.DDPSDK.create('ws://localhost:1234');
    yield (0, helpers_1.handleConnection)(exports.server, sdk.connection.connect());
    const stream = sdk.stream(streamName, streamParams, cb);
    yield (0, helpers_1.handleSubscription)(exports.server, stream.id, streamName, streamParams);
    yield stream.ready();
    (0, helpers_1.fireStreamChange)(exports.server, streamName, streamParams);
    (0, helpers_1.fireStreamChange)(exports.server, streamName, streamParams);
    (0, helpers_1.fireStreamChange)(exports.server, streamName, streamParams);
    expect(cb).toBeCalledTimes(3);
    (0, helpers_1.fireStreamChange)(exports.server, streamName, `${streamParams}-another`);
    expect(cb).toBeCalledTimes(3);
    expect(cb).toHaveBeenNthCalledWith(1, 1);
    sdk.connection.close();
}));
it('should ignore messages other from changed', () => __awaiter(void 0, void 0, void 0, function* () {
    const cb = jest.fn();
    const streamName = 'stream';
    const streamParams = '123';
    const sdk = DDPSDK_1.DDPSDK.create('ws://localhost:1234');
    yield (0, helpers_1.handleConnection)(exports.server, sdk.connection.connect());
    const stream = sdk.stream(streamName, streamParams, cb);
    yield (0, helpers_1.handleSubscription)(exports.server, stream.id, streamName, streamParams);
    yield stream.ready();
    (0, helpers_1.fireStreamAdded)(exports.server, streamName, streamParams);
    (0, helpers_1.fireStreamRemove)(exports.server, streamName, streamParams);
    expect(cb).toBeCalledTimes(0);
    sdk.connection.close();
}));
it('should handle streams after reconnect', () => __awaiter(void 0, void 0, void 0, function* () {
    const cb = jest.fn();
    const streamName = 'stream';
    const streamParams = '123';
    const sdk = DDPSDK_1.DDPSDK.create('ws://localhost:1234');
    yield (0, helpers_1.handleConnection)(exports.server, sdk.connection.connect());
    const result = sdk.stream(streamName, streamParams, cb);
    expect(result.isReady).toBe(false);
    expect(sdk.client.subscriptions.size).toBe(1);
    yield (0, helpers_1.handleSubscription)(exports.server, result.id, streamName, streamParams);
    yield result.ready();
    const fire = callXTimes(helpers_1.fireStreamChange, 3);
    yield fire(exports.server, streamName, streamParams);
    expect(cb).toBeCalledTimes(3);
    // Fake timers are used to avoid waiting for the reconnect timeout
    jest.useFakeTimers();
    exports.server.close();
    jest_websocket_mock_1.default.clean();
    exports.server = new jest_websocket_mock_1.default('ws://localhost:1234/websocket');
    const reconnect = new Promise((resolve) => sdk.connection.once('reconnecting', () => resolve(undefined)));
    const connecting = new Promise((resolve) => sdk.connection.once('connecting', () => resolve(undefined)));
    const connected = new Promise((resolve) => sdk.connection.once('connected', () => resolve(undefined)));
    yield (0, helpers_1.handleConnection)(exports.server, jest.advanceTimersByTimeAsync(1000), reconnect, connecting, connected);
    // the client should reconnect and resubscribe
    yield Promise.all([(0, helpers_1.handleSubscription)(exports.server, result.id, streamName, streamParams), jest.advanceTimersByTimeAsync(1000)]);
    fire(exports.server, streamName, streamParams);
    yield jest.advanceTimersByTimeAsync(1000);
    expect(cb).toBeCalledTimes(6);
    jest.useRealTimers();
    sdk.connection.close();
}));
it('should handle an unsubscribe stream after reconnect', () => __awaiter(void 0, void 0, void 0, function* () {
    const cb = jest.fn();
    const streamName = 'stream';
    const streamParams = '123';
    const sdk = DDPSDK_1.DDPSDK.create('ws://localhost:1234');
    yield (0, helpers_1.handleConnection)(exports.server, sdk.connection.connect());
    const subscription = sdk.stream(streamName, streamParams, cb);
    expect(subscription.isReady).toBe(false);
    expect(sdk.client.subscriptions.size).toBe(1);
    yield (0, helpers_1.handleSubscription)(exports.server, subscription.id, streamName, streamParams);
    yield expect(subscription.ready()).resolves.toBe(undefined);
    expect(subscription.isReady).toBe(true);
    (0, helpers_1.fireStreamChange)(exports.server, streamName, streamParams);
    (0, helpers_1.fireStreamChange)(exports.server, streamName, streamParams);
    (0, helpers_1.fireStreamChange)(exports.server, streamName, streamParams);
    expect(cb).toBeCalledTimes(3);
    // Fake timers are used to avoid waiting for the reconnect timeout
    jest.useFakeTimers();
    exports.server.close();
    jest_websocket_mock_1.default.clean();
    exports.server = new jest_websocket_mock_1.default('ws://localhost:1234/websocket');
    const reconnect = new Promise((resolve) => sdk.connection.once('reconnecting', () => resolve(undefined)));
    const connecting = new Promise((resolve) => sdk.connection.once('connecting', () => resolve(undefined)));
    const connected = new Promise((resolve) => sdk.connection.once('connected', () => resolve(undefined)));
    yield (0, helpers_1.handleConnection)(exports.server, jest.advanceTimersByTimeAsync(1000), reconnect, connecting, connected);
    yield (0, helpers_1.handleSubscription)(exports.server, subscription.id, streamName, streamParams);
    expect(subscription.isReady).toBe(true);
    (0, helpers_1.fireStreamChange)(exports.server, streamName, streamParams);
    subscription.stop();
    expect(sdk.client.subscriptions.size).toBe(0);
    (0, helpers_1.fireStreamChange)(exports.server, streamName, streamParams);
    (0, helpers_1.fireStreamChange)(exports.server, streamName, streamParams);
    jest.advanceTimersByTimeAsync(1000);
    expect(cb).toBeCalledTimes(4);
    expect(sdk.client.subscriptions.size).toBe(0);
    jest.useRealTimers();
    sdk.connection.close();
    sdk.connection.close();
}));
it('should create and connect to a stream', () => __awaiter(void 0, void 0, void 0, function* () {
    const promise = DDPSDK_1.DDPSDK.createAndConnect('ws://localhost:1234');
    yield (0, helpers_1.handleConnection)(exports.server, promise);
    const sdk = yield promise;
    sdk.connection.close();
}));
it.skip('should try to loginWithToken after reconnection', () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const sdk = DDPSDK_1.DDPSDK.create('ws://localhost:1234');
    yield (0, helpers_1.handleConnection)(exports.server, sdk.connection.connect());
    const messageResult = {
        id: 123,
        token: 'token1234',
        tokenExpires: { $date: 99999999 },
    };
    const { loginWithToken } = sdk.account;
    const loginFn = jest.fn((token) => loginWithToken.apply(sdk.account, [token]));
    sdk.account.loginWithToken = loginFn;
    yield (0, helpers_1.handleMethod)(exports.server, 'login', [{ resume: 'token' }], JSON.stringify(messageResult), sdk.account.loginWithToken('token'));
    expect((_a = sdk.account.user) === null || _a === void 0 ? void 0 : _a.token).toBe(messageResult.token);
    expect(loginFn).toHaveBeenCalledTimes(1);
    // Fake timers are used to avoid waiting for the reconnect timeout
    jest.useFakeTimers();
    exports.server.close();
    jest_websocket_mock_1.default.clean();
    exports.server = new jest_websocket_mock_1.default('ws://localhost:1234/websocket');
    const reconnect = new Promise((resolve) => sdk.connection.once('reconnecting', () => resolve(undefined)));
    const connecting = new Promise((resolve) => sdk.connection.once('connecting', () => resolve(undefined)));
    const connected = new Promise((resolve) => sdk.connection.once('connected', () => resolve(undefined)));
    yield (0, helpers_1.handleConnection)(exports.server, jest.advanceTimersByTimeAsync(1000), reconnect, connecting, connected);
    jest.advanceTimersByTimeAsync(1000);
    expect(loginFn).toHaveBeenCalledTimes(2);
    jest.useRealTimers();
    sdk.connection.close();
}));
describe('Method call and Disconnection cases', () => {
    it('should handle properly if the message was sent after disconnection', () => __awaiter(void 0, void 0, void 0, function* () {
        const sdk = DDPSDK_1.DDPSDK.create('ws://localhost:1234');
        yield (0, helpers_1.handleConnection)(exports.server, sdk.connection.connect());
        const [result] = yield (0, helpers_1.handleMethod)(exports.server, 'method', ['args1'], '1', sdk.client.callAsync('method', 'args1'));
        expect(result).toBe(1);
        // Fake timers are used to avoid waiting for the reconnect timeout
        jest.useFakeTimers();
        exports.server.close();
        jest_websocket_mock_1.default.clean();
        exports.server = new jest_websocket_mock_1.default('ws://localhost:1234/websocket');
        const reconnect = new Promise((resolve) => sdk.connection.once('reconnecting', () => resolve(undefined)));
        const connecting = new Promise((resolve) => sdk.connection.once('connecting', () => resolve(undefined)));
        const connected = new Promise((resolve) => sdk.connection.once('connected', () => resolve(undefined)));
        const callResult = sdk.client.callAsync('method', 'args2');
        expect(util_1.default.inspect(callResult).includes('pending')).toBe(true);
        yield (0, helpers_1.handleConnection)(exports.server, jest.advanceTimersByTimeAsync(1000), reconnect, connecting, connected);
        const [result2] = yield (0, helpers_1.handleMethod)(exports.server, 'method', ['args2'], '1', callResult);
        expect(util_1.default.inspect(callResult).includes('pending')).toBe(false);
        expect(result2).toBe(1);
        sdk.connection.close();
        jest.useRealTimers();
    }));
    it.skip('should handle properly if the message was sent before disconnection but got disconnected before receiving the response', () => __awaiter(void 0, void 0, void 0, function* () {
        const sdk = DDPSDK_1.DDPSDK.create('ws://localhost:1234');
        yield (0, helpers_1.handleConnection)(exports.server, sdk.connection.connect());
        const callResult = sdk.client.callAsync('method', 'args');
        expect(util_1.default.inspect(callResult).includes('pending')).toBe(true);
        // Fake timers are used to avoid waiting for the reconnect timeout
        jest.useFakeTimers();
        exports.server.close();
        jest_websocket_mock_1.default.clean();
        exports.server = new jest_websocket_mock_1.default('ws://localhost:1234/websocket');
        const reconnect = new Promise((resolve) => sdk.connection.once('reconnecting', () => resolve(undefined)));
        const connecting = new Promise((resolve) => sdk.connection.once('connecting', () => resolve(undefined)));
        const connected = new Promise((resolve) => sdk.connection.once('connected', () => resolve(undefined)));
        yield (0, helpers_1.handleConnection)(exports.server, jest.advanceTimersByTimeAsync(1000), reconnect, connecting, connected);
        expect(util_1.default.inspect(callResult).includes('pending')).toBe(true);
        const [result] = yield (0, helpers_1.handleMethod)(exports.server, 'method', ['args2'], '1', callResult);
        expect(result).toBe(1);
        jest.useRealTimers();
        sdk.connection.close();
    }));
});
