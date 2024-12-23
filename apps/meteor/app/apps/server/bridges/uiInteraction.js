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
exports.UiInteractionBridge = void 0;
const UiInteractionBridge_1 = require("@rocket.chat/apps-engine/server/bridges/UiInteractionBridge");
const core_services_1 = require("@rocket.chat/core-services");
class UiInteractionBridge extends UiInteractionBridge_1.UiInteractionBridge {
    constructor(orch) {
        super();
        this.orch = orch;
    }
    notifyUser(user, interaction, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.orch.debugLog(`The App ${appId} is sending an interaction to user.`);
            const app = (_a = this.orch.getManager()) === null || _a === void 0 ? void 0 : _a.getOneById(appId);
            if (!app) {
                throw new Error('Invalid app provided');
            }
            void core_services_1.api.broadcast('notify.uiInteraction', user.id, interaction);
        });
    }
}
exports.UiInteractionBridge = UiInteractionBridge;
