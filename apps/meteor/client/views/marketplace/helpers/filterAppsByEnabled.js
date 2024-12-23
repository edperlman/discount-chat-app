"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterAppsByEnabled = void 0;
const helpers_1 = require("../helpers");
const filterAppsByEnabled = (app) => {
    var _a;
    const appStatus = (_a = (0, helpers_1.appStatusSpanProps)(app)) === null || _a === void 0 ? void 0 : _a.label;
    const uiEnabledStatus = ['Enabled', 'Enabled*', 'Trial period'];
    return uiEnabledStatus.includes(appStatus || '');
};
exports.filterAppsByEnabled = filterAppsByEnabled;
