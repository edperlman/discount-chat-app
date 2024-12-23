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
exports.federationSearchUsers = federationSearchUsers;
exports.getUserByUsername = getUserByUsername;
exports.requestEventsFromLatest = requestEventsFromLatest;
exports.dispatchEvents = dispatchEvents;
exports.dispatchEvent = dispatchEvent;
exports.getUpload = getUpload;
const querystring_1 = __importDefault(require("querystring"));
const errors_1 = require("../functions/errors");
const http_1 = require("../lib/http");
const isFederationEnabled_1 = require("../lib/isFederationEnabled");
const logger_1 = require("../lib/logger");
function federationSearchUsers(query) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, isFederationEnabled_1.isFederationEnabled)()) {
            throw (0, errors_1.disabled)('client.searchUsers');
        }
        logger_1.clientLogger.debug({ msg: 'searchUsers', query });
        const [username, peerDomain] = query.split('@');
        const uri = `/api/v1/federation.users.search?${querystring_1.default.stringify({ username, domain: peerDomain })}`;
        const { data: { users }, } = yield (0, http_1.federationRequestToPeer)('GET', peerDomain, uri);
        return users;
    });
}
function getUserByUsername(query) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, isFederationEnabled_1.isFederationEnabled)()) {
            throw (0, errors_1.disabled)('client.searchUsers');
        }
        logger_1.clientLogger.debug({ msg: 'getUserByUsername', query });
        const [username, peerDomain] = query.split('@');
        const uri = `/api/v1/federation.users.getByUsername?${querystring_1.default.stringify({ username })}`;
        const { data: { user }, } = yield (0, http_1.federationRequestToPeer)('GET', peerDomain, uri);
        return user;
    });
}
function requestEventsFromLatest(domain, fromDomain, contextType, contextQuery, latestEventIds) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, isFederationEnabled_1.isFederationEnabled)()) {
            throw (0, errors_1.disabled)('client.requestEventsFromLatest');
        }
        logger_1.clientLogger.debug({
            msg: 'requestEventsFromLatest',
            domain,
            contextType,
            contextQuery,
            latestEventIds,
        });
        const uri = '/api/v1/federation.events.requestFromLatest';
        yield (0, http_1.federationRequestToPeer)('POST', domain, uri, {
            fromDomain,
            contextType,
            contextQuery,
            latestEventIds,
        });
    });
}
function dispatchEvents(domains, events) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, domains_1, domains_1_1;
        var _b, e_1, _c, _d;
        if (!(0, isFederationEnabled_1.isFederationEnabled)()) {
            throw (0, errors_1.disabled)('client.dispatchEvents');
        }
        domains = [...new Set(domains)];
        logger_1.clientLogger.debug({ msg: 'dispatchEvents', domains, events });
        const uri = '/api/v1/federation.events.dispatch';
        try {
            for (_a = true, domains_1 = __asyncValues(domains); domains_1_1 = yield domains_1.next(), _b = domains_1_1.done, !_b; _a = true) {
                _d = domains_1_1.value;
                _a = false;
                const domain = _d;
                yield (0, http_1.federationRequestToPeer)('POST', domain, uri, { events }, { ignoreErrors: true });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_a && !_b && (_c = domains_1.return)) yield _c.call(domains_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
function dispatchEvent(domains, event) {
    return __awaiter(this, void 0, void 0, function* () {
        yield dispatchEvents([...new Set(domains)], [event]);
    });
}
function getUpload(domain, fileId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data: { upload, buffer }, } = yield (0, http_1.federationRequestToPeer)('GET', domain, `/api/v1/federation.uploads?${querystring_1.default.stringify({ upload_id: fileId })}`);
        return { upload, buffer: Buffer.from(buffer) };
    });
}
