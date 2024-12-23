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
exports.OmnichannelAnalyticsService = void 0;
/* eslint-disable new-cap */
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const AgentData_1 = require("./AgentData");
const ChartData_1 = require("./ChartData");
const OverviewData_1 = require("./OverviewData");
const logger_1 = require("./logger");
const utils_1 = require("./utils");
const getTimezone_1 = require("../../../app/utils/server/lib/getTimezone");
const callbacks_1 = require("../../../lib/callbacks");
const i18n_1 = require("../../lib/i18n");
const HOURS_IN_DAY = 24;
// TODO: move EE analytics to this service & remove callback usage
class OmnichannelAnalyticsService extends core_services_1.ServiceClassInternal {
    constructor() {
        super();
        this.name = 'omnichannel-analytics';
        this.overview = new OverviewData_1.OverviewData(models_1.LivechatRooms);
        this.chart = new ChartData_1.ChartData(models_1.LivechatRooms);
        this.agentOverview = new AgentData_1.AgentOverviewData(models_1.LivechatRooms);
    }
    getAgentOverviewData(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { departmentId, utcOffset, daterange: { from: fDate, to: tDate } = {}, chartOptions: { name } = {} } = options;
            const timezone = (0, getTimezone_1.getTimezone)({ utcOffset });
            const from = moment_timezone_1.default
                .tz(fDate || '', 'YYYY-MM-DD', timezone)
                .startOf('day')
                .utc();
            const to = moment_timezone_1.default
                .tz(tDate || '', 'YYYY-MM-DD', timezone)
                .endOf('day')
                .utc();
            if (!(0, moment_timezone_1.default)(from).isValid() || !(0, moment_timezone_1.default)(to).isValid()) {
                logger_1.serviceLogger.error('AgentOverview -> Invalid dates');
                return;
            }
            if (!this.agentOverview.isActionAllowed(name)) {
                logger_1.serviceLogger.error(`AgentOverview.${name} is not a valid action`);
                return;
            }
            const extraQuery = yield callbacks_1.callbacks.run('livechat.applyRoomRestrictions', {});
            return this.agentOverview.callAction(name, from, to, departmentId, extraQuery);
        });
    }
    getAnalyticsChartData(options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c, _d, e_2, _e, _f;
            const { utcOffset, departmentId, daterange: { from: fDate, to: tDate } = {}, chartOptions: { name: chartLabel }, } = options;
            // Check if function exists, prevent server error in case property altered
            if (!this.chart.isActionAllowed(chartLabel)) {
                logger_1.serviceLogger.error(`ChartData.${chartLabel} is not a valid action`);
                return;
            }
            const timezone = (0, getTimezone_1.getTimezone)({ utcOffset });
            const from = moment_timezone_1.default
                .tz(fDate || '', 'YYYY-MM-DD', timezone)
                .startOf('day')
                .utc();
            const to = moment_timezone_1.default
                .tz(tDate || '', 'YYYY-MM-DD', timezone)
                .endOf('day')
                .utc();
            const isSameDay = from.diff(to, 'days') === 0;
            if (!(0, moment_timezone_1.default)(from).isValid() || !(0, moment_timezone_1.default)(to).isValid()) {
                logger_1.serviceLogger.error('ChartData -> Invalid dates');
                return;
            }
            const data = {
                chartLabel,
                dataLabels: [],
                dataPoints: [],
            };
            const extraQuery = yield callbacks_1.callbacks.run('livechat.applyRoomRestrictions', {});
            if (isSameDay) {
                // data for single day
                const m = (0, moment_timezone_1.default)(from);
                try {
                    for (var _g = true, _h = __asyncValues(Array.from({ length: HOURS_IN_DAY }, (_, i) => i)), _j; _j = yield _h.next(), _a = _j.done, !_a; _g = true) {
                        _c = _j.value;
                        _g = false;
                        const currentHour = _c;
                        const hour = parseInt(m.add(currentHour ? 1 : 0, 'hour').format('H'));
                        const label = {
                            from: moment_timezone_1.default.utc().set({ hour }).tz(timezone).format('hA'),
                            to: moment_timezone_1.default.utc().set({ hour }).endOf('hour').tz(timezone).format('hA'),
                        };
                        data.dataLabels.push(`${label.from}-${label.to}`);
                        const date = {
                            gte: m.toDate(),
                            lte: (0, moment_timezone_1.default)(m).endOf('hour').toDate(),
                        };
                        data.dataPoints.push(yield this.chart.callAction(chartLabel, date, departmentId, extraQuery));
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_g && !_a && (_b = _h.return)) yield _b.call(_h);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            else {
                try {
                    for (var _k = true, _l = __asyncValues((0, utils_1.dayIterator)(from, to)), _m; _m = yield _l.next(), _d = _m.done, !_d; _k = true) {
                        _f = _m.value;
                        _k = false;
                        const m = _f;
                        data.dataLabels.push(m.format('M/D'));
                        const date = {
                            gte: m.toDate(),
                            lte: (0, moment_timezone_1.default)(m).endOf('day').toDate(),
                        };
                        data.dataPoints.push(yield this.chart.callAction(chartLabel, date, departmentId, extraQuery));
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (!_k && !_d && (_e = _l.return)) yield _e.call(_l);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
            return data;
        });
    }
    getAnalyticsOverviewData(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { departmentId, utcOffset = 0, language, daterange: { from: fDate, to: tDate } = {}, analyticsOptions: { name } = {} } = options;
            const timezone = (0, getTimezone_1.getTimezone)({ utcOffset });
            const from = moment_timezone_1.default
                .tz(fDate || '', 'YYYY-MM-DD', timezone)
                .startOf('day')
                .utc();
            const to = moment_timezone_1.default
                .tz(tDate || '', 'YYYY-MM-DD', timezone)
                .endOf('day')
                .utc();
            if (!(0, moment_timezone_1.default)(from).isValid() || !(0, moment_timezone_1.default)(to).isValid()) {
                logger_1.serviceLogger.error('OverviewData -> Invalid dates');
                return;
            }
            if (!this.overview.isActionAllowed(name)) {
                logger_1.serviceLogger.error(`OverviewData.${name} is not a valid action`);
                return;
            }
            const t = i18n_1.i18n.getFixedT(language);
            const extraQuery = yield callbacks_1.callbacks.run('livechat.applyRoomRestrictions', {});
            return this.overview.callAction(name, from, to, departmentId, timezone, t, extraQuery);
        });
    }
}
exports.OmnichannelAnalyticsService = OmnichannelAnalyticsService;
