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
const license_1 = require("@rocket.chat/license");
const models_1 = require("@rocket.chat/models");
const notifyListener_1 = require("../../../../app/lib/server/lib/notifyListener");
const i18n_1 = require("../../../../server/lib/i18n");
const sendMessagesToAdmins_1 = require("../../../../server/lib/sendMessagesToAdmins");
const auditedSettingUpdates_1 = require("../../../../server/settings/lib/auditedSettingUpdates");
const updateRestrictionSetting = (remainingDays) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, auditedSettingUpdates_1.updateAuditedBySystem)({
        reason: 'updateRestrictionSetting',
    })(models_1.Settings.updateValueById, 'Cloud_Workspace_AirGapped_Restrictions_Remaining_Days', remainingDays);
    void (0, notifyListener_1.notifyOnSettingChangedById)('Cloud_Workspace_AirGapped_Restrictions_Remaining_Days');
});
const sendRocketCatWarningToAdmins = (remainingDays) => __awaiter(void 0, void 0, void 0, function* () {
    const lastDayOrNoRestrictionsAtAll = remainingDays <= 0;
    if (lastDayOrNoRestrictionsAtAll) {
        return;
    }
    if (license_1.AirGappedRestriction.isWarningPeriod(remainingDays)) {
        yield (0, sendMessagesToAdmins_1.sendMessagesToAdmins)({
            msgs: (_a) => __awaiter(void 0, [_a], void 0, function* ({ adminUser }) {
                return ({
                    msg: i18n_1.i18n.t('AirGapped_Restriction_Warning', { lng: adminUser.language || 'en', remainingDays }),
                });
            }),
        });
    }
});
license_1.AirGappedRestriction.on('remainingDays', (_a) => __awaiter(void 0, [_a], void 0, function* ({ days }) {
    yield updateRestrictionSetting(days);
    yield sendRocketCatWarningToAdmins(days);
}));
license_1.License.onValidateLicense(() => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield models_1.Statistics.findLastStatsToken();
    void license_1.AirGappedRestriction.computeRestriction(token);
}));
license_1.License.onRemoveLicense(() => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield models_1.Statistics.findLastStatsToken();
    void license_1.AirGappedRestriction.computeRestriction(token);
}));
