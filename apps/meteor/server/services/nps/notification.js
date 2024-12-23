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
exports.notifyAdmins = exports.getBannerForAdmins = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const random_1 = require("@rocket.chat/random");
const moment_1 = __importDefault(require("moment"));
const server_1 = require("../../../app/settings/server");
const i18n_1 = require("../../lib/i18n");
const sendMessagesToAdmins_1 = require("../../lib/sendMessagesToAdmins");
const getBannerForAdmins = (expireAt) => {
    const lng = server_1.settings.get('Language') || 'en';
    return {
        platform: [core_typings_1.BannerPlatform.Web],
        createdAt: new Date(),
        expireAt,
        startAt: new Date(),
        roles: ['admin'],
        createdBy: {
            _id: 'rocket.cat',
            username: 'rocket.cat',
        },
        _updatedAt: new Date(),
        surface: 'banner',
        view: {
            viewId: random_1.Random.id(),
            appId: '',
            blocks: [
                {
                    type: 'section',
                    blockId: 'attention',
                    text: {
                        type: 'plain_text',
                        text: i18n_1.i18n.t('NPS_survey_is_scheduled_to-run-at__date__for_all_users', {
                            date: (0, moment_1.default)(expireAt).format('YYYY-MM-DD'),
                            lng,
                        }),
                        emoji: false,
                    },
                },
            ],
        },
    };
};
exports.getBannerForAdmins = getBannerForAdmins;
const notifyAdmins = (expireAt) => (0, sendMessagesToAdmins_1.sendMessagesToAdmins)({
    msgs: (_a) => __awaiter(void 0, [_a], void 0, function* ({ adminUser }) {
        return ({
            msg: i18n_1.i18n.t('NPS_survey_is_scheduled_to-run-at__date__for_all_users', {
                date: (0, moment_1.default)(expireAt).format('YYYY-MM-DD'),
                lng: adminUser.language,
            }),
        });
    }),
});
exports.notifyAdmins = notifyAdmins;
