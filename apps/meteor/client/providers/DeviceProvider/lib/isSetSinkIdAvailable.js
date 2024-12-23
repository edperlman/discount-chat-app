"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSetSinkIdAvailable = void 0;
const isSetSinkIdAvailable = () => {
    const audio = new Audio();
    return !!audio.setSinkId;
};
exports.isSetSinkIdAvailable = isSetSinkIdAvailable;
