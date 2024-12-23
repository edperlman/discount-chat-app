"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handleGetStatus;
const AppObjectRegistry_ts_1 = require("../../AppObjectRegistry.ts");
function handleGetStatus() {
    const app = AppObjectRegistry_ts_1.AppObjectRegistry.get('app');
    if (typeof (app === null || app === void 0 ? void 0 : app.getStatus) !== 'function') {
        throw new Error('App must contain a getStatus function', {
            cause: 'invalid_app',
        });
    }
    return app.getStatus();
}
