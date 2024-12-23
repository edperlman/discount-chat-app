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
exports.getStatistics = getStatistics;
const console_1 = require("console");
const core_services_1 = require("@rocket.chat/core-services");
const license_1 = require("@rocket.chat/license");
const models_1 = require("@rocket.chat/models");
function getStatistics() {
    return __awaiter(this, void 0, void 0, function* () {
        const genericStats = {
            modules: license_1.License.getModules(),
            tags: license_1.License.getTags().map(({ name }) => name),
            seatRequests: yield core_services_1.Analytics.getSeatRequestCount(),
        };
        const eeModelsStats = yield getEEStatistics();
        const statistics = Object.assign(Object.assign({}, genericStats), eeModelsStats);
        return statistics;
    });
}
function getEEStatistics() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!license_1.License.hasModule('livechat-enterprise')) {
            return;
        }
        const statsPms = [];
        const statistics = {};
        // Number of livechat tags
        statsPms.push(models_1.LivechatTag.estimatedDocumentCount().then((count) => {
            statistics.livechatTags = count;
            return true;
        }));
        // Number of canned responses
        statsPms.push(models_1.CannedResponse.estimatedDocumentCount().then((count) => {
            statistics.cannedResponses = count;
            return true;
        }));
        // Number of Service Level Agreements
        statsPms.push(models_1.OmnichannelServiceLevelAgreements.estimatedDocumentCount().then((count) => {
            statistics.slas = count;
            return true;
        }));
        statsPms.push(models_1.LivechatRooms.countPrioritizedRooms().then((count) => {
            statistics.omnichannelRoomsWithPriorities = count;
            return true;
        }));
        statsPms.push(models_1.LivechatRooms.countRoomsWithSla().then((count) => {
            statistics.omnichannelRoomsWithSlas = count;
            return true;
        }));
        // Number of business units
        statsPms.push(models_1.LivechatUnit.countUnits().then((count) => {
            statistics.businessUnits = count;
            return true;
        }));
        statsPms.push(
        // Total livechat monitors
        models_1.Users.countByRole('livechat-monitor').then((count) => {
            statistics.livechatMonitors = count;
            return true;
        }));
        // Number of PDF transcript requested
        statsPms.push(models_1.LivechatRooms.countRoomsWithPdfTranscriptRequested().then((count) => {
            statistics.omnichannelPdfTranscriptRequested = count;
        }));
        // Number of PDF transcript that succeeded
        statsPms.push(models_1.LivechatRooms.countRoomsWithTranscriptSent().then((count) => {
            statistics.omnichannelPdfTranscriptSucceeded = count;
        }));
        yield Promise.all(statsPms).catch(console_1.log);
        return statistics;
    });
}
