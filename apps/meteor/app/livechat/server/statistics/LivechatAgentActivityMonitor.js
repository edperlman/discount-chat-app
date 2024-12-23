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
exports.LivechatAgentActivityMonitor = void 0;
const cron_1 = require("@rocket.chat/cron");
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const moment_1 = __importDefault(require("moment"));
const callbacks_1 = require("../../../../lib/callbacks");
const formatDate = (dateTime = new Date()) => ({
    date: parseInt((0, moment_1.default)(dateTime).format('YYYYMMDD')),
});
class LivechatAgentActivityMonitor {
    constructor() {
        this.scheduler = cron_1.cronJobs;
        this._started = false;
        this._handleAgentStatusChanged = this._handleAgentStatusChanged.bind(this);
        this._handleUserStatusLivechatChanged = this._handleUserStatusLivechatChanged.bind(this);
        this._updateActiveSessions = this._updateActiveSessions.bind(this);
        this._name = 'Livechat Agent Activity Monitor';
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._setupListeners();
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isRunning()) {
                return;
            }
            yield this.scheduler.remove(this._name);
            this._started = false;
        });
    }
    isRunning() {
        return this._started;
    }
    _setupListeners() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isRunning()) {
                return;
            }
            yield this._startMonitoring();
            // TODO use service event socket.connected instead
            meteor_1.Meteor.onConnection((connection) => this._handleMeteorConnection(connection));
            callbacks_1.callbacks.add('livechat.agentStatusChanged', this._handleAgentStatusChanged);
            callbacks_1.callbacks.add('livechat.setUserStatusLivechat', (...args) => {
                return this._handleUserStatusLivechatChanged(...args);
            });
            this._started = true;
        });
    }
    _startMonitoring() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.scheduler.add(this._name, '0 0 * * *', () => this._updateActiveSessions());
        });
    }
    _updateActiveSessions() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            const openLivechatAgentSessions = models_1.LivechatAgentActivity.findOpenSessions();
            const today = (0, moment_1.default)(new Date());
            const startedAt = new Date(today.year(), today.month(), today.date());
            try {
                for (var _d = true, openLivechatAgentSessions_1 = __asyncValues(openLivechatAgentSessions), openLivechatAgentSessions_1_1; openLivechatAgentSessions_1_1 = yield openLivechatAgentSessions_1.next(), _a = openLivechatAgentSessions_1_1.done, !_a; _d = true) {
                    _c = openLivechatAgentSessions_1_1.value;
                    _d = false;
                    const session = _c;
                    const startDate = (0, moment_1.default)(session.lastStartedAt);
                    const stoppedAt = new Date(startDate.year(), startDate.month(), startDate.date(), 23, 59, 59);
                    const data = Object.assign(Object.assign({}, formatDate(startDate.toDate())), { agentId: session.agentId });
                    const availableTime = (0, moment_1.default)(stoppedAt).diff((0, moment_1.default)(new Date(session.lastStartedAt)), 'seconds');
                    yield Promise.all([
                        models_1.LivechatAgentActivity.updateLastStoppedAt(Object.assign(Object.assign({}, data), { availableTime, lastStoppedAt: stoppedAt })),
                        models_1.LivechatAgentActivity.updateServiceHistory(Object.assign(Object.assign({}, data), { serviceHistory: { startedAt: session.lastStartedAt, stoppedAt } })),
                    ]);
                    yield this._createOrUpdateSession(session.agentId, startedAt);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = openLivechatAgentSessions_1.return)) yield _b.call(openLivechatAgentSessions_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    _handleMeteorConnection(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isRunning()) {
                return;
            }
            const session = yield models_1.Sessions.findOneBySessionId(connection.id);
            if (!session) {
                return;
            }
            const user = yield models_1.Users.findOneById(session.userId, {
                projection: { _id: 1, status: 1, statusLivechat: 1 },
            });
            if (user && user.status !== 'offline' && user.statusLivechat === 'available') {
                yield this._createOrUpdateSession(user._id);
            }
            connection.onClose(() => {
                if (session) {
                    void this._updateSessionWhenAgentStop(session.userId);
                }
            });
        });
    }
    _handleAgentStatusChanged(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, status }) {
            if (!this.isRunning()) {
                return;
            }
            const user = yield models_1.Users.findOneById(userId, { projection: { statusLivechat: 1 } });
            if (!user || user.statusLivechat !== 'available') {
                return;
            }
            if (status !== 'offline') {
                yield this._createOrUpdateSession(userId);
            }
            else {
                yield this._updateSessionWhenAgentStop(userId);
            }
        });
    }
    _handleUserStatusLivechatChanged(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, status }) {
            if (!this.isRunning()) {
                return;
            }
            const user = yield models_1.Users.findOneById(userId, { projection: { status: 1 } });
            if (user && user.status === 'offline') {
                return;
            }
            if (status === 'available') {
                yield this._createOrUpdateSession(userId);
            }
            if (status === 'not-available') {
                yield this._updateSessionWhenAgentStop(userId);
            }
        });
    }
    _createOrUpdateSession(userId, lastStartedAt) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = Object.assign(Object.assign({}, formatDate(lastStartedAt)), { agentId: userId, lastStartedAt });
            yield models_1.LivechatAgentActivity.createOrUpdate(data);
        });
    }
    _updateSessionWhenAgentStop(agentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { date } = formatDate();
            const livechatSession = yield models_1.LivechatAgentActivity.findOneByAgendIdAndDate(agentId, date);
            if (!livechatSession) {
                return;
            }
            const stoppedAt = new Date();
            const availableTime = (0, moment_1.default)(stoppedAt).diff((0, moment_1.default)(new Date(livechatSession.lastStartedAt)), 'seconds');
            yield Promise.all([
                models_1.LivechatAgentActivity.updateLastStoppedAt({ agentId, date, availableTime, lastStoppedAt: stoppedAt }),
                models_1.LivechatAgentActivity.updateServiceHistory({
                    agentId,
                    date,
                    serviceHistory: { startedAt: livechatSession.lastStartedAt, stoppedAt },
                }),
            ]);
        });
    }
}
exports.LivechatAgentActivityMonitor = LivechatAgentActivityMonitor;
