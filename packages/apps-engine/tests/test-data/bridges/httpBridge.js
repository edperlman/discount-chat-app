"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestsHttpBridge = void 0;
const bridges_1 = require("../../../src/server/bridges");
class TestsHttpBridge extends bridges_1.HttpBridge {
    call(info) {
        return Promise.resolve({
            url: info.url,
            method: info.method,
            statusCode: 200,
            headers: info.request.headers,
            content: info.request.content,
        });
    }
}
exports.TestsHttpBridge = TestsHttpBridge;
