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
exports.npsCron = npsCron;
const core_services_1 = require("@rocket.chat/core-services");
const cron_1 = require("@rocket.chat/cron");
const server_1 = require("../../app/settings/server");
function runNPS() {
    return __awaiter(this, void 0, void 0, function* () {
        // if NPS is disabled close any pending scheduled survey
        const enabled = server_1.settings.get('NPS_survey_enabled');
        if (!enabled) {
            yield core_services_1.NPS.closeOpenSurveys();
            return;
        }
        yield core_services_1.NPS.sendResults();
    });
}
function npsCron() {
    return __awaiter(this, void 0, void 0, function* () {
        yield cron_1.cronJobs.add('NPS', '21 15 * * *', () => __awaiter(this, void 0, void 0, function* () { return runNPS(); }));
    });
}
