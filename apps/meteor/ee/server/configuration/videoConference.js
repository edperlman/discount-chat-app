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
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const license_1 = require("@rocket.chat/license");
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const callbacks_1 = require("../../../lib/callbacks");
const videoConfTypes_1 = require("../../../server/lib/videoConfTypes");
const video_conference_1 = require("../settings/video-conference");
meteor_1.Meteor.startup(() => __awaiter(void 0, void 0, void 0, function* () {
    yield license_1.License.onLicense('videoconference-enterprise', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, video_conference_1.addSettings)();
        videoConfTypes_1.videoConfTypes.registerVideoConferenceType({ type: 'direct', status: core_typings_1.VideoConferenceStatus.CALLING }, (_a, allowRinging_1) => __awaiter(void 0, [_a, allowRinging_1], void 0, function* ({ _id, t }, allowRinging) {
            if (!allowRinging || t !== 'd') {
                return false;
            }
            const room = yield models_1.Rooms.findOneById(_id, { projection: { uids: 1 } });
            return Boolean(room && (!room.uids || room.uids.length === 2));
        }));
        videoConfTypes_1.videoConfTypes.registerVideoConferenceType({ type: 'videoconference', ringing: true }, (_a, allowRinging_1) => __awaiter(void 0, [_a, allowRinging_1], void 0, function* ({ _id, t }, allowRinging) {
            if (!allowRinging || ['l', 'v'].includes(t)) {
                return false;
            }
            if (t === 'd') {
                const room = yield models_1.Rooms.findOneById(_id, { projection: { uids: 1 } });
                if (room && (!room.uids || room.uids.length <= 2)) {
                    return false;
                }
            }
            if ((yield models_1.Subscriptions.countByRoomId(_id)) > 10) {
                return false;
            }
            return true;
        }));
        callbacks_1.callbacks.add('onJoinVideoConference', (callId, userId) => __awaiter(void 0, void 0, void 0, function* () { return core_services_1.VideoConf.addUser(callId, userId); }));
    }));
}));
