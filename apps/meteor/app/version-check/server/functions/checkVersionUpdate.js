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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkVersionUpdate = void 0;
const models_1 = require("@rocket.chat/models");
const i18n_1 = require("../../../../server/lib/i18n");
const sendMessagesToAdmins_1 = require("../../../../server/lib/sendMessagesToAdmins");
const logger_1 = __importDefault(require("../logger"));
const buildVersionUpdateMessage_1 = require("./buildVersionUpdateMessage");
const getNewUpdates_1 = require("./getNewUpdates");
const getMessagesToSendToAdmins = (alerts, adminUser) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, alerts_1, alerts_1_1;
    var _b, e_1, _c, _d;
    const msgs = [];
    try {
        for (_a = true, alerts_1 = __asyncValues(alerts); alerts_1_1 = yield alerts_1.next(), _b = alerts_1_1.done, !_b; _a = true) {
            _d = alerts_1_1.value;
            _a = false;
            const alert = _d;
            if (!(yield models_1.Users.bannerExistsById(adminUser._id, `alert-${alert.id}`))) {
                continue;
            }
            msgs.push({
                msg: `*${i18n_1.i18n.t('Rocket_Chat_Alert', Object.assign({}, (adminUser.language && { lng: adminUser.language })))}:*\n\n*${i18n_1.i18n.t(alert.title, Object.assign({}, (adminUser.language && { lng: adminUser.language })))}*\n${i18n_1.i18n.t(alert.text, Object.assign(Object.assign(Object.assign({}, (adminUser.language && { lng: adminUser.language })), (Array.isArray(alert.textArguments) && {
                    postProcess: 'sprintf',
                    sprintf: alert.textArguments,
                })), ((!Array.isArray(alert.textArguments) && alert.textArguments) || {})))}\n${alert.infoUrl}`,
            });
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_a && !_b && (_c = alerts_1.return)) yield _c.call(alerts_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return msgs;
});
/**
 * @deprecated
 */
const checkVersionUpdate = () => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info('Checking for version updates');
    const { versions, alerts } = yield (0, getNewUpdates_1.getNewUpdates)();
    yield (0, buildVersionUpdateMessage_1.buildVersionUpdateMessage)(versions);
    yield showAlertsFromCloud(alerts);
});
exports.checkVersionUpdate = checkVersionUpdate;
const showAlertsFromCloud = (alerts) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(alerts === null || alerts === void 0 ? void 0 : alerts.length)) {
        return;
    }
    return (0, sendMessagesToAdmins_1.sendMessagesToAdmins)({
        msgs: (_a) => __awaiter(void 0, [_a], void 0, function* ({ adminUser }) { return getMessagesToSendToAdmins(alerts, adminUser); }),
        banners: alerts.map((alert) => ({
            id: `alert-${alert.id}`.replace(/\./g, '_'),
            priority: 10,
            title: alert.title,
            text: alert.text,
            textArguments: alert.textArguments,
            modifiers: alert.modifiers,
            link: alert.infoUrl,
        })),
    });
});
