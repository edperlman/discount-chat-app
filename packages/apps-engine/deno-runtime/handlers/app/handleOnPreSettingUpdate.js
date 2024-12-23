"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handleOnPreSettingUpdate;
const AppObjectRegistry_ts_1 = require("../../AppObjectRegistry.ts");
const mod_ts_1 = require("../../lib/accessors/mod.ts");
function handleOnPreSettingUpdate(params) {
    const app = AppObjectRegistry_ts_1.AppObjectRegistry.get('app');
    if (typeof (app === null || app === void 0 ? void 0 : app.onPreSettingUpdate) !== 'function') {
        throw new Error('App must contain an onPreSettingUpdate function', {
            cause: 'invalid_app',
        });
    }
    if (!Array.isArray(params)) {
        throw new Error('Invalid params', { cause: 'invalid_param_type' });
    }
    const [setting] = params;
    return app.onPreSettingUpdate(setting, mod_ts_1.AppAccessorsInstance.getConfigurationModify(), mod_ts_1.AppAccessorsInstance.getReader(), mod_ts_1.AppAccessorsInstance.getHttp());
}
