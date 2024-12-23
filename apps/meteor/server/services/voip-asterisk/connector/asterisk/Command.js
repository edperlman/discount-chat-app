"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = exports.CommandType = void 0;
/**
 * This class serves as a a base class for the different kind of call server objects
 * @remarks
 */
var CommandType;
(function (CommandType) {
    CommandType[CommandType["ARI"] = 0] = "ARI";
    CommandType[CommandType["AMI"] = 1] = "AMI";
    CommandType[CommandType["AGI"] = 2] = "AGI";
})(CommandType || (exports.CommandType = CommandType = {}));
class Command {
    get type() {
        return this._type;
    }
    get commandText() {
        return this._commandText;
    }
    get parametersNeeded() {
        return this._parametersNeeded;
    }
    get connection() {
        return this._connection;
    }
    set connection(connection) {
        this._connection = connection;
    }
    get actionid() {
        return this._actionid;
    }
    set actionid(id) {
        this._actionid = id;
    }
    get result() {
        return this._result;
    }
    set result(res) {
        this._result = res;
    }
    get returnResolve() {
        return this._returnResolve;
    }
    set returnResolve(resolve) {
        this._returnResolve = resolve;
    }
    get returnReject() {
        return this._returnReject;
    }
    set returnReject(reject) {
        this._returnReject = reject;
    }
    get db() {
        return this._db;
    }
    set db(db) {
        this._db = db;
    }
    constructor(command, parametersNeeded, db) {
        this._commandText = command;
        this._actionid = -1;
        this._parametersNeeded = parametersNeeded;
        this.result = {};
        this._db = db;
    }
    prepareCommandAndExecution(amiCommand, actionResultCallback, eventHandlerSetupCallback) {
        const returnPromise = new Promise((_resolve, _reject) => {
            this.returnResolve = _resolve;
            this.returnReject = _reject;
            eventHandlerSetupCallback();
            this.connection.executeCommand(amiCommand, actionResultCallback);
        });
        return returnPromise;
    }
    executeCommand(_data) {
        return new Promise((_resolve, _reject) => {
            _reject('unimplemented');
        });
    }
    initMonitor(_data) {
        return true;
    }
    cleanMonitor() {
        return true;
    }
}
exports.Command = Command;
