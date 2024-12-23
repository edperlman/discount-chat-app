"use strict";
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dayIterator = dayIterator;
exports.weekIterator = weekIterator;
exports.hourIterator = hourIterator;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const HOURS_IN_DAY = 24;
function dayIterator(from, to) {
    return __asyncGenerator(this, arguments, function* dayIterator_1() {
        const m = from.clone().startOf('day');
        const f = to.clone().startOf('day');
        while (m.diff(f, 'days') <= 0) {
            yield yield __await(m);
            m.add(1, 'days');
        }
    });
}
function weekIterator(from, to, timezone) {
    return __asyncGenerator(this, arguments, function* weekIterator_1() {
        const m = moment_timezone_1.default.tz(from, timezone);
        while (m.diff(to, 'weeks') <= 0) {
            yield yield __await((0, moment_timezone_1.default)(m));
            m.add(1, 'weeks');
        }
    });
}
function hourIterator(day) {
    return __asyncGenerator(this, arguments, function* hourIterator_1() {
        const m = (0, moment_timezone_1.default)(day).startOf('day');
        let passedHours = 0;
        while (passedHours < HOURS_IN_DAY) {
            yield yield __await((0, moment_timezone_1.default)(m));
            m.add(1, 'hours');
            passedHours++;
        }
    });
}
