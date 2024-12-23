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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRaw = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const mongodb_1 = require("mongodb");
const setUpdatedAt_1 = require("./setUpdatedAt");
const warnFields = process.env.NODE_ENV !== 'production' || process.env.SHOW_WARNINGS === 'true'
    ? (...rest) => {
        console.warn(...rest, new Error().stack);
    }
    : new Function();
class BaseRaw {
    /**
     * @param db MongoDB instance
     * @param name Name of the model without any prefix. Used by trash records to set the `__collection__` field.
     * @param trash Trash collection instance
     * @param options Model options
     */
    constructor(db, name, trash, options) {
        var _a;
        this.db = db;
        this.name = name;
        this.trash = trash;
        this.options = options;
        this.collectionName = (options === null || options === void 0 ? void 0 : options.collectionNameResolver) ? options.collectionNameResolver(name) : (0, models_1.getCollectionName)(name);
        this.col = this.db.collection(this.collectionName, (options === null || options === void 0 ? void 0 : options.collection) || {});
        void this.createIndexes();
        this.preventSetUpdatedAt = (_a = options === null || options === void 0 ? void 0 : options.preventSetUpdatedAt) !== null && _a !== void 0 ? _a : false;
        return (0, core_services_1.traceInstanceMethods)(this);
    }
    createIndexes() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const indexes = this.modelIndexes();
            if ((_a = this.options) === null || _a === void 0 ? void 0 : _a._updatedAtIndexOptions) {
                indexes === null || indexes === void 0 ? void 0 : indexes.push(Object.assign(Object.assign({}, this.options._updatedAtIndexOptions), { key: { _updatedAt: 1 } }));
            }
            if (indexes === null || indexes === void 0 ? void 0 : indexes.length) {
                if (this.pendingIndexes) {
                    yield this.pendingIndexes;
                }
                this.pendingIndexes = this.col.createIndexes(indexes).catch((e) => {
                    console.warn(`Some indexes for collection '${this.collectionName}' could not be created:\n\t${e.message}`);
                });
                void this.pendingIndexes.finally(() => {
                    this.pendingIndexes = undefined;
                });
                return this.pendingIndexes;
            }
        });
    }
    modelIndexes() {
        return undefined;
    }
    getCollectionName() {
        return this.collectionName;
    }
    getUpdater() {
        return new models_1.UpdaterImpl();
    }
    updateFromUpdater(query, updater) {
        const updateFilter = updater.getUpdateFilter();
        return this.updateOne(query, updateFilter).catch((e) => {
            console.warn(e, updateFilter);
            return Promise.reject(e);
        });
    }
    doNotMixInclusionAndExclusionFields(options = {}) {
        const optionsDef = this.ensureDefaultFields(options);
        if ((optionsDef === null || optionsDef === void 0 ? void 0 : optionsDef.projection) === undefined) {
            return optionsDef;
        }
        const projection = optionsDef === null || optionsDef === void 0 ? void 0 : optionsDef.projection;
        const keys = Object.keys(projection);
        const removeKeys = keys.filter((key) => projection[key] === 0);
        if (keys.length > removeKeys.length) {
            removeKeys.forEach((key) => delete projection[key]);
        }
        return Object.assign(Object.assign({}, optionsDef), { projection });
    }
    ensureDefaultFields(options) {
        if (options === null || options === void 0 ? void 0 : options.fields) {
            warnFields("Using 'fields' in models is deprecated.", options);
        }
        if (this.defaultFields === undefined) {
            return options;
        }
        const _a = options || {}, { fields: deprecatedFields, projection } = _a, rest = __rest(_a, ["fields", "projection"]);
        const fields = Object.assign(Object.assign({}, deprecatedFields), projection);
        return Object.assign(Object.assign({ projection: this.defaultFields }, (fields && Object.values(fields).length && { projection: fields })), rest);
    }
    findOneAndUpdate(query, update, options) {
        this.setUpdatedAt(update);
        return this.col.findOneAndUpdate(query, update, options || {});
    }
    findOneById(_id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { _id };
            if (options) {
                return this.findOne(query, options);
            }
            return this.findOne(query);
        });
    }
    findOne() {
        return __awaiter(this, arguments, void 0, function* (query = {}, options) {
            const q = typeof query === 'string' ? { _id: query } : query;
            const optionsDef = this.doNotMixInclusionAndExclusionFields(options);
            if (optionsDef) {
                return this.col.findOne(q, optionsDef);
            }
            return this.col.findOne(q);
        });
    }
    find(query = {}, options) {
        const optionsDef = this.doNotMixInclusionAndExclusionFields(options);
        return this.col.find(query, optionsDef);
    }
    findPaginated(query = {}, options) {
        const optionsDef = this.doNotMixInclusionAndExclusionFields(options);
        const cursor = optionsDef ? this.col.find(query, optionsDef) : this.col.find(query);
        const totalCount = this.col.countDocuments(query);
        return {
            cursor,
            totalCount,
        };
    }
    /**
     * @deprecated use {@link updateOne} or {@link updateAny} instead
     */
    update(filter, update, options) {
        const operation = (options === null || options === void 0 ? void 0 : options.multi) ? 'updateMany' : 'updateOne';
        return this[operation](filter, update, options);
    }
    updateOne(filter, update, options) {
        this.setUpdatedAt(update);
        if (options) {
            return this.col.updateOne(filter, update, options);
        }
        return this.col.updateOne(filter, update);
    }
    updateMany(filter, update, options) {
        this.setUpdatedAt(update);
        if (options) {
            return this.col.updateMany(filter, update, options);
        }
        return this.col.updateMany(filter, update);
    }
    insertMany(docs, options) {
        docs = docs.map((doc) => {
            if (!doc._id || typeof doc._id !== 'string') {
                const oid = new mongodb_1.ObjectId();
                return Object.assign({ _id: oid.toHexString() }, doc);
            }
            this.setUpdatedAt(doc);
            return doc;
        });
        // TODO reavaluate following type casting
        return this.col.insertMany(docs, options || {});
    }
    insertOne(doc, options) {
        if (!doc._id || typeof doc._id !== 'string') {
            const oid = new mongodb_1.ObjectId();
            doc = Object.assign({ _id: oid.toHexString() }, doc);
        }
        this.setUpdatedAt(doc);
        // TODO reavaluate following type casting
        return this.col.insertOne(doc, options || {});
    }
    removeById(_id) {
        return this.deleteOne({ _id });
    }
    removeByIds(ids) {
        return this.deleteMany({ _id: { $in: ids } });
    }
    deleteOne(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!this.trash) {
                if (options) {
                    return this.col.deleteOne(filter, options);
                }
                return this.col.deleteOne(filter);
            }
            const doc = yield this.findOne(filter);
            if (doc) {
                const { _id } = doc, record = __rest(doc, ["_id"]);
                const trash = Object.assign(Object.assign({}, record), { _deletedAt: new Date(), __collection__: this.name });
                // since the operation is not atomic, we need to make sure that the record is not already deleted/inserted
                yield ((_a = this.trash) === null || _a === void 0 ? void 0 : _a.updateOne({ _id }, { $set: trash }, {
                    upsert: true,
                }));
            }
            if (options) {
                return this.col.deleteOne(filter, options);
            }
            return this.col.deleteOne(filter);
        });
    }
    findOneAndDelete(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!this.trash) {
                return this.col.findOneAndDelete(filter, options || {});
            }
            const doc = yield this.col.findOne(filter);
            if (!doc) {
                return { ok: 1, value: null };
            }
            const { _id } = doc, record = __rest(doc, ["_id"]);
            const trash = Object.assign(Object.assign({}, record), { _deletedAt: new Date(), __collection__: this.name });
            yield ((_a = this.trash) === null || _a === void 0 ? void 0 : _a.updateOne({ _id }, { $set: trash }, {
                upsert: true,
            }));
            try {
                yield this.col.deleteOne({ _id });
            }
            catch (e) {
                yield ((_b = this.trash) === null || _b === void 0 ? void 0 : _b.deleteOne({ _id }));
                throw e;
            }
            return { ok: 1, value: doc };
        });
    }
    deleteMany(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            var _d, _e;
            if (!this.trash) {
                if (options) {
                    return this.col.deleteMany(filter, options);
                }
                return this.col.deleteMany(filter);
            }
            const cursor = this.find(filter, { session: options === null || options === void 0 ? void 0 : options.session });
            const ids = [];
            try {
                for (var _f = true, cursor_1 = __asyncValues(cursor), cursor_1_1; cursor_1_1 = yield cursor_1.next(), _a = cursor_1_1.done, !_a; _f = true) {
                    _c = cursor_1_1.value;
                    _f = false;
                    const doc = _c;
                    const _g = doc, { _id } = _g, record = __rest(_g, ["_id"]);
                    const trash = Object.assign(Object.assign({}, record), { _deletedAt: new Date(), __collection__: this.name });
                    ids.push(_id);
                    // since the operation is not atomic, we need to make sure that the record is not already deleted/inserted
                    yield ((_d = this.trash) === null || _d === void 0 ? void 0 : _d.updateOne({ _id }, { $set: trash }, {
                        upsert: true,
                        session: options === null || options === void 0 ? void 0 : options.session,
                    }));
                    void ((_e = options === null || options === void 0 ? void 0 : options.onTrash) === null || _e === void 0 ? void 0 : _e.call(options, doc));
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_f && !_a && (_b = cursor_1.return)) yield _b.call(cursor_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (options) {
                return this.col.deleteMany({ _id: { $in: ids } }, options);
            }
            return this.col.deleteMany({ _id: { $in: ids } });
        });
    }
    // Trash
    trashFind(query, options) {
        if (!this.trash) {
            return undefined;
        }
        if (options) {
            return this.trash.find(Object.assign({ __collection__: this.name }, query), options);
        }
        return this.trash.find(Object.assign({ __collection__: this.name }, query));
    }
    trashFindOneById(_id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                _id,
                __collection__: this.name,
            };
            if (!this.trash) {
                return null;
            }
            if (options) {
                return this.trash.findOne(query, options);
            }
            return this.trash.findOne(query);
        });
    }
    setUpdatedAt(record) {
        if (this.preventSetUpdatedAt) {
            return;
        }
        (0, setUpdatedAt_1.setUpdatedAt)(record);
    }
    trashFindDeletedAfter(deletedAt, query, options) {
        const q = Object.assign({ __collection__: this.name, _deletedAt: {
                $gt: deletedAt,
            } }, query);
        if (!this.trash) {
            throw new Error('Trash is not enabled for this collection');
        }
        if (options) {
            return this.trash.find(q, options);
        }
        return this.trash.find(q);
    }
    trashFindPaginatedDeletedAfter(deletedAt, query, options) {
        const q = Object.assign({ __collection__: this.name, _deletedAt: {
                $gt: deletedAt,
            } }, query);
        if (!this.trash) {
            throw new Error('Trash is not enabled for this collection');
        }
        const cursor = options ? this.trash.find(q, options) : this.trash.find(q);
        const totalCount = this.trash.countDocuments(q);
        return {
            cursor,
            totalCount,
        };
    }
    watch(pipeline) {
        return this.col.watch(pipeline);
    }
    countDocuments(query, options) {
        if (options) {
            return this.col.countDocuments(query, options);
        }
        return this.col.countDocuments(query);
    }
    estimatedDocumentCount() {
        return this.col.estimatedDocumentCount();
    }
}
exports.BaseRaw = BaseRaw;
