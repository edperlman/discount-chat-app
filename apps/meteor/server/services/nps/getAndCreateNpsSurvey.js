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
exports.getAndCreateNpsSurvey = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const server_fetch_1 = require("@rocket.chat/server-fetch");
const server_1 = require("../../../app/cloud/server");
const server_2 = require("../../../app/settings/server");
const system_1 = require("../../lib/logger/system");
const getAndCreateNpsSurvey = function getNpsSurvey(npsId) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = yield (0, server_1.getWorkspaceAccessToken)();
        if (!token) {
            return false;
        }
        const npsEnabled = server_2.settings.get('NPS_survey_enabled');
        if (!npsEnabled) {
            return false;
        }
        const npsUrl = server_2.settings.get('Nps_Url');
        try {
            const result = yield (0, server_fetch_1.serverFetch)(`${npsUrl}/v1/surveys/${npsId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!result.ok) {
                system_1.SystemLogger.error({ msg: 'invalid response from the nps service:', result });
                return;
            }
            const surveyData = (yield result.json());
            const banner = {
                _id: npsId,
                platform: surveyData.platform,
                createdAt: new Date(surveyData.createdAt),
                expireAt: new Date(surveyData.expireAt),
                startAt: new Date(surveyData.startAt),
                _updatedAt: new Date(), // Needed by the IRocketChatRecord interface
                roles: surveyData.roles,
                createdBy: {
                    _id: 'rocket.cat',
                    username: 'rocket.cat',
                },
                view: surveyData.survey,
                surface: 'banner',
            };
            yield core_services_1.Banner.create(banner);
        }
        catch (e) {
            system_1.SystemLogger.error(e);
            return false;
        }
    });
};
exports.getAndCreateNpsSurvey = getAndCreateNpsSurvey;
