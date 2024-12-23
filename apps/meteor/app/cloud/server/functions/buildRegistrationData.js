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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildWorkspaceRegistrationData = buildWorkspaceRegistrationData;
const models_1 = require("@rocket.chat/models");
const moment_1 = __importDefault(require("moment"));
const server_1 = require("../../../settings/server");
const server_2 = require("../../../statistics/server");
const rocketchat_info_1 = require("../../../utils/rocketchat.info");
const license_1 = require("../license");
function buildWorkspaceRegistrationData(contactEmail) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const stats = (yield models_1.Statistics.findLast()) || (yield server_2.statistics.get());
        const address = server_1.settings.get('Site_Url');
        const siteName = server_1.settings.get('Site_Name');
        const workspaceId = server_1.settings.get('Cloud_Workspace_Id');
        const allowMarketing = server_1.settings.get('Allow_Marketing_Emails');
        const accountName = server_1.settings.get('Organization_Name');
        const website = server_1.settings.get('Website');
        const npsEnabled = server_1.settings.get('NPS_survey_enabled');
        const agreePrivacyTerms = server_1.settings.get('Cloud_Service_Agree_PrivacyTerms');
        const setupWizardState = server_1.settings.get('Show_Setup_Wizard');
        const deploymentFingerprintHash = server_1.settings.get('Deployment_FingerPrint_Hash');
        const deploymentFingerprintVerified = server_1.settings.get('Deployment_FingerPrint_Verified');
        const firstUser = yield models_1.Users.getOldest({ projection: { name: 1, emails: 1 } });
        const contactName = (firstUser === null || firstUser === void 0 ? void 0 : firstUser.name) || '';
        const country = server_1.settings.get('Country');
        const language = server_1.settings.get('Language');
        const organizationType = server_1.settings.get('Organization_Type');
        const industry = server_1.settings.get('Industry');
        const orgSize = server_1.settings.get('Size');
        const workspaceType = server_1.settings.get('Server_Type');
        const seats = yield models_1.Users.getActiveLocalUserCount();
        const [macs] = yield models_1.LivechatRooms.getMACStatisticsForPeriod(moment_1.default.utc().format('YYYY-MM'));
        const license = server_1.settings.get('Enterprise_License');
        return Object.assign(Object.assign({ uniqueId: stats.uniqueId, deploymentFingerprintHash,
            deploymentFingerprintVerified,
            workspaceId,
            address,
            contactName,
            contactEmail,
            seats,
            allowMarketing,
            accountName, organizationType: String(organizationType), industry: String(industry), orgSize: String(orgSize), country: String(country), language: String(language), agreePrivacyTerms,
            website,
            siteName, workspaceType: String(workspaceType), deploymentMethod: stats.deploy.method, deploymentPlatform: stats.deploy.platform, version: (_a = stats.version) !== null && _a !== void 0 ? _a : rocketchat_info_1.Info.version, licenseVersion: license_1.LICENSE_VERSION }, (license && { license })), { enterpriseReady: true, setupComplete: setupWizardState === 'completed', connectionDisable: false, npsEnabled, MAC: (_b = macs === null || macs === void 0 ? void 0 : macs.contactsCount) !== null && _b !== void 0 ? _b : 0, 
            // activeContactsBillingMonth: stats.omnichannelContactsBySource.contactsCount,
            // activeContactsYesterday: stats.uniqueContactsOfYesterday.contactsCount,
            statsToken: stats.statsToken });
    });
}
