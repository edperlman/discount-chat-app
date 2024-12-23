"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGeolocationPosition = void 0;
const getGeolocationPosition = () => new Promise((resolvePos, rejectPos) => {
    navigator.geolocation.getCurrentPosition(resolvePos, rejectPos, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
    });
});
exports.getGeolocationPosition = getGeolocationPosition;
