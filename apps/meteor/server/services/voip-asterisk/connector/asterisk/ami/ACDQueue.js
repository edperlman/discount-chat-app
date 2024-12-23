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
exports.ACDQueue = void 0;
const logger_1 = require("@rocket.chat/logger");
const Command_1 = require("../Command");
const Commands_1 = require("../Commands");
const CallbackContext_1 = require("./CallbackContext");
class ACDQueue extends Command_1.Command {
    constructor(command, parametersNeeded, db) {
        super(command, parametersNeeded, db);
        this._type = Command_1.CommandType.AMI;
        this.logger = new logger_1.Logger('ACDQueue');
    }
    onQueueSummary(event) {
        if (event.actionid !== this.actionid) {
            this.logger.error({
                msg: 'onQueueSummary() Unusual behavior. ActionId does not belong to this object',
                eventActionId: event.actionid,
                actionId: this.actionid,
            });
            return;
        }
        const queue = {
            name: event.queue,
            loggedin: event.loggedin,
            available: event.available,
            callers: event.callers,
            holdtime: event.holdtime,
            talktime: event.talktime,
            logestholdtime: event.logestholdtime,
        };
        const { result } = this;
        if (result.queueSummary) {
            result.queueSummary.push(queue);
        }
        else {
            result.queueSummary = [];
            result.queueSummary.push(queue);
        }
    }
    onQueueSummaryComplete(event) {
        if (event.actionid !== this.actionid) {
            this.logger.error({
                msg: 'onQueueSummaryComplete() Unusual behavior. ActionId does not belong to this object',
                eventActionId: event.actionid,
                actionId: this.actionid,
            });
            return;
        }
        this.resetEventHandlers();
        const { result } = this;
        if (!result.queueSummary) {
            this.logger.info({ msg: 'No Queues available' });
            result.queueSummary = [];
        }
        this.returnResolve({ result: result.queueSummary });
    }
    /**  Callback for receiving Queue parameters for queuestatus action.
     *
     */
    onQueueParams(event) {
        if (event.actionid !== this.actionid) {
            this.logger.error({
                msg: 'onQueueParams() Unusual behavior. ActionId does not belong to this object',
                eventActionId: event.actionid,
                actionId: this.actionid,
            });
            return;
        }
        const queue = {
            name: event.queue,
            strategy: event.strategy,
            calls: event.calls,
            holdtime: event.holdtime,
            talktime: event.talktime,
            completed: event.completed,
            abandoned: event.abandoned,
            logestholdtime: event.logestholdtime,
        };
        this.result.queueStatus = queue;
    }
    /**  Callback for receiving Queue members for queuestatus action.
     *
     */
    onQueueMember(event) {
        if (event.actionid !== this.actionid) {
            this.logger.error({
                msg: 'onQueueMember() Unusual behavior. ActionId does not belong to this object',
                eventActionId: event.actionid,
                actionId: this.actionid,
            });
            return;
        }
        const member = {
            name: event.name,
            location: event.location,
            stateinterface: event.stateinterface,
            membership: event.membership,
            penalty: event.penalty,
            callstaken: event.callstaken,
            lastcall: event.lastcall,
            lastpause: event.lastpause,
            incall: event.incall,
            status: event.status,
            paused: event.paused,
            pausedreason: event.pausedreason,
            wrapuptime: event.wrapuptime,
        };
        if (this.result.queueStatus.name !== event.queue) {
            this.logger.error({ msg: `onQueueMember() : Unknown error. Queue ${event.queue} not found` });
        }
        else {
            if (!this.result.queueStatus.members) {
                this.result.queueStatus.members = [];
            }
            this.result.queueStatus.members.push(member);
        }
    }
    /**  Callback when all the data is received for queuestatus action.
     *
     */
    onQueueStatusComplete(event) {
        if (event.actionid !== this.actionid) {
            this.logger.error({
                msg: 'onQueueStatusComplete() Unusual behavior. ActionId does not belong to this object',
                eventActionId: event.actionid,
                actionId: this.actionid,
            });
            return;
        }
        this.resetEventHandlers();
        const { result } = this;
        this.returnResolve({ result: result.queueStatus });
    }
    /**
     * Callback for indicatiing command execution status.
     * Received actionid for the first time.
     */
    onActionResult(error, result) {
        if (error) {
            this.logger.error({ msg: 'onActionResult()', error: JSON.stringify(error) });
            this.returnReject(`error${error} while executing command`);
        }
        else {
            // Set up actionid for future reference in case of success.
            this.actionid = result.actionid;
        }
    }
    setupEventHandlers() {
        // Setup necessary command event handlers based on the command
        switch (this.commandText) {
            case Commands_1.Commands.queue_summary.toString(): {
                this.connection.on('queuesummary', new CallbackContext_1.CallbackContext(this.onQueueSummary.bind(this), this));
                this.connection.on('queuesummarycomplete', new CallbackContext_1.CallbackContext(this.onQueueSummaryComplete.bind(this), this));
                break;
            }
            case Commands_1.Commands.queue_details.toString(): {
                this.connection.on('queueparams', new CallbackContext_1.CallbackContext(this.onQueueParams.bind(this), this));
                this.connection.on('queuemember', new CallbackContext_1.CallbackContext(this.onQueueMember.bind(this), this));
                this.connection.on('queuestatuscomplete', new CallbackContext_1.CallbackContext(this.onQueueStatusComplete.bind(this), this));
                break;
            }
            default: {
                this.logger.error({ msg: `setupEventHandlers() : Unimplemented ${this.commandText}` });
                break;
            }
        }
    }
    resetEventHandlers() {
        switch (this.commandText) {
            case Commands_1.Commands.queue_summary.toString(): {
                this.connection.off('queuesummary', this);
                this.connection.off('queuesummarycomplete', this);
                break;
            }
            case Commands_1.Commands.queue_details.toString(): {
                this.connection.off('queueparams', this);
                this.connection.off('queuemember', this);
                this.connection.off('queuestatuscomplete', this);
                break;
            }
            default: {
                this.logger.error({ msg: `resetEventHandlers() : Unimplemented ${this.commandText}` });
                break;
            }
        }
    }
    executeCommand(data) {
        const _super = Object.create(null, {
            prepareCommandAndExecution: { get: () => super.prepareCommandAndExecution }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let amiCommand = {};
            // set up the specific action based on the value of |Commands|
            if (this.commandText === Commands_1.Commands.queue_summary.toString()) {
                amiCommand = {
                    action: 'queuesummary',
                };
            }
            else if (this.commandText === Commands_1.Commands.queue_details.toString()) {
                amiCommand = {
                    action: 'queuestatus',
                    queue: data.queueName,
                };
            }
            this.logger.debug({ msg: `Executing AMI command ${JSON.stringify(amiCommand)}`, data });
            const actionResultCallback = this.onActionResult.bind(this);
            const eventHandlerSetupCallback = this.setupEventHandlers.bind(this);
            return _super.prepareCommandAndExecution.call(this, amiCommand, actionResultCallback, eventHandlerSetupCallback);
        });
    }
}
exports.ACDQueue = ACDQueue;
