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
exports.AppThreadBridge = void 0;
const ThreadBridge_1 = require("@rocket.chat/apps-engine/server/bridges/ThreadBridge");
class AppThreadBridge extends ThreadBridge_1.ThreadBridge {
    constructor(orch) {
        super();
        this.orch = orch;
    }
    getById(threadID, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.orch.debugLog(`The App ${appId} is getting the thread: "${threadID}"`);
            return (_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('threads').convertById(threadID);
        });
    }
}
exports.AppThreadBridge = AppThreadBridge;
