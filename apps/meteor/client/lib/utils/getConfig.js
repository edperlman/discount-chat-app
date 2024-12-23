"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
const meteor_1 = require("meteor/meteor");
const getConfig = (key, defaultValue) => {
    var _a;
    const searchParams = new URLSearchParams(window.location.search);
    const storedItem = searchParams.get(key) || meteor_1.Meteor._localStorage.getItem(`rc-config-${key}`);
    return (_a = storedItem !== null && storedItem !== void 0 ? storedItem : defaultValue) !== null && _a !== void 0 ? _a : null;
};
exports.getConfig = getConfig;
