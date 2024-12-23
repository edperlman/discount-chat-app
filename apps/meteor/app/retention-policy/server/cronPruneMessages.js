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
Object.defineProperty(exports, "__esModule", { value: true });
const cron_1 = require("@rocket.chat/cron");
const models_1 = require("@rocket.chat/models");
const getCronAdvancedTimerFromPrecisionSetting_1 = require("../../../lib/getCronAdvancedTimerFromPrecisionSetting");
const cleanRoomHistory_1 = require("../../lib/server/functions/cleanRoomHistory");
const server_1 = require("../../settings/server");
const getMaxAgeSettingIdByRoomType = (type) => {
    switch (type) {
        case 'c':
            return server_1.settings.get('RetentionPolicy_TTL_Channels');
        case 'p':
            return server_1.settings.get('RetentionPolicy_TTL_Groups');
        case 'd':
            return server_1.settings.get('RetentionPolicy_TTL_DMs');
    }
};
let types = [];
const oldest = new Date('0001-01-01T00:00:00Z');
const toDays = (d) => d * 1000 * 60 * 60 * 24;
function job() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c, _d, e_2, _e, _f, _g, e_3, _h, _j;
        const now = new Date();
        const filesOnly = server_1.settings.get('RetentionPolicy_FilesOnly');
        const excludePinned = server_1.settings.get('RetentionPolicy_DoNotPrunePinned');
        const ignoreDiscussion = server_1.settings.get('RetentionPolicy_DoNotPruneDiscussion');
        const ignoreThreads = server_1.settings.get('RetentionPolicy_DoNotPruneThreads');
        const ignoreDiscussionQuery = ignoreDiscussion ? { prid: { $exists: false } } : {};
        try {
            // get all rooms with default values
            for (var _k = true, types_1 = __asyncValues(types), types_1_1; types_1_1 = yield types_1.next(), _a = types_1_1.done, !_a; _k = true) {
                _c = types_1_1.value;
                _k = false;
                const type = _c;
                const maxAge = getMaxAgeSettingIdByRoomType(type) || 0;
                const latest = new Date(now.getTime() - maxAge);
                const rooms = yield models_1.Rooms.find(Object.assign({ 't': type, '$or': [{ 'retention.enabled': { $eq: true } }, { 'retention.enabled': { $exists: false } }], 'retention.overrideGlobal': { $ne: true } }, ignoreDiscussionQuery), { projection: { _id: 1 } }).toArray();
                try {
                    for (var _l = true, rooms_1 = (e_2 = void 0, __asyncValues(rooms)), rooms_1_1; rooms_1_1 = yield rooms_1.next(), _d = rooms_1_1.done, !_d; _l = true) {
                        _f = rooms_1_1.value;
                        _l = false;
                        const { _id: rid } = _f;
                        yield (0, cleanRoomHistory_1.cleanRoomHistory)({
                            rid,
                            latest,
                            oldest,
                            filesOnly,
                            excludePinned,
                            ignoreDiscussion,
                            ignoreThreads,
                        });
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (!_l && !_d && (_e = rooms_1.return)) yield _e.call(rooms_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_k && !_a && (_b = types_1.return)) yield _b.call(types_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        const rooms = yield models_1.Rooms.find(Object.assign({ 'retention.enabled': { $eq: true }, 'retention.overrideGlobal': { $eq: true }, 'retention.maxAge': { $gte: 0 } }, ignoreDiscussionQuery), { projection: { _id: 1, retention: 1 } }).toArray();
        try {
            for (var _m = true, rooms_2 = __asyncValues(rooms), rooms_2_1; rooms_2_1 = yield rooms_2.next(), _g = rooms_2_1.done, !_g; _m = true) {
                _j = rooms_2_1.value;
                _m = false;
                const { _id: rid, retention } = _j;
                const { maxAge = 30, filesOnly, excludePinned, ignoreThreads } = retention;
                const latest = new Date(now.getTime() - toDays(maxAge));
                yield (0, cleanRoomHistory_1.cleanRoomHistory)({
                    rid,
                    latest,
                    oldest,
                    filesOnly,
                    excludePinned,
                    ignoreDiscussion,
                    ignoreThreads,
                });
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (!_m && !_g && (_h = rooms_2.return)) yield _h.call(rooms_2);
            }
            finally { if (e_3) throw e_3.error; }
        }
    });
}
const pruneCronName = 'Prune old messages by retention policy';
function deployCron(precision) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield cron_1.cronJobs.has(pruneCronName)) {
            yield cron_1.cronJobs.remove(pruneCronName);
        }
        yield cron_1.cronJobs.add(pruneCronName, precision, () => __awaiter(this, void 0, void 0, function* () { return job(); }));
    });
}
server_1.settings.watchMultiple([
    'RetentionPolicy_Enabled',
    'RetentionPolicy_AppliesToChannels',
    'RetentionPolicy_AppliesToGroups',
    'RetentionPolicy_AppliesToDMs',
    'RetentionPolicy_Advanced_Precision',
    'RetentionPolicy_Advanced_Precision_Cron',
    'RetentionPolicy_Precision',
], function reloadPolicy() {
    return __awaiter(this, void 0, void 0, function* () {
        types = [];
        if (!server_1.settings.get('RetentionPolicy_Enabled')) {
            return cron_1.cronJobs.remove(pruneCronName);
        }
        if (server_1.settings.get('RetentionPolicy_AppliesToChannels')) {
            types.push('c');
        }
        if (server_1.settings.get('RetentionPolicy_AppliesToGroups')) {
            types.push('p');
        }
        if (server_1.settings.get('RetentionPolicy_AppliesToDMs')) {
            types.push('d');
        }
        const precision = (server_1.settings.get('RetentionPolicy_Advanced_Precision') && server_1.settings.get('RetentionPolicy_Advanced_Precision_Cron')) ||
            (0, getCronAdvancedTimerFromPrecisionSetting_1.getCronAdvancedTimerFromPrecisionSetting)(server_1.settings.get('RetentionPolicy_Precision'));
        return deployCron(precision);
    });
});
