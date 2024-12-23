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
exports.fireStreamAdded = exports.fireStreamRemove = exports.fireStreamChange = exports.fireStream = exports.handleSubscription = exports.handleMethod = exports.handleConnectionAndRejects = exports.handleConnection = void 0;
const acceptConnection = (server) => __awaiter(void 0, void 0, void 0, function* () {
    yield server.nextMessage.then((message) => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(message).toBe('{"msg":"connect","version":"1","support":["1","pre2","pre1"]}');
        server.send(`{"msg":"connected","session":"session"}`);
    }));
});
const handleConnection = (server, ...client) => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all([acceptConnection(server), ...client]);
});
exports.handleConnection = handleConnection;
const handleConnectionAndRejects = (server, ...client) => __awaiter(void 0, void 0, void 0, function* () {
    const suggestedVersion = '1';
    return Promise.all([
        server.nextMessage.then((message) => {
            expect(message).toBe('{"msg":"connect","version":"1","support":["1","pre2","pre1"]}');
            return server.send(`{"msg":"failed","version":"${suggestedVersion}"}`);
        }),
        ...client,
    ]);
});
exports.handleConnectionAndRejects = handleConnectionAndRejects;
const handleConnectionButNoResponse = (server, method, params) => __awaiter(void 0, void 0, void 0, function* () {
    return server.nextMessage.then((msg) => __awaiter(void 0, void 0, void 0, function* () {
        if (typeof msg !== 'string')
            throw new Error('Expected message to be a string');
        const message = JSON.parse(msg);
        yield expect(message).toMatchObject({
            msg: 'method',
            method,
            params,
        });
        return message;
    }));
});
const handleMethod = (server, method, params, responseResult, ...client) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield handleConnectionButNoResponse(server, method, params);
    return Promise.all([server.send(`{"msg":"result","id":"${result.id}","result":${responseResult}}`), ...client]).then((result) => {
        result.shift();
        return result;
    });
});
exports.handleMethod = handleMethod;
const handleSubscription = (server, id, streamName, streamParams) => __awaiter(void 0, void 0, void 0, function* () {
    yield server.nextMessage.then((message) => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(message).toBe(`{"msg":"sub","id":"${id}","name":"stream-${streamName}","params":["${streamParams}",{"useCollection":false,"args":[null]}]}`);
        server.send(`{"msg":"ready","subs":["${id}"]}`);
    }));
});
exports.handleSubscription = handleSubscription;
const fireStream = (action) => {
    return (server, streamName, streamParams) => {
        return server.send(`{"msg":"${action}","collection":"stream-${streamName}","id":"id","fields":{"eventName":"${streamParams}", "args":[1]}}`);
    };
};
exports.fireStream = fireStream;
exports.fireStreamChange = (0, exports.fireStream)('changed');
exports.fireStreamRemove = (0, exports.fireStream)('removed');
exports.fireStreamAdded = (0, exports.fireStream)('added');
