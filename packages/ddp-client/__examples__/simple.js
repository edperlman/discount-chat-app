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
const ws_1 = __importDefault(require("ws"));
const DDPSDK_1 = require("../src/DDPSDK");
global.WebSocket = global.WebSocket || ws_1.default;
const run = (url, token) => __awaiter(void 0, void 0, void 0, function* () {
    const sdk = yield DDPSDK_1.DDPSDK.createAndConnect(url);
    try {
        if (!token) {
            throw new Error('Token is required');
        }
        yield sdk.account.loginWithToken(token);
        yield sdk.stream('notify-room', 'GENERAL/user-activity', (args) => console.log('notify-user -> GENERAL/user-activity', JSON.stringify(args, undefined, 2)));
        yield sdk.stream('notify-user', 'GENERAL/rooms-changed', (args) => console.log('notify-user -> GENERAL/rooms-changed', JSON.stringify(args, undefined, 2)));
        yield sdk.stream('room-messages', 'GENERAL', (message) => console.log('room-messages -> GENERAL', JSON.stringify(message, undefined, 2)));
        yield sdk.stream('roles', 'roles', (args) => console.log('roles -> roles', JSON.stringify(args, undefined, 2)));
        console.log('ROOMS', yield sdk.client.callAsync('subscriptions/get'));
    }
    catch (error) {
        console.log('error', error);
    }
    return sdk;
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield run('wss://unstable.rocket.chat/websocket', process.env.INSTANCE_TOKEN || '');
}))();
