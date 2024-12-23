"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVerifiedChannelInSource = void 0;
const isVerifiedChannelInSource = (channel, visitorId, source) => {
    if (!channel.verified) {
        return false;
    }
    if (channel.visitor.visitorId !== visitorId) {
        return false;
    }
    if (channel.visitor.source.type !== source.type) {
        return false;
    }
    if ((source.id || channel.visitor.source.id) && channel.visitor.source.id !== source.id) {
        return false;
    }
    return true;
};
exports.isVerifiedChannelInSource = isVerifiedChannelInSource;
