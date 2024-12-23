"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSettingDefaults = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const getSettingDefaults = (setting, blockedSettings = new Set(), hiddenSettings = new Set(), wizardRequiredSettings = new Set()) => {
    var _a;
    const { _id, value, sorter } = setting, data = __rest(setting, ["_id", "value", "sorter"]);
    const options = Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
    return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ _id,
        value, packageValue: value, valueSource: 'packageValue', secret: false, enterprise: false, i18nDescription: `${_id}_Description`, autocomplete: true, sorter: sorter || 0, ts: new Date(), createdAt: new Date(), _updatedAt: (_a = options._updatedAt) !== null && _a !== void 0 ? _a : new Date() }, options), (options.enableQuery ? { enableQuery: JSON.stringify(options.enableQuery) } : undefined)), { i18nLabel: options.i18nLabel || _id, hidden: options.hidden || hiddenSettings.has(_id), blocked: options.blocked || blockedSettings.has(_id), requiredOnWizard: options.requiredOnWizard || wizardRequiredSettings.has(_id), type: options.type || 'string', env: options.env || false, public: options.public || false }), (options.displayQuery ? { displayQuery: JSON.stringify(options.displayQuery) } : undefined)), ((0, core_typings_1.isSettingColor)(setting) && {
        packageEditor: setting.editor,
    }));
};
exports.getSettingDefaults = getSettingDefaults;
