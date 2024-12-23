"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDisplayNames = void 0;
/*
    In contrary to getUserDisplayName, this function returns an array of strings, containing name & username in the order they're supposed to be displayed.
*/
const getUserDisplayNames = (name, username, useRealName) => {
    if (!username) {
        throw new Error('Username is required');
    }
    const shouldUseName = !!(useRealName && name);
    return shouldUseName ? [name, username] : [username];
};
exports.getUserDisplayNames = getUserDisplayNames;
