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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agenda = void 0;
const events_1 = require("events");
const debug_1 = __importDefault(require("debug"));
const human_interval_1 = __importDefault(require("human-interval"));
const mongodb_1 = require("mongodb");
const Job_1 = require("./Job");
const JobProcessingQueue_1 = require("./JobProcessingQueue");
const createJob_1 = require("./createJob");
const hasMongoProtocol_1 = require("./lib/hasMongoProtocol");
const noCallback_1 = require("./lib/noCallback");
const debug = (0, debug_1.default)('agenda:agenda');
const defaultInterval = 5000;
class Agenda extends events_1.EventEmitter {
    constructor(config = {}) {
        super();
        this._definitions = {};
        this._name = config.name;
        this._processEvery = (0, human_interval_1.default)(config.processEvery) || defaultInterval;
        this._defaultConcurrency = config.defaultConcurrency || 5;
        this._maxConcurrency = config.maxConcurrency || 20;
        this._defaultLockLimit = config.defaultLockLimit || 0;
        this._lockLimit = config.lockLimit || 0;
        this._definitions = {};
        this._runningJobs = [];
        this._lockedJobs = [];
        this._jobQueue = new JobProcessingQueue_1.JobProcessingQueue();
        this._defaultLockLifetime = config.defaultLockLifeTime || 10 * 60 * 1000; // 10 minute default lockLifetime
        this._sort = config.sort || { nextRunAt: 1, priority: -1 };
        this._indexes = Object.assign(Object.assign({ name: 1 }, this._sort), { priority: -1, lockedAt: 1, nextRunAt: 1, disabled: 1 });
        this._isLockingOnTheFly = false;
        this._jobsToLock = [];
        this._ready = new Promise((resolve) => this.once('ready', resolve));
        if (config.mongo) {
            this.mongo(config.mongo, config.db ? config.db.collection : undefined);
        }
        else if (config.db) {
            this.database(config.db.address, config.db.collection, config.db.options);
        }
    }
    mongo(mdb, collection) {
        var _a, _b, _c;
        this._mdb = mdb;
        if (mdb.s && mdb.topology && mdb.topology.s) {
            this._mongoUseUnifiedTopology = Boolean((_c = (_b = (_a = mdb === null || mdb === void 0 ? void 0 : mdb.topology) === null || _a === void 0 ? void 0 : _a.s) === null || _b === void 0 ? void 0 : _b.options) === null || _c === void 0 ? void 0 : _c.useUnifiedTopology);
        }
        return this.dbInit(collection);
    }
    /**
     * * NOTE:
     * If `url` includes auth details then `options` must specify: { 'uri_decode_auth': true }. This does Auth on
     * the specified database, not the Admin database. If you are using Auth on the Admin DB and not on the Agenda DB,
     * then you need to authenticate against the Admin DB and then pass the MongoDB instance into the constructor
     * or use Agenda.mongo(). If your app already has a MongoDB connection then use that. ie. specify config.mongo in
     * the constructor or use Agenda.mongo().
     */
    database(url_1, collection_1) {
        return __awaiter(this, arguments, void 0, function* (url, collection, options = {}) {
            if (!(0, hasMongoProtocol_1.hasMongoProtocol)(url)) {
                url = `mongodb://${url}`;
            }
            collection = collection || 'agendaJobs';
            options = Object.assign({}, options);
            try {
                const client = yield mongodb_1.MongoClient.connect(url, options);
                debug('successful connection to MongoDB using collection: [%s]', collection);
                this._db = client;
                this._mdb = client.db();
                this.dbInit(collection);
            }
            catch (error) {
                debug('error connecting to MongoDB using collection: [%s]', collection);
                return error;
            }
        });
    }
    dbInit(collection) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('init database collection using name [%s]', collection);
            this._collection = this.getMongoDB().collection(collection || 'agendaJobs');
            debug('attempting index creation');
            try {
                yield this._collection.createIndex(this._indexes, { name: 'findAndLockNextJobIndex' });
                debug('index creation success');
                this.emit('ready');
            }
            catch (err) {
                debug('index creation failed');
                this.emit('error', err);
            }
        });
    }
    name(name) {
        debug('Agenda.name(%s)', name);
        this._name = name;
        return this;
    }
    processEvery(time) {
        debug('Agenda.processEvery(%d)', time);
        this._processEvery = (0, human_interval_1.default)(time) || defaultInterval;
        return this;
    }
    maxConcurrency(num) {
        debug('Agenda.maxConcurrency(%d)', num);
        this._maxConcurrency = num;
        return this;
    }
    defaultConcurrency(num) {
        debug('Agenda.defaultConcurrency(%d)', num);
        this._defaultConcurrency = num;
        return this;
    }
    lockLimit(num) {
        debug('Agenda.lockLimit(%d)', num);
        this._lockLimit = num;
        return this;
    }
    defaultLockLimit(num) {
        debug('Agenda.defaultLockLimit(%d)', num);
        this._defaultLockLimit = num;
        return this;
    }
    defaultLockLifetime(ms) {
        debug('Agenda.defaultLockLifetime(%d)', ms);
        this._defaultLockLifetime = ms;
        return this;
    }
    sort(query) {
        debug('Agenda.sort([Object])');
        this._sort = query;
        return this;
    }
    create(name, data = {}) {
        debug('Agenda.create(%s, [Object])', name);
        const priority = this._definitions[name] ? this._definitions[name].priority : 0;
        const job = new Job_1.Job({
            name,
            data,
            type: 'normal',
            priority,
            agenda: this,
        });
        return job;
    }
    getCollection() {
        if (!this._collection) {
            throw new Error('Agenda instance is not ready yet');
        }
        return this._collection;
    }
    getMongoDB() {
        if (!this._mdb) {
            throw new Error('Agenda instance is not ready yet');
        }
        return this._mdb;
    }
    jobs() {
        return __awaiter(this, arguments, void 0, function* (query = {}, sort = {}, limit = 0, skip = 0) {
            const result = yield this.getCollection().find(query).sort(sort).limit(limit).skip(skip).toArray();
            return result.map((job) => (0, createJob_1.createJob)(this, job));
        });
    }
    purge() {
        return __awaiter(this, void 0, void 0, function* () {
            // @NOTE: Only use after defining your jobs
            const definedNames = Object.keys(this._definitions);
            debug('Agenda.purge(%o)', definedNames);
            return this.cancel({ name: { $not: { $in: definedNames } } });
        });
    }
    define(name, maybeOptions, maybeProcessor) {
        const processor = maybeProcessor || maybeOptions;
        const options = maybeProcessor ? maybeOptions : {};
        this._definitions[name] = {
            fn: processor,
            concurrency: options.concurrency || this._defaultConcurrency,
            lockLimit: options.lockLimit || this._defaultLockLimit,
            priority: options.priority || 0,
            lockLifetime: options.lockLifetime || this._defaultLockLifetime,
            running: 0,
            locked: 0,
        };
        debug('job [%s] defined with following options: \n%O', name, this._definitions[name]);
    }
    every(interval, names, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof names === 'string') {
                debug('Agenda.every(%s, %O, %O)', interval, names, options);
                return this._createIntervalJob(interval, names, data, options);
            }
            if (Array.isArray(names)) {
                debug('Agenda.every(%s, %s, %O)', interval, names, options);
                return this._createIntervalJobs(interval, names, data, options);
            }
            throw new Error('Unexpected error: Invalid job name(s)');
        });
    }
    _createIntervalJob(interval, name, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const job = this.create(name, data);
            job.attrs.type = 'single';
            job.repeatEvery(interval, options);
            yield job.save();
            return job;
        });
    }
    _createIntervalJobs(interval, names, data, options) {
        try {
            const jobs = names.map((name) => this._createIntervalJob(interval, name, data, options));
            debug('every() -> all jobs created successfully');
            return Promise.all(jobs);
        }
        catch (error) {
            debug('every() -> error creating one or more of the jobs', error);
        }
    }
    _createScheduledJob(when, name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const job = this.create(name, data);
            yield job.schedule(when).save();
            return job;
        });
    }
    _createScheduledJobs(when, names, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobs = yield Promise.all(names.map((name) => this._createScheduledJob(when, name, data)));
                debug('Agenda.schedule()::createJobs() -> all jobs created successfully');
                return jobs;
            }
            catch (error) {
                debug('Agenda.schedule()::createJobs() -> error creating one or more of the jobs');
                throw error;
            }
        });
    }
    schedule(when, names, data) {
        if (typeof names === 'string') {
            debug('Agenda.schedule(%s, %O, [%O], cb)', when, names);
            return this._createScheduledJob(when, names, data);
        }
        if (Array.isArray(names)) {
            debug('Agenda.schedule(%s, %O, [%O])', when, names);
            return this._createScheduledJobs(when, names, data);
        }
        throw new Error('Unexpected error: invalid job name(s)');
    }
    now(name, data, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('Agenda.now(%s, [Object])', name);
            try {
                (0, noCallback_1.noCallback)([name, data, ...args], 2);
                const job = this.create(name, data);
                job.schedule(new Date());
                yield job.save();
                return job;
            }
            catch (error) {
                debug('error trying to create a job for this exact moment');
                throw error;
            }
        });
    }
    cancel(query) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('attempting to cancel all Agenda jobs', query);
            try {
                const { deletedCount } = yield this.getCollection().deleteMany(query);
                debug('%s jobs cancelled', deletedCount || 0);
                return deletedCount || 0;
            }
            catch (error) {
                debug('error trying to delete jobs from MongoDB');
                throw error;
            }
        });
    }
    has(query) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('checking whether Agenda has any jobs matching query', query);
            const record = yield this.getCollection().findOne(query, { projection: { _id: 1 } });
            return record !== null;
        });
    }
    _processDbResult(job, result) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('processDbResult() called with success, checking whether to process job immediately or not');
            // We have a result from the above calls
            // findOneAndUpdate() returns different results than insertOne() so check for that
            const res = yield (() => __awaiter(this, void 0, void 0, function* () {
                if ('value' in result) {
                    return result.value;
                }
                if ('insertedId' in result) {
                    return this.getCollection().findOne({ _id: result.insertedId });
                }
                return null;
            }))();
            if (!res) {
                debug('job not found');
                return;
            }
            job.attrs._id = res._id;
            job.attrs.nextRunAt = res.nextRunAt;
            // If the current job would have been processed in an older scan, process the job immediately
            if (job.attrs.nextRunAt && job.attrs.nextRunAt < this._nextScanAt) {
                debug('[%s:%s] job would have ran by nextScanAt, processing the job immediately', job.attrs.name, res._id);
                this.processJobs(job);
            }
        });
    }
    _updateJob(job, props) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = job.attrs._id;
            const update = {
                $set: props,
            };
            // Update the job and process the resulting data'
            debug('job already has _id, calling findOneAndUpdate() using _id as query');
            const result = yield this.getCollection().findOneAndUpdate({ _id: id }, update, { returnDocument: 'after' });
            return this._processDbResult(job, result);
        });
    }
    _saveSingleJob(job, props, now) {
        return __awaiter(this, void 0, void 0, function* () {
            // Job type set to 'single' so...
            debug('job with type of "single" found');
            const { nextRunAt } = props, $set = __rest(props, ["nextRunAt"]);
            const $setOnInsert = {};
            if (nextRunAt && nextRunAt <= now) {
                debug('job has a scheduled nextRunAt time, protecting that field from upsert');
                $setOnInsert.nextRunAt = nextRunAt;
            }
            else {
                $set.nextRunAt = nextRunAt;
            }
            const update = Object.assign({ $set }, (Object.keys($setOnInsert).length && { $setOnInsert }));
            // Try an upsert
            debug('calling findOneAndUpdate() with job name and type of "single" as query');
            const result = yield this.getCollection().findOneAndUpdate({
                name: props.name,
                type: 'single',
            }, update, {
                upsert: true,
                returnDocument: 'after',
            });
            return this._processDbResult(job, result);
        });
    }
    _saveUniqueJob(job, props) {
        return __awaiter(this, void 0, void 0, function* () {
            // If we want the job to be unique, then we can upsert based on the 'unique' query object that was passed in
            const { unique: query, uniqueOpts } = job.attrs;
            if (!query) {
                throw new Error('Unexpected Error: No unique data to store on the job');
            }
            query.name = props.name;
            const update = (uniqueOpts === null || uniqueOpts === void 0 ? void 0 : uniqueOpts.insertOnly) ? { $setOnInsert: props } : { $set: props };
            // Use the 'unique' query object to find an existing job or create a new one
            debug('calling findOneAndUpdate() with unique object as query: \n%O', query);
            const result = yield this.getCollection().findOneAndUpdate(query, update, { upsert: true, returnDocument: 'after' });
            return this._processDbResult(job, result);
        });
    }
    _saveNewJob(job, props) {
        return __awaiter(this, void 0, void 0, function* () {
            // If all else fails, the job does not exist yet so we just insert it into MongoDB
            debug('using default behavior, inserting new job via insertOne() with props that were set: \n%O', props);
            const result = yield this.getCollection().insertOne(props);
            return this._processDbResult(job, result);
        });
    }
    saveJob(job) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                debug('attempting to save a job into Agenda instance');
                // Grab information needed to save job but that we don't want to persist in MongoDB
                const id = job.attrs._id;
                const props = job.toJSON();
                // delete props._id;
                // delete props.unique;
                // delete props.uniqueOpts;
                // Store name of agenda queue as last modifier in job data
                props.lastModifiedBy = this._name;
                debug('[job %s] set job props: \n%O', id, props);
                // Grab current time and set default query options for MongoDB
                const now = new Date();
                debug('current time stored as %s', now.toISOString());
                // If the job already had an ID, then update the properties of the job
                // i.e, who last modified it, etc
                if (id) {
                    return this._updateJob(job, props);
                }
                if (props.type === 'single') {
                    return this._saveSingleJob(job, props, now);
                }
                if (job.attrs.unique) {
                    return this._saveUniqueJob(job, props);
                }
                return this._saveNewJob(job, props);
            }
            catch (error) {
                debug('processDbResult() received an error, job was not updated/created');
                throw error;
            }
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._processInterval) {
                debug('Agenda.start was already called, ignoring');
                return this._ready;
            }
            yield this._ready;
            debug('Agenda.start called, creating interval to call processJobs every [%dms]', this._processEvery);
            this._processInterval = setInterval(() => this.processJobs(), this._processEvery || defaultInterval);
            process.nextTick(() => this.processJobs());
        });
    }
    _unlockJobs() {
        return __awaiter(this, void 0, void 0, function* () {
            debug('Agenda._unlockJobs()');
            const jobIds = this._lockedJobs.map((job) => job.attrs._id);
            if (jobIds.length === 0) {
                debug('no jobs to unlock');
                return;
            }
            debug('about to unlock jobs with ids: %O', jobIds);
            yield this.getCollection().updateMany({ _id: { $in: jobIds } }, { $set: { lockedAt: null } });
            this._lockedJobs = [];
        });
    }
    stop() {
        debug('Agenda.stop called, clearing interval for processJobs()');
        clearInterval(this._processInterval);
        this._processInterval = undefined;
        return this._unlockJobs();
    }
    getDefinition(jobName) {
        return this._definitions[jobName];
    }
    _findAndLockNextJob(jobName, definition) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const now = new Date();
            const lockDeadline = new Date(Date.now().valueOf() - definition.lockLifetime);
            debug('_findAndLockNextJob(%s, [Function])', jobName);
            // Don't try and access MongoDB if we've lost connection to it.
            const client = (_b = (_a = (this.getMongoDB() || this.getMongoDB().db)) === null || _a === void 0 ? void 0 : _a.s) === null || _b === void 0 ? void 0 : _b.client;
            if (((_d = (_c = client === null || client === void 0 ? void 0 : client.topology) === null || _c === void 0 ? void 0 : _c.connections) === null || _d === void 0 ? void 0 : _d.call(_c).length) === 0 && !this._mongoUseUnifiedTopology) {
                if (client.topology.autoReconnect && !((_f = (_e = client.topology).isDestroyed) === null || _f === void 0 ? void 0 : _f.call(_e))) {
                    // Continue processing but notify that Agenda has lost the connection
                    debug('Missing MongoDB connection, not attempting to find and lock a job');
                    this.emit('error', new Error('Lost MongoDB connection'));
                }
                else {
                    // No longer recoverable
                    debug('topology.autoReconnect: %s, topology.isDestroyed(): %s', client.topology.autoReconnect, (_h = (_g = client.topology).isDestroyed) === null || _h === void 0 ? void 0 : _h.call(_g));
                    throw new Error('MongoDB connection is not recoverable, application restart required');
                }
            }
            else {
                // /**
                // * Query used to find job to run
                // * @type {{$and: [*]}}
                // */
                const JOB_PROCESS_WHERE_QUERY = {
                    $and: [
                        {
                            name: jobName,
                            disabled: { $ne: true },
                        },
                        {
                            $or: [
                                {
                                    lockedAt: { $eq: null },
                                    nextRunAt: { $lte: this._nextScanAt },
                                },
                                {
                                    lockedAt: { $lte: lockDeadline },
                                },
                            ],
                        },
                    ],
                };
                const JOB_PROCESS_SET_QUERY = { $set: { lockedAt: now } };
                // Find ONE and ONLY ONE job and set the 'lockedAt' time so that job begins to be processed
                const result = yield this.getCollection().findOneAndUpdate(JOB_PROCESS_WHERE_QUERY, JOB_PROCESS_SET_QUERY, {
                    returnDocument: 'after',
                    sort: this._sort,
                });
                let job;
                if (result.value) {
                    debug('found a job available to lock, creating a new job on Agenda with id [%s]', result.value._id);
                    job = (0, createJob_1.createJob)(this, result.value);
                }
                return job;
            }
        });
    }
    /**
     * Returns true if a job of the specified name can be locked.
     * Considers maximum locked jobs at any time if self._lockLimit is > 0
     * Considers maximum locked jobs of the specified name at any time if jobDefinition.lockLimit is > 0
     */
    _shouldLock(name) {
        const jobDefinition = this.getDefinition(name);
        let shouldLock = true;
        if (this._lockLimit && this._lockLimit <= this._lockedJobs.length) {
            shouldLock = false;
        }
        if (jobDefinition.lockLimit && jobDefinition.lockLimit <= jobDefinition.locked) {
            shouldLock = false;
        }
        debug('job [%s] lock status: shouldLock = %s', name, shouldLock);
        return shouldLock;
    }
    _enqueueJobs(job) {
        const jobs = Array.isArray(job) ? job : [job];
        jobs.forEach((job) => this._jobQueue.insert(job));
    }
    /**
     * Internal method that will lock a job and store it on MongoDB
     * This method is called when we immediately start to process a job without using the process interval
     * We do this because sometimes jobs are scheduled but will be run before the next process time
     */
    _lockOnTheFly() {
        return __awaiter(this, void 0, void 0, function* () {
            // Already running this? Return
            if (this._isLockingOnTheFly) {
                debug('lockOnTheFly() already running, returning');
                return;
            }
            // Don't have any jobs to run? Return
            if (this._jobsToLock.length === 0) {
                debug('no jobs to current lock on the fly, returning');
                this._isLockingOnTheFly = false;
                return;
            }
            // Set that we are running this
            this._isLockingOnTheFly = true;
            // Grab a job that needs to be locked
            const now = new Date();
            const job = this._jobsToLock.pop();
            if (!job) {
                throw new Error('Unexpected Error: Job not found [lockOnTheFly]');
            }
            // If locking limits have been hit, stop locking on the fly.
            // Jobs that were waiting to be locked will be picked up during a
            // future locking interval.
            if (!this._shouldLock(job.attrs.name)) {
                debug('lock limit hit for: [%s]', job.attrs.name);
                this._jobsToLock = [];
                this._isLockingOnTheFly = false;
                return;
            }
            // Query to run against collection to see if we need to lock it
            const criteria = {
                _id: job.attrs._id,
                lockedAt: null,
                nextRunAt: job.attrs.nextRunAt,
                disabled: { $ne: true },
            };
            // Update / options for the MongoDB query
            const update = { $set: { lockedAt: now } };
            // Lock the job in MongoDB!
            const resp = yield this.getCollection().findOneAndUpdate(criteria, update, { returnDocument: 'after' });
            if (resp.value) {
                const job = (0, createJob_1.createJob)(this, resp.value);
                debug('found job [%s] that can be locked on the fly', job.attrs.name);
                this._lockedJobs.push(job);
                this._definitions[job.attrs.name].locked++;
                this._enqueueJobs(job);
                this._jobProcessing();
            }
            // Mark lock on fly is done for now
            this._isLockingOnTheFly = false;
            // Re-run in case anything is in the queue
            yield this._lockOnTheFly();
        });
    }
    _jobQueueFilling(name) {
        return __awaiter(this, void 0, void 0, function* () {
            // Don't lock because of a limit we have set (lockLimit, etc)
            if (!this._shouldLock(name)) {
                debug('lock limit reached in queue filling for [%s]', name);
                return;
            }
            // Set the date of the next time we are going to run _processEvery function
            this._nextScanAt = new Date(Date.now() + this._processEvery || defaultInterval);
            // For this job name, find the next job to run and lock it!
            try {
                const job = yield this._findAndLockNextJob(name, this._definitions[name]);
                // Still have the job?
                // 1. Add it to lock list
                // 2. Add count of locked jobs
                // 3. Queue the job to actually be run now that it is locked
                // 4. Recursively run this same method we are in to check for more available jobs of same type!
                if (job) {
                    debug('[%s:%s] job locked while filling queue', name, job.attrs._id);
                    this._lockedJobs.push(job);
                    this._definitions[job.attrs.name].locked++;
                    this._enqueueJobs(job);
                    yield this._jobQueueFilling(name);
                    this._jobProcessing();
                }
            }
            catch (error) {
                debug('[%s] job lock failed while filling queue', name, error);
            }
        });
    }
    _runOrRetry() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._processInterval) {
                return;
            }
            const job = this._jobQueue.pop();
            if (!job) {
                return;
            }
            const jobDefinition = this._definitions[job.attrs.name];
            if (jobDefinition.concurrency > jobDefinition.running && this._runningJobs.length < this._maxConcurrency) {
                // Get the deadline of when the job is not supposed to go past for locking
                const lockDeadline = new Date(Date.now() - jobDefinition.lockLifetime);
                // This means a job has "expired", as in it has not been "touched" within the lockoutTime
                // Remove from local lock
                // NOTE: Shouldn't we update the 'lockedAt' value in MongoDB so it can be picked up on restart?
                if (job.attrs.lockedAt && job.attrs.lockedAt < lockDeadline) {
                    debug('[%s:%s] job lock has expired, freeing it up', job.attrs.name, job.attrs._id);
                    this._lockedJobs.splice(this._lockedJobs.indexOf(job), 1);
                    jobDefinition.locked--;
                    this._jobProcessing();
                    return;
                }
                // Add to local "running" queue
                this._runningJobs.push(job);
                jobDefinition.running++;
                // CALL THE ACTUAL METHOD TO PROCESS THE JOB!!!
                debug('[%s:%s] processing job', job.attrs.name, job.attrs._id);
                job
                    .run()
                    .then((jobRan) => [null, jobRan])
                    .catch((error) => [error, job])
                    .then(([error, jobRan]) => this._processJobResult(error, jobRan));
            }
            else {
                // Run the job immediately by putting it on the top of the queue
                debug('[%s:%s] concurrency preventing immediate run, pushing job to top of queue', job.attrs.name, job.attrs._id);
                this._enqueueJobs(job);
            }
        });
    }
    _jobProcessing() {
        // Ensure we have jobs
        if (this._jobQueue.length === 0) {
            return;
        }
        // Store for all sorts of things
        const now = new Date();
        // Get the next job that is not blocked by concurrency
        const job = this._jobQueue.returnNextConcurrencyFreeJob(this._definitions);
        if (!job.attrs.nextRunAt) {
            return;
        }
        debug('[%s:%s] about to process job', job.attrs.name, job.attrs._id);
        // If the 'nextRunAt' time is older than the current time, run the job
        // Otherwise, setTimeout that gets called at the time of 'nextRunAt'
        if (job.attrs.nextRunAt <= now) {
            debug('[%s:%s] nextRunAt is in the past, run the job immediately', job.attrs.name, job.attrs._id);
            this._runOrRetry();
        }
        else {
            const runIn = job.attrs.nextRunAt.valueOf() - now.valueOf();
            debug('[%s:%s] nextRunAt is in the future, calling setTimeout(%d)', job.attrs.name, job.attrs._id, runIn);
            setTimeout(() => this._jobProcessing(), runIn);
        }
    }
    _processJobResult(err, job) {
        if (err) {
            job.agenda.emit('error', err);
            return;
        }
        const { name } = job.attrs;
        // Job isn't in running jobs so throw an error
        if (!this._runningJobs.includes(job)) {
            debug('[%s] callback was called, job must have been marked as complete already', job.attrs._id);
            throw new Error(`callback already called - job ${name} already marked complete`);
        }
        // Remove the job from the running queue
        this._runningJobs.splice(this._runningJobs.indexOf(job), 1);
        if (this._definitions[name].running > 0) {
            this._definitions[name].running--;
        }
        // Remove the job from the locked queue
        this._lockedJobs.splice(this._lockedJobs.indexOf(job), 1);
        if (this._definitions[name].locked > 0) {
            this._definitions[name].locked--;
        }
        // Re-process jobs now that one has finished
        this._jobProcessing();
    }
    processJobs(extraJob) {
        debug('starting to process jobs');
        // Make sure an interval has actually been set
        // Prevents race condition with 'Agenda.stop' and already scheduled run
        if (!this._processInterval) {
            debug('no _processInterval set when calling processJobs, returning');
            return;
        }
        let jobName;
        // Determine whether or not we have a direct process call!
        if (!extraJob) {
            // Go through each jobName set in 'Agenda.process' and fill the queue with the next jobs
            for (jobName in this._definitions) {
                if (this._definitions.hasOwnProperty(jobName)) {
                    debug('queuing up job to process: [%s]', jobName);
                    this._jobQueueFilling(jobName);
                }
            }
        }
        else if (this._definitions[extraJob.attrs.name]) {
            // Add the job to list of jobs to lock and then lock it immediately!
            debug('job [%s] was passed directly to processJobs(), locking and running immediately', extraJob.attrs.name);
            this._jobsToLock.push(extraJob);
            this._lockOnTheFly();
        }
    }
}
exports.Agenda = Agenda;
