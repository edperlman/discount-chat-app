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
exports.AMIConnection = void 0;
/**
 * Class representing AMI connection.
 * @remarks
 * This class is based on https://github.com/pipobscure/NodeJS-AsteriskManager
 * which is internally based on https://github.com/mscdex/node-asterisk
 *
 * Asterisk AMI interface is a socket based interface. The AMI configuration
 * happens in /etc/asterisk/manager.conf file.
 *
 */
const logger_1 = require("@rocket.chat/logger");
const asterisk_manager_1 = __importDefault(require("asterisk-manager"));
function makeLoggerDummy(logger) {
    logger.log = function log(..._args) {
        // do nothing.
    };
    logger.debug = function debug(..._args) {
        // do nothing.
    };
    logger.info = function info(..._args) {
        // do nothing.
    };
    logger.error = function error(..._args) {
        // do nothing.
    };
    return logger;
}
class AMIConnection {
    constructor() {
        // This class prints a ton of logs that are useful for debugging specific communication things
        // However, for most usecases, logs here won't be needed. Hardcoding while we add a setting
        // "Print extended voip connection logs" which will control classes' logging behavior
        this.printLogs = false;
        this.totalReconnectionAttempts = 5;
        this.currentReconnectionAttempt = 0;
        // Starting with 5 seconds of backoff time. increases with the attempts.
        this.initialBackoffDurationMS = 5000;
        this.nearEndDisconnect = false;
        // if it is a test connection
        // Reconnectivity logic should not be applied.
        this.connectivityCheck = false;
        const logger = new logger_1.Logger('AMIConnection');
        this.logger = this.printLogs ? logger : makeLoggerDummy(logger);
        this.eventHandlers = new Map();
        this.connectionState = 'UNKNOWN';
    }
    cleanup() {
        if (!this.connection) {
            return;
        }
        this.connection.disconnect();
        this.connection.removeAllListeners();
        this.connection = null;
    }
    reconnect() {
        this.logger.debug({
            msg: 'reconnect ()',
            initialBackoffDurationMS: this.initialBackoffDurationMS,
            currentReconnectionAttempt: this.currentReconnectionAttempt,
        });
        if (this.currentReconnectionAttempt === this.totalReconnectionAttempts) {
            this.logger.info({ msg: 'reconnect () Not attempting to reconnect' });
            // We have exhausted the reconnection attempts or we have authentication error
            // We dont want to retry anymore
            this.connectionState = 'ERROR';
            return;
        }
        const backoffTime = this.initialBackoffDurationMS + this.initialBackoffDurationMS * this.currentReconnectionAttempt;
        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.attemptConnection();
            }
            catch (err) {
                this.logger.error({ msg: 'reconnect () attemptConnection() has thrown error', err });
            }
        }), backoffTime);
        this.currentReconnectionAttempt += 1;
    }
    onManagerError(reject, err) {
        this.logger.error({ msg: 'onManagerError () Connection Error', err });
        this.cleanup();
        this.connectionState = 'ERROR';
        if (this.currentReconnectionAttempt === this.totalReconnectionAttempts) {
            this.logger.error({ msg: 'onManagerError () reconnection attempts exhausted. Please check connection settings' });
            reject(err);
        }
        else {
            this.reconnect();
        }
    }
    onManagerConnect(_resolve, _reject) {
        this.logger.debug({ msg: 'onManagerConnect () Connection Success' });
        this.connection.login(this.onManagerLogin.bind(this, _resolve, _reject));
    }
    onManagerLogin(resolve, reject, error) {
        if (error) {
            this.logger.error({ msg: 'onManagerLogin () Authentication Error. Not going to reattempt. Fix the credentaials' });
            // Do not reattempt if we have login failure
            this.cleanup();
            reject(error);
        }
        else {
            this.connectionState = 'AUTHENTICATED';
            this.currentReconnectionAttempt = 0;
            /**
             * Note : There is no way to release a handler or cleanup the handlers.
             * Handlers are released only when the connection is closed.
             * Closing the connection and establishing it again for every command is an overhead.
             * To avoid that, we have taken a clean, though a bit complex approach.
             * We will register for all the manager event.
             *
             * Each command will register to AMIConnection to receive the events which it is
             * interested in. Once the processing is complete, it will unregister.
             *
             * Handled in this way will avoid disconnection of the connection to cleanup the
             * handlers.
             *
             * Furthermore, we do not want to initiate this when we are checking
             * the connectivity.
             */
            if (!this.connectivityCheck) {
                this.connection.on('managerevent', this.eventHandlerCallback.bind(this));
            }
            this.logger.debug({ msg: 'onManagerLogin () Authentication Success, Connected' });
            resolve();
        }
    }
    onManagerClose(hadError) {
        this.logger.error({ msg: 'onManagerClose ()', hadError });
        this.cleanup();
        if (!this.nearEndDisconnect) {
            this.reconnect();
        }
    }
    onManagerTimeout() {
        this.logger.debug({ msg: 'onManagerTimeout ()' });
        this.cleanup();
    }
    attemptConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            this.connectionState = 'UNKNOWN';
            this.connection = new asterisk_manager_1.default(undefined, this.connectionIpOrHostname, this.userName, this.password, true);
            const returnPromise = new Promise((_resolve, _reject) => {
                this.connection.on('connect', this.onManagerConnect.bind(this, _resolve, _reject));
                this.connection.on('error', this.onManagerError.bind(this, _reject));
                this.connection.on('close', this.onManagerClose.bind(this));
                this.connection.on('timeout', this.onManagerTimeout.bind(this));
                this.connection.connect(this.connectionPort, this.connectionIpOrHostname);
            });
            return returnPromise;
        });
    }
    /**
     * connect: Connects to asterisk
     * description: This function initiates a connection to asterisk management interface
     * for receiving the various events. These events could be a result of action command sent over
     * the socket or an events that asterisk sents over this connection. In the later case, what asterisk
     * sends over the socket depends on the way permissions are given to the user in asterisk's
     * manager.conf file.
     * This code uses a lib https://github.com/pipobscure/NodeJS-AsteriskManager
     * The working of this library actually connects in the object creation. i.e
     * new Manager(port, connectionIpOrHostname, userName, password, true);
     * So it was noticed that if we call isConnected immediately after creating the object,
     * it returns false. Eventualy when the connection  and authentication succeeds
     * it will be set back to true.
     * To avoid this connection we have to explicitly create the Manager with undefined port value.
     * When done so, We will have to explicitly call connect and login functions.
     * These functions can give a callback where we can resolve the promises
     * This way it ensures that the rocket.chat service has a valid connection or an error when this function
     * call is over.
     *
     * @param connectionIpOrHostname
     * @param connectionPort
     * @param userName
     * @param password
     */
    connect(connectionIpOrHostname_1, connectionPort_1, userName_1, password_1) {
        return __awaiter(this, arguments, void 0, function* (connectionIpOrHostname, connectionPort, userName, password, connectivityCheck = false) {
            this.logger.log({ msg: 'connect()' });
            this.connectionIpOrHostname = connectionIpOrHostname;
            this.connectionPort = connectionPort;
            this.userName = userName;
            this.password = password;
            this.connectivityCheck = connectivityCheck;
            yield this.attemptConnection();
        });
    }
    isConnected() {
        if (this.connection) {
            return this.connection.isConnected();
        }
        return false;
    }
    // Executes an action on asterisk and returns the result.
    executeCommand(action, actionResultCallback) {
        if (this.connectionState !== 'AUTHENTICATED' || (this.connection && !this.connection.isConnected())) {
            this.logger.warn({ msg: 'executeCommand() Cant execute command at this moment. Connection is not active' });
            throw Error('Cant execute command at this moment. Connection is not active');
        }
        this.logger.info({ msg: 'executeCommand()' });
        this.connection.action(action, actionResultCallback);
    }
    eventHandlerCallback(event) {
        if (!this.eventHandlers.has(event.event.toLowerCase())) {
            this.logger.info({ msg: `No event handler set for ${event.event}` });
            return;
        }
        const handlers = this.eventHandlers.get(event.event.toLowerCase());
        this.logger.debug({ msg: `eventHandlerCallback() Handler count = ${handlers.length}` });
        /* Go thru all the available handlers  and call each one of them if the actionid matches */
        for (const handler of handlers) {
            if (handler.call(event)) {
                this.logger.debug({ msg: `eventHandlerCallback() called callback for action = ${event.actionid}` });
            }
            else {
                this.logger.debug({
                    msg: `eventHandlerCallback() No command found for action = ${event.actionid}`,
                    event: event.event,
                });
            }
        }
    }
    on(event, callbackContext) {
        var _a;
        this.logger.info({ msg: 'on()' });
        if (!this.eventHandlers.has(event)) {
            this.logger.debug({ msg: `on() no existing handlers for event = ${event}` });
            const array = [];
            this.eventHandlers.set(event, array);
        }
        (_a = this.eventHandlers.get(event)) === null || _a === void 0 ? void 0 : _a.push(callbackContext);
    }
    off(event, command) {
        this.logger.info({ msg: 'off()' });
        if (!this.eventHandlers.has(event)) {
            this.logger.warn({ msg: `off() No event handler found for ${event}` });
            return;
        }
        this.logger.debug({ msg: `off() Event found ${event}` });
        const handlers = this.eventHandlers.get(event);
        this.logger.debug({ msg: `off() Handler array length = ${handlers.length}` });
        for (const handler of handlers) {
            if (!handler.isValidContext(command.actionid)) {
                continue;
            }
            const newHandlers = handlers.filter((obj) => obj !== handler);
            if (!newHandlers.length) {
                this.logger.debug({ msg: `off() No handler for ${event} deleting event from the map.` });
                this.eventHandlers.delete(event);
            }
            else {
                this.eventHandlers.set(event, newHandlers);
                break;
            }
        }
    }
    closeConnection() {
        this.logger.info({ msg: 'closeConnection()' });
        this.nearEndDisconnect = true;
        this.cleanup();
    }
}
exports.AMIConnection = AMIConnection;
