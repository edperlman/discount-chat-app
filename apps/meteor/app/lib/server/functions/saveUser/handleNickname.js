"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleNickname = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const MAX_NICKNAME_LENGTH = 120;
const handleNickname = (updateUser, nickname) => {
    if (nickname === null || nickname === void 0 ? void 0 : nickname.trim()) {
        if (nickname.length > MAX_NICKNAME_LENGTH) {
            throw new core_services_1.MeteorError('error-nickname-size-exceeded', `Nickname size exceeds ${MAX_NICKNAME_LENGTH} characters`, {
                method: 'saveUserProfile',
            });
        }
        updateUser.$set = updateUser.$set || {};
        updateUser.$set.nickname = nickname;
    }
    else {
        updateUser.$unset = updateUser.$unset || {};
        updateUser.$unset.nickname = 1;
    }
};
exports.handleNickname = handleNickname;
