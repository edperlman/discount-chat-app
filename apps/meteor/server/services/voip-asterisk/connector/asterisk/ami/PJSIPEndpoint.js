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
exports.PJSIPEndpoint = void 0;
/**
 * This class is responsible for handling PJSIP endpoints.
 * @remarks
 * Some design notes :
 * 1. CommandFactory creates the child classes of the |Command| class and
 * 	  returns a reference to |Command|
 * 2. |CommandHandler| class call executeCommand method of |Command| class, which
 *    gets overriden here.
 * 3. Consumers of this class create the instance based on |Commands| object but
 *    specific command object 'knows' about asterisk-ami command. Reason for doing this is
 *    that the consumer does not and should not know about the pbx specific commands
 * 	  used for fetching the information. e.g for endpoint list and endpoint info,
 * 	  it uses pjsipshowendpoints and pjsipshowendpoint.
 * 4. Asterisk responds asynchronously and it responds using events. Command specific
 *    event handling is implemented by this class.
 * 5. Every execution of command takes action-callback, which tells whether the command can be
 *    executed or there is an error. In case of success, it ends set of events
 *    the completion of which is indicated by <action>completed event. e.g while fetching the endpoint,
 *    i.e for executing |pjsipshowendpoint|  asterisk sends the different parts of i
 *    nformation in different events. event |endpointdetail| indicates
 *    endpoint name, devicestate etc. |authdetail| indicates type of authentication, password and other
 *    auth related information. At the end of the series of these events, Asterisk sends |endpointdetailcomplete|
 * 	  event. At this point of time, promise, on which the consumer is waiting can be resolved.
 * 6. This class could use asynchronous callbacks. But because the connector will be used extensively by REST layer
 *    we have taken promise based approach. Promise is returned as a part of executeCommand. Caller would wait for
 *    the completion/rejection. This class will reject the promise based on error or resolve it in <command>complete
 *    event.
 * 7. Important to note that the intermediate events containing a result part for an execution of a particular command
 *    have same actionid, which is received by this class as a successful execution of a command in actionResultCallback.
 */
const core_typings_1 = require("@rocket.chat/core-typings");
const logger_1 = require("@rocket.chat/logger");
const underscore_1 = __importDefault(require("underscore"));
const Command_1 = require("../Command");
const Commands_1 = require("../Commands");
const CallbackContext_1 = require("./CallbackContext");
class PJSIPEndpoint extends Command_1.Command {
    constructor(command, parametersNeeded, db) {
        super(command, parametersNeeded, db);
        this.logger = new logger_1.Logger('PJSIPEndpoint');
        this._type = Command_1.CommandType.AMI;
    }
    getState(endpointState) {
        /**
         * When registered endpoint can be in following state
         * Not in use : When endpoint has registered but not serving any call.
         * Ringing : Registered and ringing
         * Busy : endpoing is handling call.
         *
         * If any other state is seen, this function returns EndpointState.UNKNOWN;
         */
        let state = core_typings_1.EndpointState.UNKNOWN;
        switch (endpointState.toLowerCase()) {
            case 'unavailable':
                state = core_typings_1.EndpointState.UNREGISTERED;
                break;
            case 'not in use':
                state = core_typings_1.EndpointState.REGISTERED;
                break;
            case 'ringing':
                state = core_typings_1.EndpointState.RINGING;
                break;
            case 'busy':
                state = core_typings_1.EndpointState.BUSY;
                break;
        }
        return state;
    }
    /**
     * Event handler for endpointlist event containing the information of the endpoints.
     * @remark
     * This event is generated as a result of the execution of |pjsipshowendpoints|
     */
    onEndpointList(event) {
        if (event.actionid !== this.actionid) {
            this.logger.error({
                msg: 'onEndpointList() Unusual behavior. ActionId does not belong to this object',
                eventActionId: event.actionid,
                actionId: this.actionid,
            });
            return;
        }
        // A SIP address-of-record is a canonical address by which a user is known
        // If the event doesn't have an AOR, we will ignore it (as it's probably system-only)
        if (!(event === null || event === void 0 ? void 0 : event.aor.trim())) {
            return;
        }
        const endPoint = {
            extension: event.objectname,
            state: this.getState(event.devicestate),
            password: '',
            authtype: '',
        };
        const { result } = this;
        if (result.endpoints) {
            result.endpoints.push(endPoint);
        }
        else {
            // create an array of endpoints in the result for
            // the first time.
            result.endpoints = [];
            result.endpoints.push(endPoint);
        }
    }
    /**
     * Event handler for endpointlistcomplete event indicating that all the data
     * is received.
     */
    onEndpointListComplete(event) {
        if (event.actionid !== this.actionid) {
            this.logger.error({
                msg: 'onEndpointListComplete() Unusual behavior. ActionId does not belong to this object',
                eventActionId: event.actionid,
                actionId: this.actionid,
            });
            return;
        }
        this.resetEventHandlers();
        const extensions = underscore_1.default.sortBy(this.result.endpoints, (o) => {
            return o.extension;
        });
        this.returnResolve({ result: extensions });
    }
    /**
     * Event handler for endpointdetail and authdetail event containing the endpoint specific details
     * and authentication information.
     * @remark
     * This event is generated as a result of the execution of |pjsipshowendpoint|.
     * We consolidate this endpointdetail and authdetail events because they are generated
     * as a result of same command. Nevertheless, in future, if such implementation
     * becomes difficult, it is recommended that there should be a separate handling
     * for each event.
     */
    onEndpointInfo(event) {
        if (event.actionid !== this.actionid) {
            this.logger.error({
                msg: 'onEndpointInfo() Unusual behavior. ActionId does not belong to this object',
                eventActionId: event.actionid,
                actionId: this.actionid,
            });
            return;
        }
        const { result } = this;
        if (!result.endpoint) {
            const endpointDetails = {
                extension: '',
                state: '',
                password: '',
                authtype: '',
            };
            result.endpoint = endpointDetails;
        }
        if (event.event.toLowerCase() === 'endpointdetail') {
            result.endpoint.extension = event.objectname;
            result.endpoint.state = this.getState(event.devicestate);
        }
        else if (event.event.toLowerCase() === 'authdetail') {
            result.endpoint.password = event.password;
            result.endpoint.authtype = event.authtype;
        }
    }
    /**
     * Event handler for endpointdetailcomplete event indicating that all the data
     * is received.
     */
    onEndpointDetailComplete(event) {
        if (event.actionid !== this.actionid) {
            this.logger.error({
                msg: 'onEndpointDetailComplete() Unusual behavior. ActionId does not belong to this object',
                eventActionId: event.actionid,
                actionId: this.actionid,
            });
            return;
        }
        this.resetEventHandlers();
        const { result } = this;
        this.returnResolve({ result: result.endpoint });
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
            case Commands_1.Commands.extension_list.toString(): {
                this.connection.on('endpointlist', new CallbackContext_1.CallbackContext(this.onEndpointList.bind(this), this));
                this.connection.on('endpointlistcomplete', new CallbackContext_1.CallbackContext(this.onEndpointListComplete.bind(this), this));
                break;
            }
            case Commands_1.Commands.extension_info.toString(): {
                this.connection.on('endpointdetail', new CallbackContext_1.CallbackContext(this.onEndpointInfo.bind(this), this));
                this.connection.on('authdetail', new CallbackContext_1.CallbackContext(this.onEndpointInfo.bind(this), this));
                this.connection.on('endpointdetailcomplete', new CallbackContext_1.CallbackContext(this.onEndpointDetailComplete.bind(this), this));
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
            case Commands_1.Commands.extension_list.toString(): {
                this.connection.off('endpointlist', this);
                this.connection.off('endpointlistcomplete', this);
                break;
            }
            case Commands_1.Commands.extension_info.toString(): {
                this.connection.off('endpointdetail', this);
                this.connection.off('authdetail', this);
                this.connection.off('endpointdetailcomplete', this);
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
            if (this.commandText === Commands_1.Commands.extension_list.toString()) {
                amiCommand = {
                    action: 'pjsipshowendpoints',
                };
            }
            else if (this.commandText === Commands_1.Commands.extension_info.toString()) {
                // |pjsipshowendpoint| needs input parameter |endpoint| indicating
                // which endpoint information is to be queried.
                amiCommand = {
                    action: 'pjsipshowendpoint',
                    endpoint: data.extension,
                };
            }
            this.logger.debug({ msg: `executeCommand() executing AMI command ${JSON.stringify(amiCommand)}`, data });
            const actionResultCallback = this.onActionResult.bind(this);
            const eventHandlerSetupCallback = this.setupEventHandlers.bind(this);
            return _super.prepareCommandAndExecution.call(this, amiCommand, actionResultCallback, eventHandlerSetupCallback);
        });
    }
}
exports.PJSIPEndpoint = PJSIPEndpoint;
