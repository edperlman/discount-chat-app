"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketConnection = void 0;
/**
 * Class representing Websocket connection.
 * @remarks
 *
 * This class wraps around websocket with asterisk. WebSocket protocol is defaulted to sip
 * for connection but can be passed externally.
 *
 * Websocket configurations can be found in asterisk's http.conf and pjsip.conf
 *
 */
const logger_1 = require("@rocket.chat/logger");
const ws_1 = __importDefault(require("ws"));
class WebsocketConnection {
    constructor() {
        this.logger = new logger_1.Logger('WebsocketConnection');
    }
    connectWithUrl(connectionUrl, connectionProtocol = 'sip') {
        this.logger.log({ msg: 'connect()' });
        const returnPromise = new Promise((_resolve, _reject) => {
            const onError = (err) => {
                _reject(err);
                this.logger.error({ msg: 'checkCallserverConnection () Connection Error', err });
            };
            const onConnect = () => {
                _resolve();
                this.connection.close();
            };
            this.connection = new ws_1.default(connectionUrl, connectionProtocol);
            this.connection.on('open', onConnect);
            this.connection.on('error', onError);
        });
        return returnPromise;
    }
    isConnected() {
        this.logger.debug({ msg: 'isConnected() unimplemented' });
        return false;
    }
    // Executes an action on asterisk and returns the result.
    executeCommand(_action, _actionResultCallback) {
        this.logger.debug({ msg: 'executeCommand() unimplemented' });
    }
    on(_event, _callbackContext) {
        this.logger.debug({ msg: 'on() unimplemented' });
    }
    off(_event, _command) {
        this.logger.debug({ msg: 'on() unimplemented' });
    }
    closeConnection() {
        this.logger.info({ msg: 'closeConnection()' });
        this.connection.close();
    }
}
exports.WebsocketConnection = WebsocketConnection;
