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
exports.AppModerationBridge = void 0;
const ModerationBridge_1 = require("@rocket.chat/apps-engine/server/bridges/ModerationBridge");
const models_1 = require("@rocket.chat/models");
const reportMessage_1 = require("../../../../server/lib/moderation/reportMessage");
class AppModerationBridge extends ModerationBridge_1.ModerationBridge {
    constructor(orch) {
        super();
        this.orch = orch;
    }
    report(messageId, description, userId, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is creating a new report.`);
            if (!messageId) {
                throw new Error('Invalid message id');
            }
            if (!description) {
                throw new Error('Invalid description');
            }
            yield (0, reportMessage_1.reportMessage)(messageId, description, userId || 'rocket.cat');
        });
    }
    dismissReportsByMessageId(messageId, reason, action, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is dismissing reports by message id.`);
            if (!messageId) {
                throw new Error('Invalid message id');
            }
            yield models_1.ModerationReports.hideMessageReportsByMessageId(messageId, appId, reason, action);
        });
    }
    dismissReportsByUserId(userId, reason, action, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is dismissing reports by user id.`);
            if (!userId) {
                throw new Error('Invalid user id');
            }
            yield models_1.ModerationReports.hideMessageReportsByUserId(userId, appId, reason, action);
        });
    }
}
exports.AppModerationBridge = AppModerationBridge;
