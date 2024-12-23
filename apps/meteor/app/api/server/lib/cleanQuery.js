"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeDangerousProps = void 0;
exports.clean = clean;
const denyList = ['constructor', '__proto__', 'prototype'];
const removeDangerousProps = (v) => {
    const query = Object.create(null);
    for (const key in v) {
        if (v.hasOwnProperty(key) && !denyList.includes(key)) {
            query[key] = v[key];
        }
    }
    return query;
};
exports.removeDangerousProps = removeDangerousProps;
/* @deprecated */
function clean(v, allowList = []) {
    const typedParam = (0, exports.removeDangerousProps)(v);
    if (v instanceof Object) {
        for (const key in typedParam) {
            if (key.startsWith('$') && !allowList.includes(key)) {
                delete typedParam[key];
            }
            else {
                clean(typedParam[key], allowList);
            }
        }
    }
    return typedParam;
}
