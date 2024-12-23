"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestUploadBridge = void 0;
const UploadBridge_1 = require("../../../src/server/bridges/UploadBridge");
class TestUploadBridge extends UploadBridge_1.UploadBridge {
    getById(id, appId) {
        throw new Error('Method not implemented');
    }
    getBuffer(upload, appId) {
        throw new Error('Method not implemented');
    }
    createUpload(details, buffer, appId) {
        throw new Error('Method not implemented');
    }
}
exports.TestUploadBridge = TestUploadBridge;
