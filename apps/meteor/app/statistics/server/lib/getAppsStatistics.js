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
exports.getAppsStatistics = void 0;
const apps_1 = require("@rocket.chat/apps");
const AppStatus_1 = require("@rocket.chat/apps-engine/definition/AppStatus");
const storage_1 = require("@rocket.chat/apps-engine/server/storage");
const mem_1 = __importDefault(require("mem"));
const system_1 = require("../../../../server/lib/logger/system");
const rocketchat_info_1 = require("../../../utils/rocketchat.info");
function _getAppsStatistics() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!((_a = apps_1.Apps.self) === null || _a === void 0 ? void 0 : _a.isInitialized())) {
            return {
                engineVersion: rocketchat_info_1.Info.marketplaceApiVersion,
                totalInstalled: false,
                totalActive: false,
                totalFailed: false,
                totalPrivateApps: false,
                totalPrivateAppsEnabled: false,
            };
        }
        try {
            const apps = yield apps_1.Apps.getManager().get();
            let totalInstalled = 0;
            let totalActive = 0;
            let totalFailed = 0;
            let totalPrivateApps = 0;
            let totalPrivateAppsEnabled = 0;
            yield Promise.all(apps.map((app) => __awaiter(this, void 0, void 0, function* () {
                totalInstalled++;
                const status = yield app.getStatus();
                const storageItem = yield app.getStorageItem();
                if (storageItem.installationSource === storage_1.AppInstallationSource.PRIVATE) {
                    totalPrivateApps++;
                    if (AppStatus_1.AppStatusUtils.isEnabled(status)) {
                        totalPrivateAppsEnabled++;
                    }
                }
                if (status === AppStatus_1.AppStatus.MANUALLY_DISABLED) {
                    totalFailed++;
                }
                if (AppStatus_1.AppStatusUtils.isEnabled(status)) {
                    totalActive++;
                }
            })));
            return {
                engineVersion: rocketchat_info_1.Info.marketplaceApiVersion,
                totalInstalled,
                totalActive,
                totalFailed,
                totalPrivateApps,
                totalPrivateAppsEnabled,
            };
        }
        catch (err) {
            system_1.SystemLogger.error({ msg: 'Exception while getting Apps statistics', err });
            return {
                engineVersion: rocketchat_info_1.Info.marketplaceApiVersion,
                totalInstalled: false,
                totalActive: false,
                totalFailed: false,
                totalPrivateApps: false,
                totalPrivateAppsEnabled: false,
            };
        }
    });
}
// since this function is called every 5s by `setPrometheusData` we're memoizing the result since the result won't change that often
exports.getAppsStatistics = (0, mem_1.default)(_getAppsStatistics, { maxAge: 60000 });
