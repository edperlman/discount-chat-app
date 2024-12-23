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
exports.AppVideoConferenceBridge = void 0;
const VideoConferenceBridge_1 = require("@rocket.chat/apps-engine/server/bridges/VideoConferenceBridge");
const core_services_1 = require("@rocket.chat/core-services");
const videoConfProviders_1 = require("../../../../server/lib/videoConfProviders");
class AppVideoConferenceBridge extends VideoConferenceBridge_1.VideoConferenceBridge {
    constructor(orch) {
        super();
        this.orch = orch;
    }
    getById(callId, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.orch.debugLog(`The App ${appId} is getting the video conference byId: "${callId}"`);
            // #TODO: #AppsEngineTypes - Remove explicit types and typecasts once the apps-engine definition/implementation mismatch is fixed.
            const promise = (_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('videoConferences').convertById(callId);
            return promise;
        });
    }
    create(call, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is creating a video conference.`);
            return (yield core_services_1.VideoConf.create(Object.assign({ type: 'videoconference' }, call))).callId;
        });
    }
    update(call, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            var _d, _e;
            this.orch.debugLog(`The App ${appId} is updating a video conference.`);
            const oldData = call._id && (yield core_services_1.VideoConf.getUnfiltered(call._id));
            if (!oldData) {
                throw new Error('A video conference must exist to update.');
            }
            const data = ((_d = this.orch.getConverters()) === null || _d === void 0 ? void 0 : _d.get('videoConferences')).convertAppVideoConference(call);
            yield core_services_1.VideoConf.setProviderData(call._id, data.providerData);
            try {
                for (var _f = true, _g = __asyncValues(data.users), _h; _h = yield _g.next(), _a = _h.done, !_a; _f = true) {
                    _c = _h.value;
                    _f = false;
                    const { _id, ts } = _c;
                    if (oldData.users.find((user) => user._id === _id)) {
                        continue;
                    }
                    yield core_services_1.VideoConf.addUser(call._id, _id, ts);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_f && !_a && (_b = _g.return)) yield _b.call(_g);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (data.endedBy && data.endedBy._id !== ((_e = oldData.endedBy) === null || _e === void 0 ? void 0 : _e._id)) {
                yield core_services_1.VideoConf.setEndedBy(call._id, data.endedBy._id);
            }
            else if (data.endedAt) {
                yield core_services_1.VideoConf.setEndedAt(call._id, data.endedAt);
            }
            if (data.status > oldData.status) {
                yield core_services_1.VideoConf.setStatus(call._id, data.status);
            }
            if (data.discussionRid !== oldData.discussionRid) {
                yield core_services_1.VideoConf.assignDiscussionToConference(call._id, data.discussionRid);
            }
        });
    }
    registerProvider(info, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is registering a video conference provider.`);
            videoConfProviders_1.videoConfProviders.registerProvider(info.name, info.capabilities || {}, appId);
        });
    }
    unRegisterProvider(info) {
        return __awaiter(this, void 0, void 0, function* () {
            videoConfProviders_1.videoConfProviders.unRegisterProvider(info.name);
        });
    }
}
exports.AppVideoConferenceBridge = AppVideoConferenceBridge;
