"use strict";
/**
 * Class representing the agent's queue information. This class stores the information
 * of all the queues that the agent is serving.
 *
 * @remarks
 * This class stores the necessary information of agent's queue stats.
 * It also maintains a history of agents queue operation history for current
 * login session. (Agent logging in to rocket-chat and logging off from rocket chat.)
 * Currently the data is stored locally but may sent back to server if such need exists.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueAggregator = void 0;
/**
 * Currently this class depends on the external users to update this class.
 * But in theory, this class serves as
 */
class QueueAggregator {
    constructor() {
        this.sessionQueueCallServingHistory = [];
        this.currentQueueMembershipStatus = {};
    }
    updateQueueInfo(queueName, queuedCalls) {
        var _a;
        if (!((_a = this.currentQueueMembershipStatus) === null || _a === void 0 ? void 0 : _a[queueName])) {
            // something is wrong. Queue is not found in the membership details.
            return;
        }
        this.currentQueueMembershipStatus[queueName].callsInQueue = queuedCalls;
    }
    setMembership(subscription) {
        this.extension = subscription.extension;
        subscription.queues.forEach((queue) => {
            const queueInfo = {
                queueName: queue.name,
                callsInQueue: 0,
            };
            this.currentQueueMembershipStatus[queue.name] = queueInfo;
        });
    }
    queueJoined(joiningDetails) {
        this.updateQueueInfo(joiningDetails.queuename, Number(joiningDetails.queuedcalls));
    }
    callPickedup(queue) {
        this.updateQueueInfo(queue.queuename, Number(queue.queuedcalls));
    }
    memberAdded(queue) {
        // current user is added in the queue which has queue count |queuedcalls|
        const queueInfo = {
            queueName: queue.queuename,
            callsInQueue: Number(queue.queuedcalls),
        };
        this.currentQueueMembershipStatus[queue.queuename] = queueInfo;
    }
    memberRemoved(queue) {
        var _a;
        // current user is removed from the queue which has queue count |queuedcalls|
        if (!((_a = this.currentQueueMembershipStatus) === null || _a === void 0 ? void 0 : _a[queue.queuename])) {
            // something is wrong. Queue is not found in the membership details.
            return;
        }
        delete this.currentQueueMembershipStatus[queue.queuename];
    }
    queueAbandoned(queue) {
        this.updateQueueInfo(queue.queuename, Number(queue.queuedcallafterabandon));
    }
    getCallWaitingCount() {
        return Object.entries(this.currentQueueMembershipStatus).reduce((acc, [_, value]) => acc + value.callsInQueue, 0);
    }
    getCurrentQueueName() {
        var _a;
        if ((_a = this.currentlyServing) === null || _a === void 0 ? void 0 : _a.queueInfo) {
            return this.currentlyServing.queueInfo.queueName;
        }
        return '';
    }
    callRinging(queueInfo) {
        var _a;
        if (!((_a = this.currentQueueMembershipStatus) === null || _a === void 0 ? void 0 : _a[queueInfo.queuename])) {
            return;
        }
        const queueServing = {
            queueInfo: this.currentQueueMembershipStatus[queueInfo.queuename],
            callerId: {
                callerId: queueInfo.callerid.id,
                callerName: queueInfo.callerid.name,
            },
            callStarted: undefined,
            callEnded: undefined,
            agentExtension: this.extension,
        };
        this.currentlyServing = queueServing;
    }
    callStarted() {
        if (this.currentlyServing) {
            this.currentlyServing.callStarted = new Date();
        }
    }
    callEnded() {
        // Latest calls are at lower index
        if (this.currentlyServing) {
            this.currentlyServing.callEnded = new Date();
            this.sessionQueueCallServingHistory.unshift(this.currentlyServing);
        }
    }
}
exports.QueueAggregator = QueueAggregator;
