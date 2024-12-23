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
exports.startLicense = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const license_1 = require("@rocket.chat/license");
const models_1 = require("@rocket.chat/models");
const tools_1 = require("@rocket.chat/tools");
const moment_1 = __importDefault(require("moment"));
const getAppCount_1 = require("./lib/getAppCount");
const syncWorkspace_1 = require("../../../../app/cloud/server/functions/syncWorkspace");
const notifyListener_1 = require("../../../../app/lib/server/lib/notifyListener");
const server_1 = require("../../../../app/settings/server");
const callbacks_1 = require("../../../../lib/callbacks");
const startLicense = () => __awaiter(void 0, void 0, void 0, function* () {
    server_1.settings.watch('Site_Url', (value) => {
        if (value) {
            void license_1.License.setWorkspaceUrl(value);
        }
    });
    license_1.License.onValidateLicense(() => __awaiter(void 0, void 0, void 0, function* () {
        (yield models_1.Settings.updateValueById('Enterprise_License', license_1.License.encryptedLicense)).modifiedCount &&
            void (0, notifyListener_1.notifyOnSettingChangedById)('Enterprise_License');
        (yield models_1.Settings.updateValueById('Enterprise_License_Status', 'Valid')).modifiedCount &&
            void (0, notifyListener_1.notifyOnSettingChangedById)('Enterprise_License_Status');
    }));
    license_1.License.onInvalidateLicense(() => __awaiter(void 0, void 0, void 0, function* () {
        (yield models_1.Settings.updateValueById('Enterprise_License_Status', 'Invalid')).modifiedCount &&
            void (0, notifyListener_1.notifyOnSettingChangedById)('Enterprise_License_Status');
    }));
    license_1.License.onRemoveLicense(() => __awaiter(void 0, void 0, void 0, function* () {
        (yield models_1.Settings.updateValueById('Enterprise_License', '')).modifiedCount &&
            void (0, notifyListener_1.notifyOnSettingChangedById)('Enterprise_License_Status');
        (yield models_1.Settings.updateValueById('Enterprise_License_Status', 'Invalid')).modifiedCount &&
            void (0, notifyListener_1.notifyOnSettingChangedById)('Enterprise_License_Status');
    }));
    /**
     * This is a debounced function that will sync the workspace data to the cloud.
     * it caches the context, waits for a second and then syncs the data.
     */
    const syncByTriggerDebounced = (() => {
        let timeout;
        const contexts = new Set();
        return (context) => __awaiter(void 0, void 0, void 0, function* () {
            contexts.add(context);
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => {
                timeout = undefined;
                void syncByTrigger([...contexts]);
                contexts.clear();
            }, 1000);
        });
    })();
    const syncByTrigger = (contexts) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!license_1.License.encryptedLicense) {
            return;
        }
        const existingData = (_a = (0, tools_1.wrapExceptions)(() => JSON.parse(server_1.settings.get('Enterprise_License_Data'))).catch(() => ({}))) !== null && _a !== void 0 ? _a : {};
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const period = `${year}-${month}-${day}`;
        const [, , signed] = license_1.License.encryptedLicense.split('.');
        // Check if this sync has already been done. Based on License, behavior.
        if ([...contexts.values()].every((context) => existingData.signed === signed && existingData[context] === period)) {
            return;
        }
        const obj = Object.fromEntries(contexts.map((context) => [context, period]));
        (yield models_1.Settings.updateValueById('Enterprise_License_Data', JSON.stringify(Object.assign(Object.assign(Object.assign(Object.assign({}, (existingData.signed === signed && existingData)), existingData), obj), { signed })))).modifiedCount && void (0, notifyListener_1.notifyOnSettingChangedById)('Enterprise_License_Data');
        try {
            yield (0, syncWorkspace_1.syncWorkspace)();
        }
        catch (error) {
            console.error(error);
        }
    });
    license_1.License.setLicenseLimitCounter('activeUsers', () => models_1.Users.getActiveLocalUserCount());
    license_1.License.setLicenseLimitCounter('guestUsers', () => models_1.Users.getActiveLocalGuestCount());
    license_1.License.setLicenseLimitCounter('roomsPerGuest', (context) => __awaiter(void 0, void 0, void 0, function* () { return ((context === null || context === void 0 ? void 0 : context.userId) ? models_1.Subscriptions.countByUserId(context.userId) : 0); }));
    license_1.License.setLicenseLimitCounter('privateApps', () => (0, getAppCount_1.getAppCount)('private'));
    license_1.License.setLicenseLimitCounter('marketplaceApps', () => (0, getAppCount_1.getAppCount)('marketplace'));
    license_1.License.setLicenseLimitCounter('monthlyActiveContacts', () => models_1.LivechatVisitors.countVisitorsOnPeriod(moment_1.default.utc().format('YYYY-MM')));
    return new Promise((resolve) => {
        // When settings are loaded, apply the current license if there is one.
        server_1.settings.onReady(() => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            Promise.resolve().then(() => __importStar(require('./airGappedRestrictions')));
            if (!(yield (0, license_1.applyLicense)((_a = server_1.settings.get('Enterprise_License')) !== null && _a !== void 0 ? _a : '', false))) {
                // License from the envvar is always treated as new, because it would have been saved on the setting if it was already in use.
                if (process.env.ROCKETCHAT_LICENSE && !license_1.License.hasValidLicense()) {
                    yield (0, license_1.applyLicense)(process.env.ROCKETCHAT_LICENSE, true);
                }
            }
            // After the current license is already loaded, watch the setting value to react to new licenses being applied.
            server_1.settings.change('Enterprise_License', (license) => (0, license_1.applyLicenseOrRemove)(license, true));
            callbacks_1.callbacks.add('workspaceLicenseRemoved', () => license_1.License.remove());
            callbacks_1.callbacks.add('workspaceLicenseChanged', (updatedLicense) => (0, license_1.applyLicense)(updatedLicense, true));
            license_1.License.onInstall(() => __awaiter(void 0, void 0, void 0, function* () { return void core_services_1.api.broadcast('license.actions', {}); }));
            license_1.License.onInvalidate(() => __awaiter(void 0, void 0, void 0, function* () { return void core_services_1.api.broadcast('license.actions', {}); }));
            license_1.License.onBehaviorTriggered('prevent_action', (context) => syncByTriggerDebounced(`prevent_action_${context.limit}`));
            license_1.License.onBehaviorTriggered('start_fair_policy', (context) => __awaiter(void 0, void 0, void 0, function* () { return syncByTriggerDebounced(`start_fair_policy_${context.limit}`); }));
            license_1.License.onBehaviorTriggered('disable_modules', (context) => __awaiter(void 0, void 0, void 0, function* () { return syncByTriggerDebounced(`disable_modules_${context.limit}`); }));
            license_1.License.onChange(() => core_services_1.api.broadcast('license.sync'));
            license_1.License.onBehaviorToggled('prevent_action', (context) => {
                if (!context.limit) {
                    return;
                }
                void core_services_1.api.broadcast('license.actions', {
                    [context.limit]: true,
                });
            });
            license_1.License.onBehaviorToggled('allow_action', (context) => {
                if (!context.limit) {
                    return;
                }
                void core_services_1.api.broadcast('license.actions', {
                    [context.limit]: false,
                });
            });
            resolve();
        }));
    });
});
exports.startLicense = startLicense;
