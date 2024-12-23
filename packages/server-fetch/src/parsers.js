"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRequestOptions = parseRequestOptions;
const jsonParser = (options) => {
    if (!options) {
        return {};
    }
    try {
        if (typeof options.body === 'object' && !Buffer.isBuffer(options.body)) {
            options.body = JSON.stringify(options.body);
            options.headers = Object.assign(Object.assign({}, options.headers), { 'Content-Type': 'application/json' });
        }
    }
    catch (e) {
        // Body is not JSON, do nothing
    }
    return options;
};
const urlencodedParser = (options) => {
    return options;
};
const getParser = (contentTypeHeader) => {
    switch (contentTypeHeader) {
        case 'application/json':
            return jsonParser;
        case 'application/x-www-form-urlencoded':
            return urlencodedParser;
        default:
            return jsonParser;
    }
};
function parseRequestOptions(options) {
    var _a;
    if (!options) {
        return {};
    }
    const headers = (_a = options.headers) !== null && _a !== void 0 ? _a : {};
    const contentTypeHeader = headers['Content-Type'] || headers['content-type'];
    return getParser(contentTypeHeader === null || contentTypeHeader === void 0 ? void 0 : contentTypeHeader.toLowerCase())(options);
}
