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
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoConferencesCron = videoConferencesCron;
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const cron_1 = require("@rocket.chat/cron");
const models_1 = require("@rocket.chat/models");
// 24 hours
const VIDEO_CONFERENCE_TTL = 24 * 60 * 60 * 1000;
function runVideoConferences() {
    return __awaiter(this, void 0, void 0, function* () {
        const minimum = new Date(new Date().valueOf() - VIDEO_CONFERENCE_TTL);
        const calls = yield (yield models_1.VideoConference.findAllLongRunning(minimum))
            .map(({ _id: callId }) => callId)
            .toArray();
        yield Promise.all(calls.map((callId) => core_services_1.VideoConf.setStatus(callId, core_typings_1.VideoConferenceStatus.EXPIRED)));
    });
}
function videoConferencesCron() {
    return __awaiter(this, void 0, void 0, function* () {
        void runVideoConferences();
        yield cron_1.cronJobs.add('VideoConferences', '0 */3 * * *', () => __awaiter(this, void 0, void 0, function* () { return runVideoConferences(); }));
    });
}
