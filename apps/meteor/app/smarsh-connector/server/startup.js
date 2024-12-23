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
const generateEml_1 = require("./functions/generateEml");
const smarsh_1 = require("../../../server/settings/smarsh");
const server_1 = require("../../settings/server");
const smarshJobName = 'Smarsh EML Connector';
server_1.settings.watchMultiple(['Smarsh_Enabled', 'Smarsh_Email', 'From_Email', 'Smarsh_Interval'], function __addSmarshSyncedCronJobDebounced() {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield cron_1.cronJobs.has(smarshJobName)) {
            yield cron_1.cronJobs.remove(smarshJobName);
        }
        if (server_1.settings.get('Smarsh_Enabled') && server_1.settings.get('Smarsh_Email') !== '' && server_1.settings.get('From_Email') !== '') {
            const cronInterval = smarsh_1.smarshIntervalValuesToCronMap[server_1.settings.get('Smarsh_Interval')];
            yield cron_1.cronJobs.add(smarshJobName, cronInterval, () => __awaiter(this, void 0, void 0, function* () { return (0, generateEml_1.generateEml)(); }));
        }
    });
});
