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
exports.CachedCollection = void 0;
const localforage_1 = __importDefault(require("localforage"));
const accounts_base_1 = require("meteor/accounts-base");
const meteor_1 = require("meteor/meteor");
const mongo_1 = require("meteor/mongo");
const reactive_var_1 = require("meteor/reactive-var");
const tracker_1 = require("meteor/tracker");
const baseURI_1 = require("../baseURI");
const loggedIn_1 = require("../loggedIn");
const CachedCollectionManager_1 = require("./CachedCollectionManager");
const SDKClient_1 = require("../../../app/utils/client/lib/SDKClient");
const isTruthy_1 = require("../../../lib/isTruthy");
const highOrderFunctions_1 = require("../../../lib/utils/highOrderFunctions");
const getConfig_1 = require("../utils/getConfig");
const hasId = (record) => typeof record === 'object' && record !== null && '_id' in record;
const hasUpdatedAt = (record) => typeof record === 'object' &&
    record !== null &&
    '_updatedAt' in record &&
    record._updatedAt instanceof Date;
const hasDeletedAt = (record) => typeof record === 'object' &&
    record !== null &&
    '_deletedAt' in record &&
    record._deletedAt instanceof Date;
const hasUnserializedUpdatedAt = (record) => typeof record === 'object' &&
    record !== null &&
    '_updatedAt' in record &&
    !(record._updatedAt instanceof Date);
localforage_1.default.config({ name: baseURI_1.baseURI });
class CachedCollection {
    constructor({ name, eventType = 'notify-user', userRelated = true }) {
        this.ready = new reactive_var_1.ReactiveVar(false);
        this.version = 18;
        this.updatedAt = new Date(0);
        this.save = (0, highOrderFunctions_1.withDebouncing)({ wait: 1000 })(() => __awaiter(this, void 0, void 0, function* () {
            this.log('saving cache');
            const data = this.collection.find().fetch();
            yield localforage_1.default.setItem(this.name, {
                updatedAt: this.updatedAt,
                version: this.version,
                token: this.getToken(),
                records: data,
            });
            this.log('saving cache (done)');
        }));
        this.collection = new mongo_1.Mongo.Collection(null);
        this.name = name;
        this.eventType = eventType;
        this.userRelated = userRelated;
        this.log = [(0, getConfig_1.getConfig)(`debugCachedCollection-${this.name}`), (0, getConfig_1.getConfig)('debugCachedCollection'), (0, getConfig_1.getConfig)('debug')].includes('true')
            ? console.log.bind(console, `%cCachedCollection ${this.name}`, `color: navy; font-weight: bold;`)
            : () => undefined;
        CachedCollectionManager_1.CachedCollectionManager.register(this);
        if (!userRelated) {
            void this.init();
            return;
        }
        if (process.env.NODE_ENV === 'test') {
            return;
        }
        (0, loggedIn_1.onLoggedIn)(() => {
            void this.init();
        });
        accounts_base_1.Accounts.onLogout(() => {
            this.ready.set(false);
        });
    }
    get eventName() {
        if (this.eventType === 'notify-user') {
            return `${meteor_1.Meteor.userId()}/${this.name}-changed`;
        }
        return `${this.name}-changed`;
    }
    getToken() {
        if (this.userRelated === false) {
            return undefined;
        }
        return accounts_base_1.Accounts._storedLoginToken();
    }
    loadFromCache() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield localforage_1.default.getItem(this.name);
            if (!data) {
                return false;
            }
            if (data.version < this.version || data.token !== this.getToken()) {
                return false;
            }
            if (data.records.length <= 0) {
                return false;
            }
            // updatedAt may be a Date or a string depending on the used localForage backend
            if (!(data.updatedAt instanceof Date)) {
                data.updatedAt = new Date(data.updatedAt);
            }
            if (Date.now() - data.updatedAt.getTime() >= 1000 * CachedCollection.MAX_CACHE_TIME) {
                return false;
            }
            this.log(`${data.records.length} records loaded from cache`);
            const deserializedRecords = data.records.map((record) => this.deserializeFromCache(record)).filter(isTruthy_1.isTruthy);
            const updatedAt = Math.max(...deserializedRecords.filter(hasUpdatedAt).map((record) => { var _a; return (_a = record === null || record === void 0 ? void 0 : record._updatedAt.getTime()) !== null && _a !== void 0 ? _a : 0; }));
            if (updatedAt > this.updatedAt.getTime()) {
                this.updatedAt = new Date(updatedAt);
            }
            this.collection._collection._docs._map = new Map(deserializedRecords.filter(hasId).map((record) => [this.collection._collection._docs._idStringify(record._id), record]));
            this.updatedAt = data.updatedAt || this.updatedAt;
            Object.values(this.collection._collection.queries).forEach((query) => this.collection._collection._recomputeResults(query));
            return true;
        });
    }
    deserializeFromCache(record) {
        if (typeof record !== 'object' || record === null) {
            return undefined;
        }
        return Object.assign(Object.assign({}, record), (hasUnserializedUpdatedAt(record) && {
            _updatedAt: new Date(record._updatedAt),
        }));
    }
    callLoad() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: workaround for bad function overload
            const data = yield SDKClient_1.sdk.call(`${this.name}/get`);
            return data;
        });
    }
    callSync(updatedSince) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: workaround for bad function overload
            const data = yield SDKClient_1.sdk.call(`${this.name}/get`, updatedSince);
            return data;
        });
    }
    loadFromServer() {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date();
            const lastTime = this.updatedAt;
            const data = yield this.callLoad();
            this.log(`${data.length} records loaded from server`);
            data.forEach((record) => {
                const newRecord = this.handleLoadFromServer(record);
                if (!hasId(newRecord)) {
                    return;
                }
                const { _id } = newRecord;
                this.collection.upsert({ _id }, newRecord);
                if (hasUpdatedAt(newRecord) && newRecord._updatedAt > this.updatedAt) {
                    this.updatedAt = newRecord._updatedAt;
                }
            });
            this.updatedAt = this.updatedAt === lastTime ? startTime : this.updatedAt;
        });
    }
    handleLoadFromServer(record) {
        return record;
    }
    handleReceived(record, _action) {
        return record;
    }
    handleSync(record, _action) {
        return record;
    }
    loadFromServerAndPopulate() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadFromServer();
            yield this.save();
        });
    }
    clearCacheOnLogout() {
        if (this.userRelated === true) {
            void this.clearCache();
        }
    }
    clearCache() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('clearing cache');
            yield localforage_1.default.removeItem(this.name);
            this.collection.remove({});
        });
    }
    setupListener() {
        return __awaiter(this, void 0, void 0, function* () {
            SDKClient_1.sdk.stream(this.eventType, [this.eventName], ((action, record) => __awaiter(this, void 0, void 0, function* () {
                this.log('record received', action, record);
                const newRecord = this.handleReceived(record, action);
                if (!hasId(newRecord)) {
                    return;
                }
                if (action === 'removed') {
                    this.collection.remove(newRecord._id);
                }
                else {
                    const { _id } = newRecord;
                    if (!_id) {
                        return;
                    }
                    this.collection.upsert({ _id }, newRecord);
                }
                yield this.save();
            })));
        });
    }
    trySync(delay = 10) {
        clearTimeout(this.timer);
        // Wait for an empty queue to load data again and sync
        this.timer = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.sync())) {
                return this.trySync(delay);
            }
            yield this.save();
        }), delay);
    }
    sync() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.updatedAt || this.updatedAt.getTime() === 0 || meteor_1.Meteor.connection._outstandingMethodBlocks.length !== 0) {
                return false;
            }
            const startTime = new Date();
            const lastTime = this.updatedAt;
            this.log(`syncing from ${this.updatedAt}`);
            const data = yield this.callSync(this.updatedAt);
            const changes = [];
            if (data.update && data.update.length > 0) {
                this.log(`${data.update.length} records updated in sync`);
                for (const record of data.update) {
                    const action = 'changed';
                    const newRecord = this.handleSync(record, action);
                    if (!hasId(newRecord)) {
                        continue;
                    }
                    const actionTime = hasUpdatedAt(newRecord) ? newRecord._updatedAt : startTime;
                    changes.push({
                        action: () => {
                            const { _id } = newRecord;
                            this.collection.upsert({ _id }, newRecord);
                            if (actionTime > this.updatedAt) {
                                this.updatedAt = actionTime;
                            }
                        },
                        timestamp: actionTime.getTime(),
                    });
                }
            }
            if (data.remove && data.remove.length > 0) {
                this.log(`${data.remove.length} records removed in sync`);
                for (const record of data.remove) {
                    const action = 'removed';
                    const newRecord = this.handleSync(record, action);
                    if (!hasId(newRecord) || !hasDeletedAt(newRecord)) {
                        continue;
                    }
                    const actionTime = newRecord._deletedAt;
                    changes.push({
                        action: () => {
                            const { _id } = newRecord;
                            this.collection.remove({ _id });
                            if (actionTime > this.updatedAt) {
                                this.updatedAt = actionTime;
                            }
                        },
                        timestamp: actionTime.getTime(),
                    });
                }
            }
            changes
                .sort((a, b) => a.timestamp - b.timestamp)
                .forEach((c) => {
                c.action();
            });
            this.updatedAt = this.updatedAt === lastTime ? startTime : this.updatedAt;
            return true;
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (yield this.loadFromCache()) {
                this.trySync();
            }
            else {
                yield this.loadFromServerAndPopulate();
            }
            this.ready.set(true);
            (_a = this.reconnectionComputation) === null || _a === void 0 ? void 0 : _a.stop();
            let wentOffline = tracker_1.Tracker.nonreactive(() => meteor_1.Meteor.status().status === 'offline');
            this.reconnectionComputation = tracker_1.Tracker.autorun(() => {
                const { status } = meteor_1.Meteor.status();
                if (status === 'offline') {
                    wentOffline = true;
                }
                if (status === 'connected' && wentOffline) {
                    this.trySync();
                }
            });
            return this.setupListener();
        });
    }
}
exports.CachedCollection = CachedCollection;
CachedCollection.MAX_CACHE_TIME = 60 * 60 * 24 * 30;
