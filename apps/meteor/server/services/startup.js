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
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerServices = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const logger_1 = require("@rocket.chat/logger");
const omnichannel_services_1 = require("@rocket.chat/omnichannel-services");
const mongo_1 = require("meteor/mongo");
const roomAccessValidator_internalService_1 = require("../../app/livechat/server/roomAccessValidator.internalService");
const isRunningMs_1 = require("../lib/isRunningMs");
const service_1 = require("./analytics/service");
const service_2 = require("./apps-engine/service");
const service_3 = require("./banner/service");
const service_4 = require("./calendar/service");
const service_5 = require("./device-management/service");
const service_6 = require("./image/service");
const service_7 = require("./import/service");
const service_8 = require("./ldap/service");
const service_9 = require("./messages/service");
const service_10 = require("./meteor/service");
const service_11 = require("./nps/service");
const service_12 = require("./omnichannel/service");
const service_13 = require("./omnichannel-analytics/service");
const service_14 = require("./omnichannel-integrations/service");
const service_15 = require("./omnichannel-voip/service");
const service_16 = require("./push/service");
const service_17 = require("./room/service");
const service_18 = require("./sauMonitor/service");
const service_19 = require("./settings/service");
const service_20 = require("./team/service");
const service_21 = require("./translation/service");
const service_22 = require("./uikit-core-app/service");
const service_23 = require("./upload/service");
const service_24 = require("./user/service");
const service_25 = require("./video-conference/service");
const service_26 = require("./voip-asterisk/service");
const registerServices = () => __awaiter(void 0, void 0, void 0, function* () {
    const { db } = mongo_1.MongoInternals.defaultRemoteCollectionDriver().mongo;
    core_services_1.api.registerService(new service_2.AppsEngineService());
    core_services_1.api.registerService(new service_1.AnalyticsService());
    core_services_1.api.registerService(new roomAccessValidator_internalService_1.AuthorizationLivechat());
    core_services_1.api.registerService(new service_3.BannerService());
    core_services_1.api.registerService(new service_4.CalendarService());
    core_services_1.api.registerService(new service_8.LDAPService());
    core_services_1.api.registerService(new service_6.MediaService());
    core_services_1.api.registerService(new service_10.MeteorService());
    core_services_1.api.registerService(new service_11.NPSService());
    core_services_1.api.registerService(new service_17.RoomService());
    core_services_1.api.registerService(new service_18.SAUMonitorService());
    core_services_1.api.registerService(new service_26.VoipAsteriskService(db));
    core_services_1.api.registerService(new service_12.OmnichannelService());
    core_services_1.api.registerService(new service_15.OmnichannelVoipService());
    core_services_1.api.registerService(new service_20.TeamService());
    core_services_1.api.registerService(new service_22.UiKitCoreAppService());
    core_services_1.api.registerService(new service_16.PushService());
    core_services_1.api.registerService(new service_5.DeviceManagementService());
    core_services_1.api.registerService(new service_25.VideoConfService());
    core_services_1.api.registerService(new service_23.UploadService());
    core_services_1.api.registerService(new service_9.MessageService());
    core_services_1.api.registerService(new service_21.TranslationService());
    core_services_1.api.registerService(new service_19.SettingsService());
    core_services_1.api.registerService(new service_14.OmnichannelIntegrationService());
    core_services_1.api.registerService(new service_7.ImportService());
    core_services_1.api.registerService(new service_13.OmnichannelAnalyticsService());
    core_services_1.api.registerService(new service_24.UserService());
    // if the process is running in micro services mode we don't need to register services that will run separately
    if (!(0, isRunningMs_1.isRunningMs)()) {
        const { Presence } = yield Promise.resolve().then(() => __importStar(require('@rocket.chat/presence')));
        const { Authorization } = yield Promise.resolve().then(() => __importStar(require('./authorization/service')));
        core_services_1.api.registerService(new Presence());
        core_services_1.api.registerService(new Authorization());
        // Run EE services defined outside of the main repo
        // Otherwise, monolith would ignore them :(
        // Always register the service and manage licensing inside the service (tbd)
        core_services_1.api.registerService(new omnichannel_services_1.QueueWorker(db, logger_1.Logger));
        core_services_1.api.registerService(new omnichannel_services_1.OmnichannelTranscript(logger_1.Logger));
    }
});
exports.registerServices = registerServices;
