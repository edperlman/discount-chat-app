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
exports.AppInternalBridge = void 0;
const InternalBridge_1 = require("@rocket.chat/apps-engine/server/bridges/InternalBridge");
const models_1 = require("@rocket.chat/models");
const isTruthy_1 = require("../../../../lib/isTruthy");
const deasync_1 = require("../../../../server/deasync/deasync");
class AppInternalBridge extends InternalBridge_1.InternalBridge {
    constructor(orch) {
        super();
        this.orch = orch;
    }
    getUsernamesOfRoomByIdSync(roomId) {
        return (0, deasync_1.deasyncPromise)(this.getUsernamesOfRoomById(roomId));
    }
    getUsernamesOfRoomById(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            // This function will be converted to sync inside the apps-engine code
            // TODO: Track Deprecation
            if (!roomId) {
                return [];
            }
            const records = yield models_1.Subscriptions.findByRoomIdWhenUsernameExists(roomId, {
                projection: {
                    'u.username': 1,
                },
            }).toArray();
            if (!records || records.length === 0) {
                return [];
            }
            return records.map((s) => s.u.username).filter(isTruthy_1.isTruthy);
        });
    }
    getWorkspacePublicKey() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // #TODO: #AppsEngineTypes - Remove explicit types and typecasts once the apps-engine definition/implementation mismatch is fixed.
            const publicKeySetting = yield models_1.Settings.findOneById('Cloud_Workspace_PublicKey');
            return (_a = this.orch
                .getConverters()) === null || _a === void 0 ? void 0 : _a.get('settings').convertToApp(publicKeySetting);
        });
    }
}
exports.AppInternalBridge = AppInternalBridge;
