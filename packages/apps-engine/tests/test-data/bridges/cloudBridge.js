"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestAppCloudWorkspaceBridge = void 0;
const CloudWorkspaceBridge_1 = require("../../../src/server/bridges/CloudWorkspaceBridge");
class TestAppCloudWorkspaceBridge extends CloudWorkspaceBridge_1.CloudWorkspaceBridge {
    constructor() {
        super();
    }
    getWorkspaceToken(scope, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                token: 'mock-workspace-token',
                expiresAt: new Date(Date.now() + 10000),
            };
        });
    }
}
exports.TestAppCloudWorkspaceBridge = TestAppCloudWorkspaceBridge;
