"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.overrideGenerator = void 0;
const convertValue_1 = require("./convertValue");
const compareSettingsValue = (a, b, type) => {
    if (Array.isArray(a) && Array.isArray(b)) {
        if (type === 'multiSelect') {
            a = a;
            b = b;
            return a.length === b.length && a.every((value, index) => compareSettingsValue(value, b[index]));
        }
        if (type === 'roomPick') {
            a = a;
            b = b;
            return (a.length === b.length &&
                a.every((value, index) => {
                    return Object.keys(value).every((key) => compareSettingsValue(value[key], b[index][key]));
                }));
        }
    }
    return a === b;
};
const overrideGenerator = (fn) => (setting) => {
    const overwriteValue = fn(setting._id);
    if (overwriteValue === null || overwriteValue === undefined) {
        return setting;
    }
    try {
        const value = (0, convertValue_1.convertValue)(overwriteValue, setting.type);
        if (compareSettingsValue(value, setting.value, setting.type)) {
            return setting;
        }
        return Object.assign(Object.assign({}, setting), { value, processEnvValue: value, valueSource: 'processEnvValue' });
    }
    catch (error) {
        console.error(`Error converting value for setting ${setting._id} expected "${setting.type}" type`);
        return setting;
    }
};
exports.overrideGenerator = overrideGenerator;
