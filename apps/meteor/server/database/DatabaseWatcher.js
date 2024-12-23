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
exports.DatabaseWatcher = void 0;
const events_1 = __importDefault(require("events"));
const string_helpers_1 = require("@rocket.chat/string-helpers");
const mongodb_1 = require("mongodb");
const convertChangeStreamPayload_1 = require("./convertChangeStreamPayload");
const convertOplogPayload_1 = require("./convertOplogPayload");
const watchCollections_1 = require("./watchCollections");
const instancePing = parseInt(String(process.env.MULTIPLE_INSTANCES_PING_INTERVAL)) || 10000;
const maxDocMs = instancePing * 4; // 4 times the ping interval
const ignoreChangeStream = ['yes', 'true'].includes(String(process.env.IGNORE_CHANGE_STREAM).toLowerCase());
const useMeteorOplog = ['yes', 'true'].includes(String(process.env.USE_NATIVE_OPLOG).toLowerCase());
const useFullDocument = ['yes', 'true'].includes(String(process.env.CHANGESTREAM_FULL_DOCUMENT).toLowerCase());
class DatabaseWatcher extends events_1.default {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    constructor({ db, _oplogHandle, metrics, logger: LoggerClass }) {
        super();
        this.resumeRetryCount = 0;
        this.db = db;
        this._oplogHandle = _oplogHandle;
        this.metrics = metrics;
        this.logger = new LoggerClass('DatabaseWatcher');
    }
    watch() {
        return __awaiter(this, void 0, void 0, function* () {
            this.watchCollections = (0, watchCollections_1.getWatchCollections)();
            if (useMeteorOplog) {
                // TODO remove this when updating to Meteor 2.8
                this.logger.warn('Using USE_NATIVE_OPLOG=true is currently discouraged due to known performance issues. Please use IGNORE_CHANGE_STREAM=true instead.');
                this.watchMeteorOplog();
                return;
            }
            if (ignoreChangeStream) {
                yield this.watchOplog();
                return;
            }
            try {
                this.watchChangeStream();
            }
            catch (err) {
                yield this.watchOplog();
            }
        });
    }
    watchOplog() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!process.env.MONGO_OPLOG_URL) {
                throw Error('No $MONGO_OPLOG_URL provided');
            }
            const isMasterDoc = yield this.db.admin().command({ ismaster: 1 });
            if (!(isMasterDoc === null || isMasterDoc === void 0 ? void 0 : isMasterDoc.setName)) {
                throw Error("$MONGO_URL should be a replica set's URL");
            }
            const dbName = this.db.databaseName;
            const client = new mongodb_1.MongoClient(process.env.MONGO_OPLOG_URL, {
                maxPoolSize: 1,
            });
            if (client.db().databaseName !== 'local') {
                throw Error("$MONGO_OPLOG_URL must be set to the 'local' database of a Mongo replica set");
            }
            yield client.connect();
            this.logger.startup('Using oplog');
            const db = client.db();
            const oplogCollection = db.collection('oplog.rs');
            const lastOplogEntry = yield oplogCollection.findOne({}, { sort: { $natural: -1 }, projection: { _id: 0, ts: 1 } });
            const oplogSelector = Object.assign({ ns: new RegExp(`^(?:${[(0, string_helpers_1.escapeRegExp)(`${dbName}.`)].join('|')})`), op: { $in: ['i', 'u', 'd'] } }, (lastOplogEntry && { ts: { $gt: lastOplogEntry.ts } }));
            const cursor = oplogCollection.find(oplogSelector);
            cursor.addCursorFlag('tailable', true);
            cursor.addCursorFlag('awaitData', true);
            cursor.addCursorFlag('oplogReplay', true);
            const stream = cursor.stream();
            stream.on('data', (doc) => {
                const doesMatter = this.watchCollections.some((collection) => doc.ns === `${dbName}.${collection}`);
                if (!doesMatter) {
                    return;
                }
                this.emitDoc(doc.ns.slice(dbName.length + 1), (0, convertOplogPayload_1.convertOplogPayload)({
                    id: doc.op === 'u' ? doc.o2._id : doc.o._id,
                    op: doc,
                }));
            });
        });
    }
    watchMeteorOplog() {
        if (!this._oplogHandle) {
            throw new Error('no-oplog-handle');
        }
        this.logger.startup('Using Meteor oplog');
        this.watchCollections.forEach((collection) => {
            this._oplogHandle.onOplogEntry({ collection }, (event) => {
                this.emitDoc(collection, (0, convertOplogPayload_1.convertOplogPayload)(event));
            });
        });
    }
    watchChangeStream(resumeToken) {
        try {
            const options = Object.assign(Object.assign({}, (useFullDocument ? { fullDocument: 'updateLookup' } : {})), (resumeToken ? { startAfter: resumeToken } : {}));
            let lastEvent;
            const changeStream = this.db.watch([
                {
                    $match: {
                        'operationType': { $in: ['insert', 'update', 'delete'] },
                        'ns.coll': { $in: this.watchCollections },
                    },
                },
            ], options);
            changeStream.on('change', (event) => {
                // reset retry counter
                this.resumeRetryCount = 0;
                // save last event to resume on error
                lastEvent = event._id;
                this.emitDoc(event.ns.coll, (0, convertChangeStreamPayload_1.convertChangeStreamPayload)(event));
            });
            changeStream.on('error', (err) => {
                if (this.resumeRetryCount++ < 5) {
                    this.logger.warn({ msg: `Change stream error. Trying resume after ${this.resumeRetryCount} seconds.`, err });
                    setTimeout(() => {
                        this.watchChangeStream(lastEvent);
                    }, this.resumeRetryCount * 1000);
                    return;
                }
                throw err;
            });
            this.logger.startup('Using change streams');
        }
        catch (err) {
            this.logger.fatal({ msg: 'Cannot resume change stream.', err });
        }
    }
    emitDoc(collection, doc) {
        var _a;
        if (!doc) {
            return;
        }
        this.lastDocTS = new Date();
        (_a = this.metrics) === null || _a === void 0 ? void 0 : _a.oplog.inc({
            collection,
            op: doc.action,
        });
        this.emit(collection, doc);
    }
    on(collection, callback) {
        return super.on(collection, callback);
    }
    /**
     * @returns the last timestamp delta in miliseconds received from a real time event
     */
    getLastDocDelta() {
        return this.lastDocTS ? Date.now() - this.lastDocTS.getTime() : Infinity;
    }
    /**
     * @returns Indicates if the last document received is older than it should be. If that happens, it means that the oplog is not working properly
     */
    isLastDocDelayed() {
        return this.getLastDocDelta() > maxDocMs;
    }
}
exports.DatabaseWatcher = DatabaseWatcher;
