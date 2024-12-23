"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploadIsValidContentTypeFromSettings = exports.fileUploadMediaWhiteList = void 0;
const fileUploadMediaWhiteList = function (customWhiteList) {
    const mediaTypeWhiteList = customWhiteList;
    if (!mediaTypeWhiteList || mediaTypeWhiteList === '*') {
        return;
    }
    return mediaTypeWhiteList.split(',').map((item) => {
        return item.trim();
    });
};
exports.fileUploadMediaWhiteList = fileUploadMediaWhiteList;
const fileUploadMediaBlackList = function (customBlackList) {
    const blacklist = customBlackList;
    if (!blacklist) {
        return;
    }
    return blacklist.split(',').map((item) => item.trim());
};
const isTypeOnList = function (type, list) {
    if (!type || !list) {
        return false;
    }
    if (list.includes(type)) {
        return true;
    }
    const wildCardGlob = '/*';
    const wildcards = list.filter((item) => {
        return item.indexOf(wildCardGlob) > 0;
    });
    if (wildcards.includes(type.replace(/(\/.*)$/, wildCardGlob))) {
        return true;
    }
    return false;
};
const fileUploadIsValidContentTypeFromSettings = function (type, customWhiteList, customBlackList) {
    const blackList = fileUploadMediaBlackList(customBlackList);
    const whiteList = (0, exports.fileUploadMediaWhiteList)(customWhiteList);
    if (blackList && type && isTypeOnList(type, blackList)) {
        return false;
    }
    if (whiteList) {
        return isTypeOnList(type, whiteList);
    }
    if (!whiteList) {
        return true;
    }
    return false;
};
exports.fileUploadIsValidContentTypeFromSettings = fileUploadIsValidContentTypeFromSettings;
