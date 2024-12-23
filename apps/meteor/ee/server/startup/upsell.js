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
const meteor_1 = require("meteor/meteor");
const notifyListener_1 = require("../../../app/lib/server/lib/notifyListener");
const auditedSettingUpdates_1 = require("../../../server/settings/lib/auditedSettingUpdates");
const handleHadTrial = () => {
    var _a;
    if ((_a = license_1.License.getLicense()) === null || _a === void 0 ? void 0 : _a.information.trial) {
        void (() => __awaiter(void 0, void 0, void 0, function* () {
            (yield (0, auditedSettingUpdates_1.updateAuditedBySystem)({
                reason: 'handleHadTrial',
            })(models_1.Settings.updateValueById, 'Cloud_Workspace_Had_Trial', true)).modifiedCount && void (0, notifyListener_1.notifyOnSettingChangedById)('Cloud_Workspace_Had_Trial');
        }))();
    }
};
meteor_1.Meteor.startup(() => {
    license_1.License.onValidateLicense(handleHadTrial);
});
