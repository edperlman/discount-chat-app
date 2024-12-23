"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handleOnEnable;
const AppObjectRegistry_ts_1 = require("../../AppObjectRegistry.ts");
const mod_ts_1 = require("../../lib/accessors/mod.ts");
function handleOnEnable() {
    const app = AppObjectRegistry_ts_1.AppObjectRegistry.get('app');
    if (typeof (app === null || app === void 0 ? void 0 : app.onEnable) !== 'function') {
        throw new Error('App must contain an onEnable function', {
            cause: 'invalid_app',
        });
    }
    return app.onEnable(mod_ts_1.AppAccessorsInstance.getEnvironmentRead(), mod_ts_1.AppAccessorsInstance.getConfigurationModify());
}
