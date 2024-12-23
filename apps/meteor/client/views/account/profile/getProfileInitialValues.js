"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileInitialValues = void 0;
const getUserEmailAddress_1 = require("../../../../lib/getUserEmailAddress");
const getProfileInitialValues = (user) => {
    var _a, _b, _c, _d, _e, _f, _g;
    return ({
        email: user ? (0, getUserEmailAddress_1.getUserEmailAddress)(user) || '' : '',
        name: (_a = user === null || user === void 0 ? void 0 : user.name) !== null && _a !== void 0 ? _a : '',
        username: (_b = user === null || user === void 0 ? void 0 : user.username) !== null && _b !== void 0 ? _b : '',
        avatar: '',
        url: '',
        statusText: (_c = user === null || user === void 0 ? void 0 : user.statusText) !== null && _c !== void 0 ? _c : '',
        statusType: (_d = user === null || user === void 0 ? void 0 : user.status) !== null && _d !== void 0 ? _d : '',
        bio: (_e = user === null || user === void 0 ? void 0 : user.bio) !== null && _e !== void 0 ? _e : '',
        customFields: (_f = user === null || user === void 0 ? void 0 : user.customFields) !== null && _f !== void 0 ? _f : {},
        nickname: (_g = user === null || user === void 0 ? void 0 : user.nickname) !== null && _g !== void 0 ? _g : '',
    });
};
exports.getProfileInitialValues = getProfileInitialValues;
