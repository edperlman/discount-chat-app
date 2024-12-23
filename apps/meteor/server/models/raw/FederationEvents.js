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
exports.FederationEventsModel = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const sha256_1 = require("@rocket.chat/sha256");
const BaseRaw_1 = require("./BaseRaw");
class FederationEventsModel extends BaseRaw_1.BaseRaw {
    constructor(db, nameOrModel) {
        super(db, nameOrModel);
    }
    modelIndexes() {
        return [{ key: { hasChildren: 1 }, sparse: true }, { key: { timestamp: 1 } }];
    }
    getEventHash(contextQuery, event) {
        return (0, sha256_1.SHA256)(`${event.origin}${JSON.stringify(contextQuery)}${event.parentIds.join(',')}${event.type}${event.timestamp}${JSON.stringify(event.data)}`);
    }
    createEvent(origin, contextQuery, type, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let previousEventsIds = [];
            // If it is not a GENESIS event, we need to get the previous events
            if (type !== core_typings_1.eventTypes.GENESIS) {
                const previousEvents = yield this.find({ context: contextQuery, hasChildren: false }).toArray();
                // if (!previousEvents.length) {
                // 	throw new Error('Could not create event, the context does not exist');
                // }
                previousEventsIds = previousEvents.map((e) => e._id);
            }
            const event = {
                origin,
                context: contextQuery,
                parentIds: previousEventsIds || [],
                type,
                timestamp: new Date(),
                data,
                hasChildren: false,
                _id: '',
            };
            event._id = this.getEventHash(contextQuery, event);
            // this.insert(event);
            // Clear the "hasChildren" of those events
            yield this.updateMany({ _id: { $in: previousEventsIds } }, { $unset: { hasChildren: '' } });
            return event;
        });
    }
    createGenesisEvent(origin, contextQuery, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if genesis event already exists, if so, do not create
            const genesisEvent = yield this.findOne({ context: contextQuery, type: core_typings_1.eventTypes.GENESIS });
            if (genesisEvent) {
                throw new Error(`A GENESIS event for this context query already exists: ${JSON.stringify(contextQuery, null, 2)}`);
            }
            return this.createEvent(origin, contextQuery, core_typings_1.eventTypes.GENESIS, data);
        });
    }
    addEvent(contextQuery, event) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if the event does not exit
            const existingEvent = yield this.findOne({ _id: event._id });
            // If it does not, we insert it, checking for the parents
            if (!existingEvent) {
                // Check if we have the parents
                const parents = yield this.find({ context: contextQuery, _id: { $in: event.parentIds } }, { projection: { _id: 1 } }).toArray();
                const parentIds = parents.map(({ _id }) => _id);
                // This means that we do not have the parents of the event we are adding
                if (parentIds.length !== event.parentIds.length) {
                    const { origin } = event;
                    // Get the latest events for that context and origin
                    const latestEvents = yield this.find({ context: contextQuery, origin }, { projection: { _id: 1 } }).toArray();
                    const latestEventIds = latestEvents.map(({ _id }) => _id);
                    return {
                        success: false,
                        reason: 'missingParents',
                        // @ts-expect-error - Is this properly typed? parentIds seems to be an string[] (and its used as a filter on an $in query)
                        // but here it seems its an object of { _id: string }[] so I'm not sure if this is correct
                        missingParentIds: event.parentIds.filter(({ _id }) => parentIds.indexOf(_id) === -1),
                        latestEventIds,
                    };
                }
                // Clear the "hasChildren" of the parent events
                yield this.updateMany({ _id: { $in: parentIds } }, { $unset: { hasChildren: '' } });
                yield this.insertOne(event);
            }
            return {
                success: true,
            };
        });
    }
    getEventById(contextQuery, eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = yield this.findOne({ context: contextQuery, _id: eventId });
            return {
                success: !!event,
                event,
            };
        });
    }
    getLatestEvents(contextQuery, fromTimestamp) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.find({ context: contextQuery, timestamp: { $gt: new Date(fromTimestamp) } }).toArray();
        });
    }
    removeContextEvents(contextQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.deleteMany({ context: contextQuery });
        });
    }
}
exports.FederationEventsModel = FederationEventsModel;
