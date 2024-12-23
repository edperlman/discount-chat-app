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
const DDPSDK_1 = require("../src/DDPSDK");
let server;
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    server = new jest_websocket_mock_1.default('ws://localhost:1234/websocket');
}));
afterEach(() => {
    server.close();
    jest_websocket_mock_1.default.clean();
});
describe('login', () => {
    it('should save credentials to user object - loginWithToken', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const sdk = DDPSDK_1.DDPSDK.create('ws://localhost:1234');
        yield (0, helpers_1.handleConnection)(server, sdk.connection.connect());
        const messageResult = {
            id: 123,
            token: 'token',
            tokenExpires: { $date: 99999999 },
        };
        yield (0, helpers_1.handleMethod)(server, 'login', [{ resume: 'token' }], JSON.stringify(messageResult), sdk.account.loginWithToken('token'));
        const { user } = sdk.account;
        expect(user === null || user === void 0 ? void 0 : user.token).toBe(messageResult.token);
        expect((_a = user === null || user === void 0 ? void 0 : user.tokenExpires) === null || _a === void 0 ? void 0 : _a.toISOString()).toBe(new Date(messageResult.tokenExpires.$date).toISOString());
        expect(user === null || user === void 0 ? void 0 : user.id).toBe(messageResult.id);
    }));
    it('should save credentials to user object - loginWithPassword', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const sdk = DDPSDK_1.DDPSDK.create('ws://localhost:1234');
        yield (0, helpers_1.handleConnection)(server, sdk.connection.connect());
        const messageResult = {
            id: 123,
            token: 'token',
            tokenExpires: { $date: 99999999 },
        };
        yield (0, helpers_1.handleMethod)(server, 'login', [{ user: { username: 'username' }, password: { digest: 'password', algorithm: 'sha-256' } }], JSON.stringify(messageResult), sdk.account.loginWithPassword('username', 'password'));
        const { user } = sdk.account;
        expect(user === null || user === void 0 ? void 0 : user.token).toBe(messageResult.token);
        expect((_a = user === null || user === void 0 ? void 0 : user.tokenExpires) === null || _a === void 0 ? void 0 : _a.toISOString()).toBe(new Date(messageResult.tokenExpires.$date).toISOString());
        expect(user === null || user === void 0 ? void 0 : user.id).toBe(messageResult.id);
    }));
    it('should logout', () => __awaiter(void 0, void 0, void 0, function* () {
        const sdk = DDPSDK_1.DDPSDK.create('ws://localhost:1234');
        yield (0, helpers_1.handleConnection)(server, sdk.connection.connect());
        const messageResult = {
            id: 123,
            token: 'token',
            tokenExpires: { $date: 99999999 },
        };
        const cb = jest.fn();
        sdk.account.once('uid', cb);
        yield (0, helpers_1.handleMethod)(server, 'logout', [], JSON.stringify(messageResult), sdk.account.logout());
        expect(cb).toHaveBeenCalledTimes(1);
        const { user } = sdk.account;
        expect(user).toBeUndefined();
    }));
});
