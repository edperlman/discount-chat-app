"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiCurlGetter = void 0;
const Utilities_1 = require("../../../../ee/lib/misc/Utilities");
const apiCurlGetter = (absoluteUrl) => (method, api) => {
    var _a;
    const example = (_a = api.examples) === null || _a === void 0 ? void 0 : _a[method];
    return Utilities_1.Utilities.curl({
        url: absoluteUrl(api.computedPath),
        method,
        params: example === null || example === void 0 ? void 0 : example.params,
        query: example === null || example === void 0 ? void 0 : example.query,
        content: example === null || example === void 0 ? void 0 : example.content,
        headers: example === null || example === void 0 ? void 0 : example.headers,
        auth: '',
    }).split('\n');
};
exports.apiCurlGetter = apiCurlGetter;
