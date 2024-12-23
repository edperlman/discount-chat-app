"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidCloudAnnouncementInteractionError = void 0;
class InvalidCloudAnnouncementInteractionError extends Error {
    constructor() {
        super(...arguments);
        this.name = InvalidCloudAnnouncementInteractionError.name;
    }
}
exports.InvalidCloudAnnouncementInteractionError = InvalidCloudAnnouncementInteractionError;
