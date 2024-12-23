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
exports.CommandHandler = void 0;
const logger_1 = require("@rocket.chat/logger");
const Command_1 = require("./Command");
const Commands_1 = require("./Commands");
const Helper_1 = require("../../lib/Helper");
const WebsocketConnection_1 = require("../websocket/WebsocketConnection");
const AMIConnection_1 = require("./ami/AMIConnection");
const CommandFactory_1 = require("./ami/CommandFactory");
const version = 'Asterisk Connector 1.0';
class CommandHandler {
    constructor(db) {
        this.logger = new logger_1.Logger('CommandHandler');
        this.connections = new Map();
        this.db = db;
    }
    initConnection(commandType) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            // Initialize available connections
            const connection = new AMIConnection_1.AMIConnection();
            const config = commandType === Command_1.CommandType.AMI ? (0, Helper_1.getManagementServerConfig)() : undefined;
            if (!config) {
                this.logger.warn('Management server configuration not found');
                return;
            }
            /**
             * If we have the same type of connection already established, close it
             * and remove it from the map.
             */
            if ((_a = this.connections.get(commandType)) === null || _a === void 0 ? void 0 : _a.isConnected()) {
                this.logger.error({ msg: 'connection exists. Closing the connection.' });
                (_b = this.connections.get(commandType)) === null || _b === void 0 ? void 0 : _b.closeConnection();
                this.connections.delete(commandType);
            }
            if (!config.host) {
                this.logger.error('Invalid host');
                return;
            }
            try {
                yield connection.connect(config.host, config.configData.port.toString(), config.configData.username, config.configData.password);
                this.connections.set(commandType, connection);
                this.continuousMonitor = CommandFactory_1.CommandFactory.getCommandObject(Commands_1.Commands.event_stream, this.db);
                const continuousMonitor = this.connections.get(this.continuousMonitor.type);
                if (!continuousMonitor) {
                    throw new Error(`No connection for ${this.continuousMonitor.type}`);
                }
                this.continuousMonitor.connection = continuousMonitor;
                this.continuousMonitor.initMonitor({});
            }
            catch (err) {
                this.logger.error({ msg: 'Management server connection error', err });
            }
        });
    }
    /* Executes |commandToExecute| on a particular command object
     * @remarks
     * CommandFactory is responsible for creating a |Command| object necessary
     * for executing an AMI command. Every concrete command object inherits
     * from class |Command|. Which overrides a method called executeCommand.
     * This function returns a promise. Caller can wait for the promise to resolve
     * or rejected.
     */
    executeCommand(commandToExecute, commandData) {
        this.logger.debug({ msg: `executeCommand() executing ${Commands_1.Commands[commandToExecute]}` });
        const command = CommandFactory_1.CommandFactory.getCommandObject(commandToExecute, this.db);
        const connection = this.connections.get(command.type);
        if (!(connection === null || connection === void 0 ? void 0 : connection.isConnected())) {
            throw Error('Connection error');
        }
        command.connection = this.connections.get(command.type);
        return command.executeCommand(commandData);
    }
    // Get the version string
    getVersion() {
        return version;
    }
    checkManagementConnection(host, port, userName, password) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.debug({ msg: 'checkManagementConnection()', host, port, userName });
            const connection = new AMIConnection_1.AMIConnection();
            try {
                yield connection.connect(host, port, userName, password);
                if (connection.isConnected()) {
                    // Just a second level of check to ensure that we are actually
                    // connected and authenticated.
                    connection.closeConnection();
                }
                this.logger.debug({ msg: 'checkManagementConnection() Connected ' });
                return {
                    status: 'connected',
                };
            }
            catch (err) {
                this.logger.error({ msg: 'checkManagementConnection() Connection Error', err });
                throw err;
            }
        });
    }
    checkCallserverConnection(websocketUrl, protocol) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.debug({ msg: 'checkCallserverConnection()', websocketUrl });
            const connection = new WebsocketConnection_1.WebsocketConnection();
            try {
                yield connection.connectWithUrl(websocketUrl, protocol);
                if (connection.isConnected()) {
                    // Just a second level of check to ensure that we are actually
                    // connected and authenticated.
                    connection.closeConnection();
                }
                this.logger.debug({ msg: 'checkManagementConnection() Connected ' });
                return {
                    status: 'connected',
                };
            }
            catch (err) {
                this.logger.error({ msg: 'checkManagementConnection() Connection Error', err });
                throw err;
            }
        });
    }
    stop() {
        if (!this.continuousMonitor) {
            // service is already stopped or was never initialized
            return;
        }
        this.continuousMonitor.cleanMonitor();
        for (const connection of this.connections.values()) {
            connection.closeConnection();
        }
    }
}
exports.CommandHandler = CommandHandler;
