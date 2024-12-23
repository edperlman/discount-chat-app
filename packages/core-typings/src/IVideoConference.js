"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLivechatVideoConference = exports.isGroupVideoConference = exports.isDirectVideoConference = exports.VideoConferenceStatus = void 0;
var VideoConferenceStatus;
(function (VideoConferenceStatus) {
    VideoConferenceStatus[VideoConferenceStatus["CALLING"] = 0] = "CALLING";
    VideoConferenceStatus[VideoConferenceStatus["STARTED"] = 1] = "STARTED";
    VideoConferenceStatus[VideoConferenceStatus["EXPIRED"] = 2] = "EXPIRED";
    VideoConferenceStatus[VideoConferenceStatus["ENDED"] = 3] = "ENDED";
    VideoConferenceStatus[VideoConferenceStatus["DECLINED"] = 4] = "DECLINED";
})(VideoConferenceStatus || (exports.VideoConferenceStatus = VideoConferenceStatus = {}));
const isDirectVideoConference = (call) => {
    return (call === null || call === void 0 ? void 0 : call.type) === 'direct';
};
exports.isDirectVideoConference = isDirectVideoConference;
const isGroupVideoConference = (call) => {
    return (call === null || call === void 0 ? void 0 : call.type) === 'videoconference';
};
exports.isGroupVideoConference = isGroupVideoConference;
const isLivechatVideoConference = (call) => {
    return (call === null || call === void 0 ? void 0 : call.type) === 'livechat';
};
exports.isLivechatVideoConference = isLivechatVideoConference;
