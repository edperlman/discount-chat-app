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
exports.buildVersionUpdateMessage = void 0;
const models_1 = require("@rocket.chat/models");
const semver_1 = __importDefault(require("semver"));
const i18n_1 = require("../../../../server/lib/i18n");
const sendMessagesToAdmins_1 = require("../../../../server/lib/sendMessagesToAdmins");
const auditedSettingUpdates_1 = require("../../../../server/settings/lib/auditedSettingUpdates");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const server_1 = require("../../../settings/server");
const rocketchat_info_1 = require("../../../utils/rocketchat.info");
const buildVersionUpdateMessage = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (versions = []) {
    var _a, versions_1, versions_1_1;
    var _b, e_1, _c, _d;
    if (process.env.TEST_MODE) {
        return;
    }
    const lastCheckedVersion = server_1.settings.get('Update_LatestAvailableVersion');
    if (!lastCheckedVersion) {
        return;
    }
    try {
        for (_a = true, versions_1 = __asyncValues(versions); versions_1_1 = yield versions_1.next(), _b = versions_1_1.done, !_b; _a = true) {
            _d = versions_1_1.value;
            _a = false;
            const version = _d;
            // Ignore prerelease versions
            if (semver_1.default.prerelease(version.version)) {
                continue;
            }
            if (semver_1.default.lte(version.version, lastCheckedVersion)) {
                continue;
            }
            if (semver_1.default.lte(version.version, rocketchat_info_1.Info.version)) {
                continue;
            }
            (yield (0, auditedSettingUpdates_1.updateAuditedBySystem)({
                reason: 'buildVersionUpdateMessage',
            })(models_1.Settings.updateValueById, 'Update_LatestAvailableVersion', version.version)).modifiedCount && void (0, notifyListener_1.notifyOnSettingChangedById)('Update_LatestAvailableVersion');
            yield (0, sendMessagesToAdmins_1.sendMessagesToAdmins)({
                msgs: (_a) => __awaiter(void 0, [_a], void 0, function* ({ adminUser }) {
                    return [
                        {
                            msg: `*${i18n_1.i18n.t('Update_your_RocketChat', Object.assign({}, (adminUser.language && { lng: adminUser.language })))}*\n${i18n_1.i18n.t('New_version_available_(s)', {
                                postProcess: 'sprintf',
                                sprintf: [version.version],
                            })}\n${version.infoUrl}`,
                        },
                    ];
                }),
                banners: [
                    {
                        id: `versionUpdate-${version.version}`.replace(/\./g, '_'),
                        priority: 10,
                        title: 'Update_your_RocketChat',
                        text: 'New_version_available_(s)',
                        textArguments: [version.version],
                        link: version.infoUrl,
                        modifiers: [],
                    },
                ],
            });
            break;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_a && !_b && (_c = versions_1.return)) yield _c.call(versions_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
});
exports.buildVersionUpdateMessage = buildVersionUpdateMessage;
