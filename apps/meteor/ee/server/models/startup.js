"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const license_1 = require("@rocket.chat/license");
// To facilitate our lives with the stream
// Collection will be registered on CE too
// No functionality will be imported tho, just the service registration
Promise.resolve().then(() => __importStar(require('./LivechatPriority')));
Promise.resolve().then(() => __importStar(require('./OmnichannelServiceLevelAgreements')));
Promise.resolve().then(() => __importStar(require('./AuditLog')));
Promise.resolve().then(() => __importStar(require('./ReadReceipts')));
void license_1.License.onLicense('livechat-enterprise', () => {
    Promise.resolve().then(() => __importStar(require('./CannedResponse')));
    Promise.resolve().then(() => __importStar(require('./LivechatTag')));
    Promise.resolve().then(() => __importStar(require('./LivechatUnit')));
    Promise.resolve().then(() => __importStar(require('./LivechatUnitMonitors')));
    Promise.resolve().then(() => __importStar(require('./LivechatRooms')));
    Promise.resolve().then(() => __importStar(require('./LivechatInquiry')));
    Promise.resolve().then(() => __importStar(require('./LivechatDepartment')));
    Promise.resolve().then(() => __importStar(require('./Users')));
    Promise.resolve().then(() => __importStar(require('./LivechatDepartmentAgents')));
});
