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
exports.connect = connect;
const node_net_1 = require("node:net");
const esl_1 = require("esl");
const logger_1 = require("./logger");
const defaultPassword = 'ClueCon';
function connect(options) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const host = (_a = options === null || options === void 0 ? void 0 : options.host) !== null && _a !== void 0 ? _a : '127.0.0.1';
        const port = (_b = options === null || options === void 0 ? void 0 : options.port) !== null && _b !== void 0 ? _b : 8021;
        const password = (_c = options === null || options === void 0 ? void 0 : options.password) !== null && _c !== void 0 ? _c : defaultPassword;
        return new Promise((resolve, reject) => {
            logger_1.logger.debug({ msg: 'FreeSwitchClient::connect', options: { host, port } });
            const socket = new node_net_1.Socket();
            const currentCall = new esl_1.FreeSwitchResponse(socket, logger_1.logger);
            let connecting = true;
            socket.once('connect', () => {
                void (() => __awaiter(this, void 0, void 0, function* () {
                    connecting = false;
                    try {
                        // Normally when the client connects, FreeSwitch will first send us an authentication request. We use it to trigger the remainder of the stack.
                        yield currentCall.onceAsync('freeswitch_auth_request', 20000, 'FreeSwitchClient expected authentication request');
                        yield currentCall.auth(password);
                        currentCall.auto_cleanup();
                        yield currentCall.event_json('CHANNEL_EXECUTE_COMPLETE', 'BACKGROUND_JOB');
                    }
                    catch (error) {
                        logger_1.logger.error('FreeSwitchClient: connect error', error);
                        reject(error);
                    }
                    if (currentCall) {
                        resolve(currentCall);
                    }
                }))();
            });
            socket.once('error', (error) => {
                if (!connecting) {
                    return;
                }
                logger_1.logger.error({ msg: 'failed to connect to freeswitch server', error });
                connecting = false;
                reject(error);
            });
            socket.once('end', () => {
                if (!connecting) {
                    return;
                }
                logger_1.logger.debug('FreeSwitchClient::connect: client received `end` event (remote end sent a FIN packet)');
                connecting = false;
                reject(new Error('connection-ended'));
            });
            socket.on('warning', (data) => {
                if (!connecting) {
                    return;
                }
                logger_1.logger.warn({ msg: 'FreeSwitchClient: warning', data });
            });
            try {
                logger_1.logger.debug('FreeSwitchClient::connect: socket.connect', { options: { host, port } });
                socket.connect({
                    host,
                    port,
                    password,
                });
            }
            catch (error) {
                logger_1.logger.error('FreeSwitchClient::connect: socket.connect error', { error });
                connecting = false;
                reject(error);
            }
        });
    });
}
