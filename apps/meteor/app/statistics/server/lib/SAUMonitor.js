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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SAUMonitorClass = void 0;
const cron_1 = require("@rocket.chat/cron");
const logger_1 = require("@rocket.chat/logger");
const models_1 = require("@rocket.chat/models");
const mem_1 = __importDefault(require("mem"));
const meteor_1 = require("meteor/meteor");
const ua_parser_js_1 = __importDefault(require("ua-parser-js"));
const UAParserCustom_1 = require("./UAParserCustom");
const getMostImportantRole_1 = require("../../../../lib/roles/getMostImportantRole");
const getClientAddress_1 = require("../../../../server/lib/getClientAddress");
const Sessions_1 = require("../../../../server/models/raw/Sessions");
const events_1 = require("../../../../server/services/sauMonitor/events");
const getDateObj = (dateTime = new Date()) => ({
    day: dateTime.getDate(),
    month: dateTime.getMonth() + 1,
    year: dateTime.getFullYear(),
});
const logger = new logger_1.Logger('SAUMonitor');
const getUserRoles = (0, mem_1.default)((userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield models_1.Users.findOneById(userId, { projection: { roles: 1 } });
    return (user === null || user === void 0 ? void 0 : user.roles) || [];
}), { maxAge: 5000 });
/**
 * Server Session Monitor for SAU(Simultaneously Active Users) based on Meteor server sessions
 */
class SAUMonitorClass {
    constructor() {
        this.scheduler = cron_1.cronJobs;
        this._started = false;
        this._dailyComputeJobName = 'aggregate-sessions';
        this._dailyFinishSessionsJobName = 'finish-sessions';
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isRunning()) {
                return;
            }
            yield this._startMonitoring();
            this._started = true;
            logger.debug('[start]');
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isRunning()) {
                return;
            }
            this._started = false;
            if (yield this.scheduler.has(this._dailyComputeJobName)) {
                yield this.scheduler.remove(this._dailyComputeJobName);
            }
            if (yield this.scheduler.has(this._dailyFinishSessionsJobName)) {
                yield this.scheduler.remove(this._dailyFinishSessionsJobName);
            }
            logger.debug('[stop]');
        });
    }
    isRunning() {
        return this._started === true;
    }
    _startMonitoring() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._handleAccountEvents();
                this._handleOnConnection();
                yield this._startCronjobs();
            }
            catch (err) {
                throw new meteor_1.Meteor.Error(err);
            }
        });
    }
    _handleOnConnection() {
        if (this.isRunning()) {
            return;
        }
        events_1.sauEvents.on('socket.disconnected', (_a) => __awaiter(this, [_a], void 0, function* ({ id, instanceId }) {
            if (!this.isRunning()) {
                return;
            }
            yield models_1.Sessions.closeByInstanceIdAndSessionId(instanceId, id);
        }));
    }
    _handleAccountEvents() {
        if (this.isRunning()) {
            return;
        }
        events_1.sauEvents.on('accounts.login', (_a) => __awaiter(this, [_a], void 0, function* ({ userId, connection }) {
            if (!this.isRunning()) {
                return;
            }
            const roles = yield getUserRoles(userId);
            const mostImportantRole = (0, getMostImportantRole_1.getMostImportantRole)(roles);
            const loginAt = new Date();
            const params = Object.assign({ userId, roles, mostImportantRole, loginAt }, getDateObj());
            yield this._handleSession(connection, params);
        }));
        events_1.sauEvents.on('accounts.logout', (_a) => __awaiter(this, [_a], void 0, function* ({ userId, connection }) {
            if (!this.isRunning()) {
                return;
            }
            const { id: sessionId } = connection;
            yield models_1.Sessions.logoutBySessionIdAndUserId({ sessionId, userId });
        }));
    }
    _handleSession(connection, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = this._getConnectionInfo(connection, params);
            if (!data) {
                return;
            }
            const searchTerm = this._getSearchTerm(data);
            yield models_1.Sessions.createOrUpdate(Object.assign(Object.assign({}, data), { searchTerm }));
        });
    }
    _finishSessionsFromDate(yesterday, today) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            if (!this.isRunning()) {
                return;
            }
            const { day, month, year } = getDateObj(yesterday);
            const beforeDateTime = new Date(year, month - 1, day, 23, 59, 59, 999);
            const currentDate = getDateObj(today);
            const nextDateTime = new Date(currentDate.year, currentDate.month - 1, currentDate.day);
            const cursor = models_1.Sessions.findSessionsNotClosedByDateWithoutLastActivity({ year, month, day });
            const batch = [];
            try {
                for (var _d = true, cursor_1 = __asyncValues(cursor), cursor_1_1; cursor_1_1 = yield cursor_1.next(), _a = cursor_1_1.done, !_a; _d = true) {
                    _c = cursor_1_1.value;
                    _d = false;
                    const session = _c;
                    // create a new session for the current day
                    batch.push(Object.assign(Object.assign(Object.assign({}, session), currentDate), { createdAt: nextDateTime }));
                    if (batch.length === 500) {
                        yield models_1.Sessions.createBatch(batch);
                        batch.length = 0;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = cursor_1.return)) yield _b.call(cursor_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (batch.length > 0) {
                yield models_1.Sessions.createBatch(batch);
            }
            // close all sessions from current 'date'
            yield models_1.Sessions.updateActiveSessionsByDate({ year, month, day }, {
                lastActivityAt: beforeDateTime,
            });
            // TODO missing an action to perform on dangling sessions (for example remove sessions not closed one month ago)
        });
    }
    _getSearchTerm(session) {
        var _a, _b, _c;
        return [(_a = session.device) === null || _a === void 0 ? void 0 : _a.name, (_b = session.device) === null || _b === void 0 ? void 0 : _b.type, (_c = session.device) === null || _c === void 0 ? void 0 : _c.os.name, session.sessionId, session.userId]
            .filter(Boolean)
            .join('');
    }
    _getConnectionInfo(connection, params) {
        var _a, _b;
        if (!connection) {
            return;
        }
        const ip = (0, getClientAddress_1.getClientAddress)(connection);
        const host = (_b = (_a = connection.httpHeaders) === null || _a === void 0 ? void 0 : _a.host) !== null && _b !== void 0 ? _b : '';
        return Object.assign(Object.assign(Object.assign(Object.assign({ type: 'session', sessionId: connection.id, instanceId: connection.instanceId }, (connection.loginToken && { loginToken: connection.loginToken })), { ip,
            host }), this._getUserAgentInfo(connection)), params);
    }
    _getUserAgentInfo(connection) {
        var _a, _b, _c, _d, _e;
        if (!((_a = connection === null || connection === void 0 ? void 0 : connection.httpHeaders) === null || _a === void 0 ? void 0 : _a['user-agent'])) {
            return;
        }
        const uaString = connection.httpHeaders['user-agent'];
        // TODO define a type for "result" below
        // | UAParser.IResult
        // | { device: { type: string; model?: string }; browser: undefined; os: undefined; app: { name: string; version: string } }
        // | {
        // 		device: { type: string; model?: string };
        // 		browser: undefined;
        // 		os: string;
        // 		app: { name: string; version: string };
        //   }
        const result = (() => {
            if (UAParserCustom_1.UAParserMobile.isMobileApp(uaString)) {
                return UAParserCustom_1.UAParserMobile.uaObject(uaString);
            }
            if (UAParserCustom_1.UAParserDesktop.isDesktopApp(uaString)) {
                return UAParserCustom_1.UAParserDesktop.uaObject(uaString);
            }
            const ua = new ua_parser_js_1.default(uaString);
            return ua.getResult();
        })();
        const info = {
            type: 'other',
            name: '',
            longVersion: '',
            os: {
                name: '',
                version: '',
            },
            version: '',
        };
        const removeEmptyProps = (obj) => {
            Object.keys(obj).forEach((p) => (!obj[p] || obj[p] === undefined) && delete obj[p]);
            return obj;
        };
        if ((_b = result.browser) === null || _b === void 0 ? void 0 : _b.name) {
            info.type = 'browser';
            info.name = result.browser.name;
            info.longVersion = result.browser.version || '';
        }
        if (typeof result.os !== 'string' && ((_c = result.os) === null || _c === void 0 ? void 0 : _c.name)) {
            info.os = removeEmptyProps(result.os) || '';
        }
        if (result.device && (result.device.type || result.device.model)) {
            info.type = result.device.type || '';
            if (result.hasOwnProperty('app') && ((_d = result.app) === null || _d === void 0 ? void 0 : _d.name)) {
                info.name = result.app.name;
                info.longVersion = result.app.version;
                if (result.app.bundle) {
                    info.longVersion += ` ${result.app.bundle}`;
                }
            }
        }
        if (typeof info.longVersion === 'string') {
            info.version = ((_e = info.longVersion.match(/(\d+\.){0,2}\d+/)) === null || _e === void 0 ? void 0 : _e[0]) || '';
        }
        return {
            device: info,
        };
    }
    _startCronjobs() {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info('[aggregate] - Start Cron.');
            const dailyComputeProcessTime = '0 2 * * *';
            const dailyFinishSessionProcessTime = '5 1 * * *';
            yield this.scheduler.add(this._dailyComputeJobName, dailyComputeProcessTime, () => __awaiter(this, void 0, void 0, function* () { return this._aggregate(); }));
            yield this.scheduler.add(this._dailyFinishSessionsJobName, dailyFinishSessionProcessTime, () => __awaiter(this, void 0, void 0, function* () {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                yield this._finishSessionsFromDate(yesterday, new Date());
            }));
        });
    }
    _aggregate() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_2, _b, _c;
            if (!this.isRunning()) {
                return;
            }
            const today = new Date();
            // get sessions from 3 days ago to make sure even if a few cron jobs were skipped, we still have the data
            const threeDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3, 0, 0, 0, 0);
            const period = { start: getDateObj(threeDaysAgo), end: getDateObj(today) };
            logger.info({ msg: '[aggregate] - Aggregating data.', period });
            try {
                for (var _d = true, _e = __asyncValues(Sessions_1.aggregates.dailySessions(models_1.Sessions.col, period)), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                    _c = _f.value;
                    _d = false;
                    const record = _c;
                    yield models_1.Sessions.updateDailySessionById(`${record.userId}-${record.year}-${record.month}-${record.day}`, record);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_2) throw e_2.error; }
            }
            yield models_1.Sessions.updateAllSessionsByDateToComputed(period);
        });
    }
}
exports.SAUMonitorClass = SAUMonitorClass;
