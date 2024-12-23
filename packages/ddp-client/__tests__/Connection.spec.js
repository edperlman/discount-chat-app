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
const jest_websocket_mock_1 = __importDefault(require("jest-websocket-mock"));
const helpers_1 = require("./helpers");
const Connection_1 = require("../src/Connection");
const MinimalDDPClient_1 = require("../src/MinimalDDPClient");
let server;
beforeEach(() => {
    server = new jest_websocket_mock_1.default('ws://localhost:1234/websocket');
});
afterEach(() => {
    server.close();
    jest_websocket_mock_1.default.clean();
    jest.useRealTimers();
});
it('should connect', () => __awaiter(void 0, void 0, void 0, function* () {
    const client = new MinimalDDPClient_1.MinimalDDPClient();
    const connection = new Connection_1.ConnectionImpl('ws://localhost:1234', WebSocket, client, { retryCount: 0, retryTime: 0 });
    expect(connection.status).toBe('idle');
    expect(connection.session).toBeUndefined();
    yield (0, helpers_1.handleConnection)(server, connection.connect());
    expect(connection.session).toBe('session');
    expect(connection.status).toBe('connected');
}));
it('should handle a failing connection', () => __awaiter(void 0, void 0, void 0, function* () {
    const client = new MinimalDDPClient_1.MinimalDDPClient();
    const connection = new Connection_1.ConnectionImpl('ws://localhost:1234', WebSocket, client, { retryCount: 0, retryTime: 0 });
    expect(connection.status).toBe('idle');
    expect(connection.session).toBeUndefined();
    yield expect((0, helpers_1.handleConnectionAndRejects)(server, connection.connect())).rejects.toBe('1');
    expect(connection.session).toBeUndefined();
    expect(connection.status).toBe('failed');
}));
it('should trigger a disconnect callback', () => __awaiter(void 0, void 0, void 0, function* () {
    const client = new MinimalDDPClient_1.MinimalDDPClient();
    const connection = Connection_1.ConnectionImpl.create('ws://localhost:1234', globalThis.WebSocket, client, { retryCount: 0, retryTime: 0 });
    expect(connection.status).toBe('idle');
    expect(connection.session).toBeUndefined();
    const disconnectCallback = jest.fn();
    connection.on('connection', disconnectCallback);
    yield (0, helpers_1.handleConnection)(server, connection.connect());
    expect(disconnectCallback).toHaveBeenNthCalledWith(1, 'connecting');
    expect(disconnectCallback).toHaveBeenNthCalledWith(2, 'connected');
    expect(disconnectCallback).toBeCalledTimes(2);
    server.close();
    expect(disconnectCallback).toBeCalledTimes(3);
    expect(disconnectCallback).toHaveBeenNthCalledWith(3, 'disconnected');
    expect(connection.status).toBe('disconnected');
}));
it('should handle the close method', () => __awaiter(void 0, void 0, void 0, function* () {
    const client = new MinimalDDPClient_1.MinimalDDPClient();
    const connection = Connection_1.ConnectionImpl.create('ws://localhost:1234', globalThis.WebSocket, client, {
        retryCount: 0,
        retryTime: 0,
    });
    server.nextMessage.then((message) => {
        expect(message).toBe('{"msg":"connect","version":"1","support":["1","pre2","pre1"]}');
        server.send('{"msg":"connected","session":"123"}');
    });
    expect(connection.status).toBe('idle');
    expect(connection.session).toBeUndefined();
    yield expect(connection.connect()).resolves.toBe(true);
    expect(connection.session).toBe('123');
    expect(connection.status).toBe('connected');
    connection.close();
    expect(connection.status).toBe('closed');
}));
it('should handle reconnecting', () => __awaiter(void 0, void 0, void 0, function* () {
    const client = new MinimalDDPClient_1.MinimalDDPClient();
    const connection = Connection_1.ConnectionImpl.create('ws://localhost:1234', WebSocket, client, { retryCount: 1, retryTime: 100 });
    expect(connection.status).toBe('idle');
    expect(connection.session).toBeUndefined();
    yield (0, helpers_1.handleConnection)(server, connection.connect());
    expect(connection.session).toBe('session');
    expect(connection.status).toBe('connected');
    // Fake timers are used to avoid waiting for the reconnect timeout
    jest.useFakeTimers();
    server.close();
    jest_websocket_mock_1.default.clean();
    server = new jest_websocket_mock_1.default('ws://localhost:1234/websocket');
    expect(connection.status).toBe('disconnected');
    yield (0, helpers_1.handleConnection)(server, jest.advanceTimersByTimeAsync(200), new Promise((resolve) => connection.once('reconnecting', () => resolve(undefined))), new Promise((resolve) => connection.once('connection', (data) => resolve(data))));
    expect(connection.status).toBe('connected');
    jest.useRealTimers();
}));
it('should queue messages if the connection is not ready', () => __awaiter(void 0, void 0, void 0, function* () {
    const client = new MinimalDDPClient_1.MinimalDDPClient();
    const connection = Connection_1.ConnectionImpl.create('ws://localhost:1234', globalThis.WebSocket, client, { retryCount: 0, retryTime: 0 });
    yield (0, helpers_1.handleConnection)(server, connection.connect());
    connection.close();
    expect(connection.status).toBe('closed');
    client.emit('send', { msg: 'method', method: 'method', params: ['arg1', 'arg2'], id: '1' });
    expect(connection.queue.size).toBe(1);
    yield (0, helpers_1.handleConnection)(server, connection.reconnect());
    expect(connection.queue.size).toBe(0);
    yield (0, helpers_1.handleMethod)(server, 'method', ['arg1', 'arg2'], '1');
}));
it('should throw an error if a reconnect is called while a connection is in progress', () => __awaiter(void 0, void 0, void 0, function* () {
    const client = new MinimalDDPClient_1.MinimalDDPClient();
    const connection = Connection_1.ConnectionImpl.create('ws://localhost:1234', globalThis.WebSocket, client, { retryCount: 0, retryTime: 0 });
    yield (0, helpers_1.handleConnection)(server, connection.connect());
    yield expect(connection.reconnect()).rejects.toThrow('Connection in progress');
}));
it('should throw an error if a connect is called while a connection is in progress', () => __awaiter(void 0, void 0, void 0, function* () {
    const client = new MinimalDDPClient_1.MinimalDDPClient();
    const connection = Connection_1.ConnectionImpl.create('ws://localhost:1234', globalThis.WebSocket, client, { retryCount: 0, retryTime: 0 });
    yield (0, helpers_1.handleConnection)(server, connection.connect());
    yield expect(connection.connect()).rejects.toThrow('Connection in progress');
}));
