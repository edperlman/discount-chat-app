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
const jest_fetch_mock_1 = __importDefault(require("jest-fetch-mock"));
const index_1 = require("../src/index");
beforeAll(() => {
    jest_fetch_mock_1.default.enableMocks();
});
afterAll(() => {
    jest_fetch_mock_1.default.disableMocks();
});
beforeEach(() => {
    jest_fetch_mock_1.default.mockIf(/^https?:\/\/example.com.*$/, (req) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.headers.get('x-2fa-code') === '2FA_CODE') {
            return {
                status: 200,
                body: JSON.stringify({
                    status: 'success',
                    data: {
                        userId: 'foo',
                        email: 'foo',
                        username: 'foo',
                    },
                }),
            };
        }
        if (req.headers.get('x-2fa-code') === 'WRONG_2FA_CODE') {
            return {
                status: 400,
                body: JSON.stringify({
                    errorType: 'totp-invalid',
                    message: 'Invalid TOTP provided',
                    details: {
                        method: 'totp',
                    },
                }),
            };
        }
        return {
            status: 400,
            body: JSON.stringify({
                errorType: 'totp-required',
                details: {
                    method: 'totp',
                },
            }),
        };
    }));
    jest_fetch_mock_1.default.doMock();
});
const isResponse = (e) => {
    expect(e).toBeInstanceOf(Response);
    return true;
};
test('if the 2fa handler is not provided, it should throw an error', () => __awaiter(void 0, void 0, void 0, function* () {
    const client = new index_1.RestClient({
        baseUrl: 'https://example.com',
    });
    try {
        yield client.post('/v1/login', { user: 'foo', username: 'foo', email: 'foo', password: 'foo', code: 'foo' });
    }
    catch (error) {
        if (!isResponse(error)) {
            throw error;
        }
        expect(error.status).toBe(400);
        const body = yield error.json();
        expect(body).toMatchObject({
            errorType: 'totp-required',
            details: {
                method: 'totp',
            },
        });
    }
}));
test('if the 2fa handler is provided, and fails if should throw the error thrown by the handler', () => __awaiter(void 0, void 0, void 0, function* () {
    const fn = jest.fn();
    const client = new index_1.RestClient({
        baseUrl: 'https://example.com',
    });
    client.handleTwoFactorChallenge((e) => {
        fn(e);
        throw new Error('foo');
    });
    yield expect(client.post('/v1/login', { user: 'foo', username: 'foo', email: 'foo', password: 'foo', code: 'foo' })).rejects.toThrow(new Error('foo'));
    expect(fn).toHaveBeenCalledTimes(1);
}));
test('if the 2fa handler is provided it should resolves', () => __awaiter(void 0, void 0, void 0, function* () {
    const fn = jest.fn();
    const client = new index_1.RestClient({
        baseUrl: 'https://example.com',
    });
    client.handleTwoFactorChallenge(() => {
        fn();
        return Promise.resolve('2FA_CODE');
    });
    const result = yield client.post('/v1/login', { user: 'foo', username: 'foo', email: 'foo', password: 'foo', code: 'foo' });
    expect(result).toMatchObject({
        status: 'success',
        data: {
            userId: 'foo',
            email: 'foo',
            username: 'foo',
        },
    });
    expect(fn).toHaveBeenCalledTimes(1);
}));
test('should be ask for 2fa code again if the code is wrong', () => __awaiter(void 0, void 0, void 0, function* () {
    const fn = jest.fn();
    const client = new index_1.RestClient({
        baseUrl: 'https://example.com',
    });
    let retries = 0;
    client.handleTwoFactorChallenge(() => {
        fn();
        if (!retries) {
            retries++;
            return Promise.resolve('WRONG_2FA_CODE');
        }
        return Promise.resolve('2FA_CODE');
    });
    const result = yield client.post('/v1/login', { user: 'foo', username: 'foo', email: 'foo', password: 'foo', code: 'foo' });
    expect(result).toMatchObject({
        status: 'success',
        data: {
            userId: 'foo',
            email: 'foo',
            username: 'foo',
        },
    });
    expect(fn).toHaveBeenCalledTimes(2);
}));
