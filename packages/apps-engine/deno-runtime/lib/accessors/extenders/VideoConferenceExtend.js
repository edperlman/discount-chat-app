"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoConferenceExtender = void 0;
const require_ts_1 = require("../../../lib/require.ts");
const { RocketChatAssociationModel } = (0, require_ts_1.require)('@rocket.chat/apps-engine/definition/metadata/RocketChatAssociations.js');
class VideoConferenceExtender {
    constructor(videoConference) {
        this.videoConference = videoConference;
        this.kind = RocketChatAssociationModel.VIDEO_CONFERENCE;
    }
    setProviderData(value) {
        this.videoConference.providerData = value;
        return this;
    }
    setStatus(value) {
        this.videoConference.status = value;
        return this;
    }
    setEndedBy(value) {
        this.videoConference.endedBy = {
            _id: value,
            // Name and username will be loaded automatically by the bridge
            username: '',
            name: '',
        };
        return this;
    }
    setEndedAt(value) {
        this.videoConference.endedAt = value;
        return this;
    }
    addUser(userId, ts) {
        this.videoConference.users.push({
            _id: userId,
            ts,
            // Name and username will be loaded automatically by the bridge
            username: '',
            name: '',
        });
        return this;
    }
    setDiscussionRid(rid) {
        this.videoConference.discussionRid = rid;
        return this;
    }
    getVideoConference() {
        return structuredClone(this.videoConference);
    }
}
exports.VideoConferenceExtender = VideoConferenceExtender;
