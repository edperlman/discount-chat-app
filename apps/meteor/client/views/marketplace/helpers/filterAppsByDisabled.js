"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterAppsByDisabled = void 0;
const helpers_1 = require("../helpers");
const filterAppsByDisabled = (app) => {
    var _a;
    const appStatus = (_a = (0, helpers_1.appStatusSpanProps)(app)) === null || _a === void 0 ? void 0 : _a.label;
    const uiDisabledStatus = ['Disabled', 'Disabled*', 'Config Needed', 'Failed'];
    return uiDisabledStatus.includes(appStatus || '');
};
exports.filterAppsByDisabled = filterAppsByDisabled;
