"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasMongoProtocol = void 0;
const hasMongoProtocol = function (url) {
    return url.match(/mongodb(?:\+srv)?:\/\/.*/) !== null;
};
exports.hasMongoProtocol = hasMongoProtocol;
