"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleBio = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const MAX_BIO_LENGTH = 260;
const handleBio = (updateUser, bio) => {
    if (bio === null || bio === void 0 ? void 0 : bio.trim()) {
        if (bio.length > MAX_BIO_LENGTH) {
            throw new core_services_1.MeteorError('error-bio-size-exceeded', `Bio size exceeds ${MAX_BIO_LENGTH} characters`, {
                method: 'saveUserProfile',
            });
        }
        updateUser.$set = updateUser.$set || {};
        updateUser.$set.bio = bio;
    }
    else {
        updateUser.$unset = updateUser.$unset || {};
        updateUser.$unset.bio = 1;
    }
};
exports.handleBio = handleBio;
