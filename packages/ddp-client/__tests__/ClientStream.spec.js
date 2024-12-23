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
const ClientStream_1 = require("../src/ClientStream");
const DDPDispatcher_1 = require("../src/DDPDispatcher");
const MinimalDDPClient_1 = require("../src/MinimalDDPClient");
describe('call procedures', () => {
    it('should be able to call a method and receive a result', () => __awaiter(void 0, void 0, void 0, function* () {
        const callback = jest.fn();
        const ws = new DDPDispatcher_1.DDPDispatcher();
        const client = new ClientStream_1.ClientStreamImpl(ws);
        const id = client.call('test', callback);
        ws.handleMessage(JSON.stringify({
            msg: 'result',
            result: ['arg1', 'arg2'],
            id,
        }));
        expect(callback).toBeCalledTimes(1);
        expect(callback).toBeCalledWith(null, ['arg1', 'arg2']);
    }));
    it('should be able to handle errors thrown by the method call', () => __awaiter(void 0, void 0, void 0, function* () {
        const callback = jest.fn();
        const ws = new MinimalDDPClient_1.MinimalDDPClient(() => undefined);
        const client = new ClientStream_1.ClientStreamImpl(ws);
        const id = client.call('test', callback);
        ws.handleMessage(JSON.stringify({
            msg: 'result',
            error: {
                error: 400,
                reason: 'Bad Request',
                message: 'Bad Request [400]',
                errorType: 'Meteor.Error',
            },
            id,
        }));
        expect(callback).toBeCalledTimes(1);
        expect(callback).toBeCalledWith({
            error: 400,
            reason: 'Bad Request',
            message: 'Bad Request [400]',
            errorType: 'Meteor.Error',
        });
    }));
    it('should be able to callAsync a method and receive a result', () => __awaiter(void 0, void 0, void 0, function* () {
        const ws = new MinimalDDPClient_1.MinimalDDPClient(() => undefined);
        const client = new ClientStream_1.ClientStreamImpl(ws);
        const promise = client.callAsync('test');
        ws.handleMessage(JSON.stringify({
            msg: 'result',
            result: ['arg1', 'arg2'],
            id: promise.id,
        }));
        const result = yield promise;
        expect(result).toEqual(['arg1', 'arg2']);
    }));
    it('should be able to callAsync a method and receive an error', () => __awaiter(void 0, void 0, void 0, function* () {
        const ws = new MinimalDDPClient_1.MinimalDDPClient(() => undefined);
        const client = new ClientStream_1.ClientStreamImpl(ws);
        const promise = client.callAsync('test');
        ws.handleMessage(JSON.stringify({
            msg: 'result',
            error: {
                error: 400,
                reason: 'Bad Request',
                message: 'Bad Request [400]',
                errorType: 'Meteor.Error',
            },
            id: promise.id,
        }));
        yield expect(promise).rejects.toEqual({
            error: 400,
            reason: 'Bad Request',
            message: 'Bad Request [400]',
            errorType: 'Meteor.Error',
        });
    }));
    it('should only call the further methods after the previous one has been resolved respecting the wait option', () => __awaiter(void 0, void 0, void 0, function* () {
        const fn = jest.fn();
        const dispatch = jest.fn();
        const ws = new DDPDispatcher_1.DDPDispatcher();
        const client = new ClientStream_1.ClientStreamImpl(ws);
        client.dispatcher.on('send', dispatch);
        const call = client.callWithOptions('wait 1', { wait: true }, fn);
        expect(client.dispatcher.queue.length).toBe(1);
        const callNoWait = client.call('no wait', fn);
        expect(client.dispatcher.queue.length).toBe(2);
        const call2 = client.callWithOptions('wait 2', { wait: true }, fn);
        expect(client.dispatcher.queue.length).toBe(3);
        expect(dispatch).toBeCalledTimes(1);
        expect(fn).toBeCalledTimes(0);
        ws.handleMessage(JSON.stringify({
            msg: 'result',
            result: ['arg1', 'arg2'],
            id: call,
        }));
        expect(dispatch).toBeCalledTimes(3);
        expect(fn).toBeCalledTimes(1);
        ws.handleMessage(JSON.stringify({
            msg: 'result',
            result: ['arg1', 'arg2'],
            id: call2,
        }));
        expect(fn).toBeCalledTimes(2);
        ws.handleMessage(JSON.stringify({
            msg: 'result',
            result: ['arg1', 'arg2'],
            id: callNoWait,
        }));
        expect(fn).toBeCalledTimes(3);
    }));
});
describe('subscribe procedures', () => {
    it('should be able to subscribe to a collection and receive a result', () => __awaiter(void 0, void 0, void 0, function* () {
        const ws = new MinimalDDPClient_1.MinimalDDPClient(() => undefined);
        const client = new ClientStream_1.ClientStreamImpl(ws);
        const subscription = client.subscribe('test');
        ws.handleMessage(JSON.stringify({
            msg: 'ready',
            subs: [subscription.id],
        }));
        yield expect(subscription.ready()).resolves.toBeUndefined();
    }));
    it('should be able to subscribe to a collection and receive an error', () => __awaiter(void 0, void 0, void 0, function* () {
        const ws = new MinimalDDPClient_1.MinimalDDPClient(() => undefined);
        const client = new ClientStream_1.ClientStreamImpl(ws);
        const subscription = client.subscribe('test');
        ws.handleMessage(JSON.stringify({
            msg: 'nosub',
            error: {
                error: 400,
                reason: 'Bad Request',
                message: 'Bad Request [400]',
                errorType: 'Meteor.Error',
            },
            id: subscription.id,
        }));
        yield expect(subscription.ready()).rejects.toEqual({
            error: 400,
            reason: 'Bad Request',
            message: 'Bad Request [400]',
            errorType: 'Meteor.Error',
        });
    }));
    it('should be able to unsubscribe from a collection', () => __awaiter(void 0, void 0, void 0, function* () {
        const ws = new MinimalDDPClient_1.MinimalDDPClient(() => undefined);
        const client = new ClientStream_1.ClientStreamImpl(ws);
        const subscription = client.subscribe('test');
        ws.handleMessage(JSON.stringify({
            msg: 'ready',
            subs: [subscription.id],
        }));
        yield expect(subscription.ready()).resolves.toBeUndefined();
        const unsubPromise = client.unsubscribe(subscription.id);
        ws.handleMessage(JSON.stringify({
            msg: 'nosub',
            id: subscription.id,
        }));
        expect(unsubPromise).resolves.toEqual({
            msg: 'nosub',
            id: subscription.id,
        });
    }));
    it('should subscribe to a collection and receive values through the observer', () => __awaiter(void 0, void 0, void 0, function* () {
        const ws = new MinimalDDPClient_1.MinimalDDPClient(() => undefined);
        const client = new ClientStream_1.ClientStreamImpl(ws);
        const promise = client.subscribe('test');
        ws.handleMessage(JSON.stringify({
            msg: 'ready',
            subs: [promise.id],
        }));
        yield expect(promise.ready()).resolves.toBeUndefined();
        const observer = jest.fn();
        client.onCollection('test', observer);
        ws.handleMessage(JSON.stringify({
            msg: 'added',
            collection: 'test',
            id: '1',
            fields: {
                name: 'test',
            },
        }));
        expect(observer).toBeCalledTimes(1);
        expect(observer).toBeCalledWith({
            msg: 'added',
            collection: 'test',
            id: '1',
            fields: {
                name: 'test',
            },
        });
    }));
});
describe('connect procedure', () => {
    it('should be able to connect to a server', () => __awaiter(void 0, void 0, void 0, function* () {
        const ws = new MinimalDDPClient_1.MinimalDDPClient(() => undefined);
        const client = new ClientStream_1.ClientStreamImpl(ws);
        const promise = client.connect();
        ws.handleMessage(JSON.stringify({
            msg: 'connected',
            session: 'test',
        }));
        yield expect(promise).resolves.toEqual({
            msg: 'connected',
            session: 'test',
        });
    }));
});
