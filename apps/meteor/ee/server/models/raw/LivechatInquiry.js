"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LivechatInquiryRawEE = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const LivechatInquiry_1 = require("../../../../server/models/raw/LivechatInquiry");
// Note: Expect a circular dependency error here 😓
class LivechatInquiryRawEE extends LivechatInquiry_1.LivechatInquiryRaw {
    setSlaForRoom(rid, sla) {
        const { estimatedWaitingTimeQueue, slaId } = sla;
        return this.findOneAndUpdate({ rid }, {
            $set: {
                slaId,
                estimatedWaitingTimeQueue,
            },
        });
    }
    unsetSlaForRoom(rid) {
        return this.findOneAndUpdate({ rid }, {
            $unset: {
                slaId: 1,
            },
            $set: {
                estimatedWaitingTimeQueue: core_typings_1.DEFAULT_SLA_CONFIG.ESTIMATED_WAITING_TIME_QUEUE,
            },
        });
    }
    bulkUnsetSla(roomIds) {
        return this.updateMany({
            rid: { $in: roomIds },
        }, {
            $unset: {
                slaId: 1,
            },
            $set: {
                estimatedWaitingTimeQueue: core_typings_1.DEFAULT_SLA_CONFIG.ESTIMATED_WAITING_TIME_QUEUE,
            },
        });
    }
    setPriorityForRoom(rid, priority) {
        return this.findOneAndUpdate({ rid }, {
            $set: {
                priorityId: priority._id,
                priorityWeight: priority.sortItem,
            },
        });
    }
    unsetPriorityForRoom(rid) {
        return this.findOneAndUpdate({ rid }, {
            $unset: {
                priorityId: 1,
            },
            $set: {
                priorityWeight: core_typings_1.LivechatPriorityWeight.NOT_SPECIFIED,
            },
        });
    }
}
exports.LivechatInquiryRawEE = LivechatInquiryRawEE;
