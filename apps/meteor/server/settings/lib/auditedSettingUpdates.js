"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAuditedByApp = exports.updateAuditedBySystem = exports.updateAuditedByUser = exports.resetAuditedSettingByUser = void 0;
const models_1 = require("@rocket.chat/models");
const cached_1 = require("../../../app/settings/server/cached");
const resetAuditedSettingByUser = (actor) => (fn, key) => {
    var _a;
    const { value, packageValue } = (_a = cached_1.settings.getSetting(key)) !== null && _a !== void 0 ? _a : {};
    void models_1.ServerEvents.createAuditServerEvent('settings.changed', {
        id: key,
        previous: value,
        current: packageValue,
    }, Object.assign({ type: 'user' }, actor));
    return fn(key);
};
exports.resetAuditedSettingByUser = resetAuditedSettingByUser;
const updateAuditedByUser = (actor) => (fn, ...args) => {
    const [key, value, ...rest] = args;
    const setting = cached_1.settings.getSetting(key);
    const previous = setting === null || setting === void 0 ? void 0 : setting.value;
    void models_1.ServerEvents.createAuditServerEvent('settings.changed', {
        id: key,
        previous,
        current: value,
    }, Object.assign({ type: 'user' }, actor));
    return fn(key, value, ...rest);
};
exports.updateAuditedByUser = updateAuditedByUser;
const updateAuditedBySystem = (actor) => (fn, ...args) => {
    const [key, value, ...rest] = args;
    const setting = cached_1.settings.getSetting(key);
    const previous = setting === null || setting === void 0 ? void 0 : setting.value;
    void models_1.ServerEvents.createAuditServerEvent('settings.changed', {
        id: key,
        previous,
        current: value,
    }, Object.assign({ type: 'system' }, actor));
    return fn(key, value, ...rest);
};
exports.updateAuditedBySystem = updateAuditedBySystem;
const updateAuditedByApp = (actor) => (fn, ...args) => {
    const [key, value, ...rest] = args;
    const setting = cached_1.settings.getSetting(key);
    const previous = setting === null || setting === void 0 ? void 0 : setting.value;
    void models_1.ServerEvents.createAuditServerEvent('settings.changed', {
        id: key,
        previous,
        current: value,
    }, Object.assign({ type: 'app' }, actor));
    return fn(key, value, ...rest);
};
exports.updateAuditedByApp = updateAuditedByApp;
