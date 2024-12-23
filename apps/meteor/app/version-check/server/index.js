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
const cron_1 = require("@rocket.chat/cron");
const meteor_1 = require("meteor/meteor");
const checkVersionUpdate_1 = require("./functions/checkVersionUpdate");
const server_1 = require("../../settings/server");
require("./methods/banner_dismiss");
const jobName = 'version_check';
if (await cron_1.cronJobs.has(jobName)) {
    await cron_1.cronJobs.remove(jobName);
}
const addVersionCheckJob = () => __awaiter(void 0, void 0, void 0, function* () {
    yield cron_1.cronJobs.add(jobName, '0 2 * * *', () => __awaiter(void 0, void 0, void 0, function* () { return (0, checkVersionUpdate_1.checkVersionUpdate)(); }));
});
meteor_1.Meteor.startup(() => {
    setImmediate(() => {
        if (server_1.settings.get('Update_EnableChecker')) {
            void (0, checkVersionUpdate_1.checkVersionUpdate)();
        }
    });
});
server_1.settings.watch('Update_EnableChecker', () => __awaiter(void 0, void 0, void 0, function* () {
    const checkForUpdates = server_1.settings.get('Update_EnableChecker');
    if (checkForUpdates && (yield cron_1.cronJobs.has(jobName))) {
        return;
    }
    if (checkForUpdates) {
        yield addVersionCheckJob();
        return;
    }
    yield cron_1.cronJobs.remove(jobName);
}));
