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
exports.AppCloudBridge = void 0;
const CloudWorkspaceBridge_1 = require("@rocket.chat/apps-engine/server/bridges/CloudWorkspaceBridge");
const server_1 = require("../../../cloud/server");
class AppCloudBridge extends CloudWorkspaceBridge_1.CloudWorkspaceBridge {
    constructor(orch) {
        super();
        this.orch = orch;
    }
    getWorkspaceToken(scope, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`App ${appId} is getting the workspace's token`);
            const token = yield (0, server_1.getWorkspaceAccessTokenWithScope)({ scope });
            return token;
        });
    }
}
exports.AppCloudBridge = AppCloudBridge;
