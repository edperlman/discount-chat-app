"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PbxEventsRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class PbxEventsRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'pbx_events', trash, {
            collectionNameResolver(name) {
                return name;
            },
        });
    }
    modelIndexes() {
        return [{ key: { uniqueId: 1 }, unique: true }];
    }
    findByEvents(callUniqueId, events) {
        return this.find({
            $or: [
                {
                    callUniqueId,
                },
                {
                    callUniqueIdFallback: callUniqueId,
                },
            ],
            event: {
                $in: events,
            },
        }, {
            sort: {
                ts: 1,
            },
        });
    }
    findOneByEvent(callUniqueId, event) {
        return this.findOne({
            $or: [
                {
                    callUniqueId,
                },
                {
                    callUniqueIdFallback: callUniqueId,
                },
            ],
            event,
        });
    }
    findOneByUniqueId(callUniqueId) {
        return this.findOne({
            $or: [
                {
                    callUniqueId,
                },
                {
                    callUniqueIdFallback: callUniqueId,
                },
            ],
        });
    }
}
exports.PbxEventsRaw = PbxEventsRaw;
