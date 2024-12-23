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
exports.ContinuousMonitor = void 0;
/**
 * This class is responsible for continuously monitoring the activity happening
 * on the asterisk. It is suggested that this class should be used only
 * for events which needs a continuous monitoring. For other types of action based events
 * such as queuesummary etc, Other classes should be used.
 *
 *
 * @remarks :
 * To begin with, we need 2 events tobe monitored
 * QueueCallerJoin.count would give us the total elements in the queue.
 * AgentCalled.queue and AgentCalled.destcalleridnum to signify which agent is currently ringing to serve the call.
 * (AgentConnect.calleridnum, connectedlinenum, queue) to signify which agent ansered the call from which queue.
 *
 */
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const logger_1 = require("@rocket.chat/logger");
const models_1 = require("@rocket.chat/models");
const notifyListener_1 = require("../../../../../../app/lib/server/lib/notifyListener");
const Command_1 = require("../Command");
const Commands_1 = require("../Commands");
const ACDQueue_1 = require("./ACDQueue");
const CallbackContext_1 = require("./CallbackContext");
class ContinuousMonitor extends Command_1.Command {
    constructor(command, parametersNeeded, db) {
        super(command, parametersNeeded, db);
        this._type = Command_1.CommandType.AMI;
        this.logger = new logger_1.Logger('ContinuousMonitor');
    }
    getMembersFromQueueDetails(queueDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const { members } = queueDetails;
            if (!members) {
                return [];
            }
            const extensionList = members.map((m) => {
                return m.name.toLowerCase().replace('pjsip/', '');
            });
            this.logger.debug(`Finding members of queue ${queueDetails.name} between users`);
            return (yield models_1.Users.findByExtensions(extensionList).toArray()).map((u) => u._id);
        });
    }
    // Todo : Move this out of connector. This class is a busy class.
    // Not sure if we should do it here.
    getQueueDetails(queueName) {
        return __awaiter(this, void 0, void 0, function* () {
            const queue = new ACDQueue_1.ACDQueue(Commands_1.Commands.queue_details.toString(), true, this.db);
            queue.connection = this.connection;
            const queueDetails = yield queue.executeCommand({ queueName });
            return queueDetails.result;
        });
    }
    processQueueMembershipChange(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const extension = event.interface.toLowerCase().replace('pjsip/', '');
            const { queue } = event;
            const queueDetails = yield this.getQueueDetails(queue);
            const { calls } = queueDetails;
            const user = yield models_1.Users.findOneByExtension(extension, {
                projection: {
                    _id: 1,
                    username: 1,
                    extension: 1,
                },
            });
            if (user) {
                if ((0, core_typings_1.isIQueueMemberAddedEvent)(event)) {
                    void core_services_1.api.broadcast(`voip.events`, user._id, { data: { queue, queuedCalls: calls }, event: 'queue-member-added' });
                }
                else if ((0, core_typings_1.isIQueueMemberRemovedEvent)(event)) {
                    void core_services_1.api.broadcast(`voip.events`, user._id, { event: 'queue-member-removed', data: { queue, queuedCalls: calls } });
                }
            }
        });
    }
    processAgentCalled(event) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.debug(`Got new event queue.agentcalled at ${event.queue}`);
            const extension = event.interface.toLowerCase().replace('pjsip/', '');
            const user = yield models_1.Users.findOneByExtension(extension, {
                projection: {
                    _id: 1,
                    username: 1,
                    extension: 1,
                },
            });
            if (!user) {
                this.logger.debug(`Cannot broadcast queue.agentcalled. No agent found at extension ${extension}`);
                return;
            }
            this.logger.debug(`Broadcasting event queue.agentcalled to ${user._id}@${event.queue} on extension ${extension}`);
            const callerId = {
                id: event.calleridnum,
                name: event.calleridname,
            };
            void core_services_1.api.broadcast('voip.events', user._id, { event: 'agent-called', data: { callerId, queue: event.queue } });
            // api.broadcast('queue.agentcalled', user._id, event.queue, callerId);
        });
    }
    storePbxEvent(event, eventName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const now = new Date();
                // store pbx event
                if ((0, core_typings_1.isIContactStatusEvent)(event)) {
                    // This event represents when an agent drops a call because of disconnection
                    // May happen for any reason outside of our control, like closing the browswer
                    // Or network/power issues
                    const { insertedId } = yield models_1.PbxEvents.insertOne({
                        event: eventName,
                        uniqueId: `${eventName}-${event.contactstatus}-${now.getTime()}`,
                        ts: now,
                        agentExtension: event.aor,
                    });
                    void (0, notifyListener_1.notifyOnPbxEventChangedById)(insertedId, 'inserted');
                    return;
                }
                let uniqueId = `${eventName}-${event.calleridnum}-`;
                if (event.queue) {
                    uniqueId += `${event.queue}-${event.uniqueid}`;
                }
                else {
                    uniqueId += `${event.channel}-${event.destchannel}-${event.uniqueid}`;
                }
                // NOTE: using the uniqueId prop of event is not the recommented approach, since it's an opaque ID
                // However, since we're not using it for anything special, it's a "fair use"
                // uniqueId => {server}/{epoch}.{id of channel associated with this call}
                const { insertedId } = yield models_1.PbxEvents.insertOne({
                    uniqueId,
                    event: eventName,
                    ts: now,
                    phone: event.calleridnum,
                    queue: event.queue,
                    holdTime: (0, core_typings_1.isIAgentConnectEvent)(event) ? event.holdtime : '',
                    callUniqueId: event.uniqueid,
                    callUniqueIdFallback: event.linkedid,
                    agentExtension: event === null || event === void 0 ? void 0 : event.connectedlinenum,
                });
                void (0, notifyListener_1.notifyOnPbxEventChangedById)(insertedId, 'inserted');
            }
            catch (e) {
                this.logger.debug('Event was handled by other instance');
            }
        });
    }
    processAndBroadcastEventToAllQueueMembers(event) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.debug(`Broadcasting to memebers, event =  ${event.event}`);
            const queueDetails = yield this.getQueueDetails(event.queue);
            const members = yield this.getMembersFromQueueDetails(queueDetails);
            switch (event.event) {
                case 'QueueCallerJoin': {
                    const callerId = {
                        id: event.calleridnum,
                        name: event.calleridname,
                    };
                    yield this.storePbxEvent(event, 'QueueCallerJoin');
                    this.logger.debug(`Broadcasting event queue.callerjoined to ${members.length} agents on queue ${event.queue}`);
                    members.forEach((m) => {
                        void core_services_1.api.broadcast('voip.events', m, {
                            event: 'caller-joined',
                            data: { callerId, queue: event.queue, queuedCalls: event.count },
                        });
                    });
                    break;
                }
                case 'QueueCallerAbandon': {
                    const { calls } = queueDetails;
                    yield this.storePbxEvent(event, 'QueueCallerAbandon');
                    this.logger.debug(`Broadcasting event queue.callabandoned to ${members.length} agents on queue ${event.queue}`);
                    members.forEach((m) => {
                        void core_services_1.api.broadcast('voip.events', m, { event: 'call-abandoned', data: { queue: event.queue, queuedCallAfterAbandon: calls } });
                    });
                    break;
                }
                case 'AgentConnect': {
                    const { calls } = queueDetails;
                    yield this.storePbxEvent(event, 'AgentConnect');
                    this.logger.debug(`Broadcasting event queue.agentconnected to ${members.length} agents on queue ${event.queue}`);
                    members.forEach((m) => {
                        // event.holdtime signifies wait time in the queue.
                        void core_services_1.api.broadcast('voip.events', m, {
                            event: 'agent-connected',
                            data: { queue: event.queue, queuedCalls: calls, waitTimeInQueue: event.holdtime },
                        });
                    });
                    break;
                }
                default:
                    this.logger.error(`Cant process ${event}. No handlers associated with it`);
            }
        });
    }
    processHoldUnholdEvents(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.storePbxEvent(event, event.event);
        });
    }
    processHangupEvents(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.storePbxEvent(event, event.event);
        });
    }
    processContactStatusEvent(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event.contactstatus === 'Removed') {
                // Room closing logic should be added here for the aor
                // aor signifies address of record, which should be used for
                // fetching the room for which serverBy = event.aor
                return this.storePbxEvent(event, event.event);
            }
        });
    }
    isCallBeginEventPresent(pbxEvent, uniqueId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (pbxEvent && pbxEvent.callUniqueId === uniqueId) {
                switch (pbxEvent.event.toLowerCase()) {
                    case 'queuecallerjoin':
                    case 'agentconnect':
                        return true;
                    default:
                        return false;
                }
            }
            return false;
        });
    }
    manageDialEvents(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const pbxEvent = yield models_1.PbxEvents.findOneByUniqueId(event.uniqueid);
            /**
             * Dial events currently are used for detecting the outbound call
             * This will later be used for matching call events.
             *
             * Dial events are generated even for the queued calls but queue events
             * are not generated for direct calls (either outbound or directly to an agent).
             *
             * isCallBeginEventPresent checks if the call was off the queue. If it was,
             * we would not try add the dial-event to the pbx database.
             */
            if (yield this.isCallBeginEventPresent(pbxEvent, event.uniqueid)) {
                return;
            }
            if (!['answer', 'ringing'].includes(event.dialstatus.toLowerCase())) {
                this.logger.warn(`Received unexpected event ${event.event} dialstatus =  ${event.dialstatus}`);
                return;
            }
            /** This function adds necessary data to
             * pbx_events database for outbound calls.
             *
             * event?.connectedlinenum is the extension/phone number that is being called
             * and event.calleridnum is the extension that is initiating a call.
             */
            try {
                const { insertedId } = yield models_1.PbxEvents.insertOne({
                    uniqueId: `${event.event}-${event.calleridnum}-${event.channel}-${event.destchannel}-${event.uniqueid}`,
                    event: event.event,
                    ts: new Date(),
                    phone: event === null || event === void 0 ? void 0 : event.connectedlinenum.replace(/\D/g, ''), // Remove all non-numeric characters
                    callUniqueId: event.uniqueid,
                    callUniqueIdFallback: event.linkedid,
                    agentExtension: event.calleridnum,
                });
                void (0, notifyListener_1.notifyOnPbxEventChangedById)(insertedId, 'inserted');
            }
            catch (e) {
                // This could mean we received a duplicate event
                // This is quite common since DialEnd event happens "multiple times" at the end of the call
                // We receive one for DialEnd in progress and one for DialEnd finished.
                this.logger.warn(`Duplicate event ${event.event} received for ${event.uniqueid}`);
                this.logger.debug(event);
            }
        });
    }
    onEvent(event) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.debug(`Received event ${event.event}`);
            if ((0, core_typings_1.isIDialingEvent)(event)) {
                return this.manageDialEvents(event);
            }
            // Event received when a queue member is notified of a call in queue
            if ((0, core_typings_1.isIAgentCalledEvent)(event)) {
                return this.processAgentCalled(event);
            }
            // Event received when a call joins queue
            if ((0, core_typings_1.isIQueueCallerJoinEvent)(event)) {
                return this.processAndBroadcastEventToAllQueueMembers(event);
            }
            if ((0, core_typings_1.isIAgentConnectEvent)(event)) {
                return this.processAndBroadcastEventToAllQueueMembers(event);
            }
            if ((0, core_typings_1.isIQueueCallerAbandonEvent)(event)) {
                return this.processAndBroadcastEventToAllQueueMembers(event);
            }
            if ((0, core_typings_1.isIQueueMemberAddedEvent)(event) || (0, core_typings_1.isIQueueMemberRemovedEvent)(event)) {
                return this.processQueueMembershipChange(event);
            }
            if ((0, core_typings_1.isICallOnHoldEvent)(event) || (0, core_typings_1.isICallUnHoldEvent)(event)) {
                return this.processHoldUnholdEvents(event);
            }
            if ((0, core_typings_1.isIContactStatusEvent)(event)) {
                return this.processContactStatusEvent(event);
            }
            if ((0, core_typings_1.isICallHangupEvent)(event)) {
                return this.processHangupEvents(event);
            }
            // Asterisk sends a metric ton of events, some may be useful but others doesn't
            // We need to check which ones we want to use in future, but until that moment, this log
            // Will be commented to avoid unnecesary noise. You can uncomment if you want to see all events
            this.logger.debug(`Cannot handle event ${event.event}`);
        });
    }
    setupEventHandlers() {
        // Setup necessary command event handlers based on the command
        this.connection.on('queuecallerjoin', new CallbackContext_1.CallbackContext(this.onEvent.bind(this), this));
        this.connection.on('agentcalled', new CallbackContext_1.CallbackContext(this.onEvent.bind(this), this));
        this.connection.on('agentconnect', new CallbackContext_1.CallbackContext(this.onEvent.bind(this), this));
        this.connection.on('queuememberadded', new CallbackContext_1.CallbackContext(this.onEvent.bind(this), this));
        this.connection.on('queuememberremoved', new CallbackContext_1.CallbackContext(this.onEvent.bind(this), this));
        this.connection.on('queuecallerabandon', new CallbackContext_1.CallbackContext(this.onEvent.bind(this), this));
        this.connection.on('hold', new CallbackContext_1.CallbackContext(this.onEvent.bind(this), this));
        this.connection.on('unhold', new CallbackContext_1.CallbackContext(this.onEvent.bind(this), this));
        this.connection.on('contactstatus', new CallbackContext_1.CallbackContext(this.onEvent.bind(this), this));
        this.connection.on('hangup', new CallbackContext_1.CallbackContext(this.onEvent.bind(this), this));
        this.connection.on('dialend', new CallbackContext_1.CallbackContext(this.onEvent.bind(this), this));
        this.connection.on('dialstate', new CallbackContext_1.CallbackContext(this.onEvent.bind(this), this));
    }
    resetEventHandlers() {
        this.connection.off('queuecallerjoin', this);
        this.connection.off('agentcalled', this);
        this.connection.off('agentconnect', this);
        this.connection.off('queuememberadded', this);
        this.connection.off('queuememberremoved', this);
        this.connection.off('queuecallerabandon', this);
        this.connection.off('hold', this);
        this.connection.off('unhold', this);
        this.connection.off('contactstatus', this);
        this.connection.off('hangup', this);
        this.connection.off('dialend', this);
        this.connection.off('dialstate', this);
    }
    initMonitor(_data) {
        /**
         * See the implementation of |call| function in CallbackContext to understand
         * why we are using regex here.
         */
        this.actionid = '.*';
        this.setupEventHandlers();
        return true;
    }
    cleanMonitor() {
        this.resetEventHandlers();
        return true;
    }
}
exports.ContinuousMonitor = ContinuousMonitor;
