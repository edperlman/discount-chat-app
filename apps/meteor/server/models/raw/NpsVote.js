"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NpsVoteRaw = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const mongodb_1 = require("mongodb");
const BaseRaw_1 = require("./BaseRaw");
class NpsVoteRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'nps_vote', trash);
    }
    modelIndexes() {
        return [{ key: { npsId: 1, status: 1, sentAt: 1 } }, { key: { npsId: 1, identifier: 1 }, unique: true }];
    }
    findNotSentByNpsId(npsId, options) {
        const query = {
            npsId,
            status: core_typings_1.INpsVoteStatus.NEW,
        };
        const cursor = options ? this.find(query, options) : this.find(query);
        return cursor.sort({ ts: 1 }).limit(1000);
    }
    findByNpsIdAndStatus(npsId, status, options) {
        const query = {
            npsId,
            status,
        };
        if (options) {
            return this.find(query, options);
        }
        return this.find(query);
    }
    findByNpsId(npsId, options) {
        const query = {
            npsId,
        };
        if (options) {
            return this.find(query, options);
        }
        return this.find(query);
    }
    save(vote) {
        const { npsId, identifier } = vote;
        const query = {
            npsId,
            identifier,
        };
        const update = {
            $set: Object.assign(Object.assign({}, vote), { _updatedAt: new Date() }),
            $setOnInsert: {
                _id: new mongodb_1.ObjectId().toHexString(), // TODO this should be done by BaseRaw
            },
        };
        return this.updateOne(query, update, { upsert: true });
    }
    updateVotesToSent(voteIds) {
        const query = {
            _id: { $in: voteIds },
        };
        const update = {
            $set: {
                status: core_typings_1.INpsVoteStatus.SENT,
            },
        };
        return this.updateMany(query, update);
    }
    updateOldSendingToNewByNpsId(npsId) {
        const fiveMinutes = new Date();
        fiveMinutes.setMinutes(fiveMinutes.getMinutes() - 5);
        const query = {
            npsId,
            status: core_typings_1.INpsVoteStatus.SENDING,
            sentAt: { $lt: fiveMinutes },
        };
        const update = {
            $set: {
                status: core_typings_1.INpsVoteStatus.NEW,
            },
            $unset: {
                sentAt: 1, // why do you do this to me TypeScript?
            },
        };
        return this.updateMany(query, update);
    }
    countByNpsId(npsId) {
        return this.countDocuments({ npsId });
    }
    countByNpsIdAndStatus(npsId, status) {
        const query = {
            npsId,
            status,
        };
        return this.countDocuments(query);
    }
}
exports.NpsVoteRaw = NpsVoteRaw;
