"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserFromParams = isUserFromParams;
function isUserFromParams(params, loggedInUserId, loggedInUser) {
    return Boolean((!params.userId && !params.username && !params.user) ||
        (params.userId && loggedInUserId === params.userId) ||
        (params.username && (loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.username) === params.username) ||
        (params.user && (loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.username) === params.user));
}
