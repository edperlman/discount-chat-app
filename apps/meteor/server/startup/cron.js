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
const logger_1 = require("@rocket.chat/logger");
const meteor_1 = require("meteor/meteor");
const federation_1 = require("../cron/federation");
const nps_1 = require("../cron/nps");
const oembed_1 = require("../cron/oembed");
const start_1 = require("../cron/start");
const temporaryUploadsCleanup_1 = require("../cron/temporaryUploadsCleanup");
const usageReport_1 = require("../cron/usageReport");
const userDataDownloads_1 = require("../cron/userDataDownloads");
const videoConferences_1 = require("../cron/videoConferences");
const logger = new logger_1.Logger('SyncedCron');
meteor_1.Meteor.defer(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, start_1.startCron)();
    yield (0, oembed_1.oembedCron)();
    yield (0, usageReport_1.usageReportCron)(logger);
    yield (0, nps_1.npsCron)();
    yield (0, temporaryUploadsCleanup_1.temporaryUploadCleanupCron)();
    yield (0, federation_1.federationCron)();
    yield (0, videoConferences_1.videoConferencesCron)();
    yield (0, userDataDownloads_1.userDataDownloadsCron)();
}));
