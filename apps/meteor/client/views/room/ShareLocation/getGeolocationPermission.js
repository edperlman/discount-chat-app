"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGeolocationPermission = void 0;
const getGeolocationPermission = () => new Promise((resolve) => {
    if (!navigator.permissions) {
        resolve('granted');
    }
    navigator.permissions.query({ name: 'geolocation' }).then(({ state }) => {
        resolve(state);
    });
});
exports.getGeolocationPermission = getGeolocationPermission;
