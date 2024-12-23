"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploadIsValidContentType = void 0;
const client_1 = require("../../settings/client");
const restrictions_1 = require("../lib/restrictions");
const fileUploadIsValidContentType = function (type, customWhiteList) {
    const blackList = client_1.settings.get('FileUpload_MediaTypeBlackList');
    const whiteList = customWhiteList || client_1.settings.get('FileUpload_MediaTypeWhiteList');
    return (0, restrictions_1.fileUploadIsValidContentTypeFromSettings)(type, whiteList, blackList);
};
exports.fileUploadIsValidContentType = fileUploadIsValidContentType;
