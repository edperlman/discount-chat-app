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
exports.createMiscSettings = void 0;
const crypto_1 = __importDefault(require("crypto"));
const logger_1 = require("@rocket.chat/logger");
const models_1 = require("@rocket.chat/models");
const uuid_1 = require("uuid");
const auditedSettingUpdates_1 = require("./lib/auditedSettingUpdates");
const server_1 = require("../../app/settings/server");
const logger = new logger_1.Logger('FingerPrint');
const generateFingerprint = function () {
    const siteUrl = server_1.settings.get('Site_Url');
    const dbConnectionString = process.env.MONGO_URL;
    const fingerprint = `${siteUrl}${dbConnectionString}`;
    return crypto_1.default.createHash('sha256').update(fingerprint).digest('base64');
};
const updateFingerprint = function (fingerprint, verified) {
    return __awaiter(this, void 0, void 0, function* () {
        const auditedSettingBySystem = (0, auditedSettingUpdates_1.updateAuditedBySystem)({
            reason: 'updateFingerprint',
        });
        // No need to call ws listener because current function is called on startup
        yield Promise.all([
            auditedSettingBySystem(models_1.Settings.updateValueById, 'Deployment_FingerPrint_Hash', fingerprint),
            auditedSettingBySystem(models_1.Settings.updateValueById, 'Deployment_FingerPrint_Verified', verified),
        ]);
    });
};
const verifyFingerPrint = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const DeploymentFingerPrintRecordHash = yield models_1.Settings.getValueById('Deployment_FingerPrint_Hash');
        const fingerprint = generateFingerprint();
        if (!DeploymentFingerPrintRecordHash) {
            logger.info('Generating fingerprint for the first time', fingerprint);
            yield updateFingerprint(fingerprint, true);
            return;
        }
        if (DeploymentFingerPrintRecordHash === fingerprint) {
            return;
        }
        if (process.env.AUTO_ACCEPT_FINGERPRINT === 'true') {
            logger.info('Updating fingerprint as AUTO_ACCEPT_FINGERPRINT is true', fingerprint);
            yield updateFingerprint(fingerprint, true);
            return;
        }
        logger.warn('Updating fingerprint as pending for admin verification', fingerprint);
        yield updateFingerprint(fingerprint, false);
    });
};
// Insert server unique id if it doesn't exist
const createMiscSettings = () => __awaiter(void 0, void 0, void 0, function* () {
    yield server_1.settingsRegistry.add('uniqueID', process.env.DEPLOYMENT_ID || (0, uuid_1.v4)(), {
        public: true,
    });
    yield server_1.settingsRegistry.add('Deployment_FingerPrint_Hash', '', {
        public: false,
        readonly: true,
    });
    yield server_1.settingsRegistry.add('Deployment_FingerPrint_Verified', true, {
        type: 'boolean',
        public: true,
        readonly: true,
    });
    server_1.settings.watch('Site_Url', () => {
        void verifyFingerPrint();
    });
    yield server_1.settingsRegistry.add('Initial_Channel_Created', false, {
        type: 'boolean',
        hidden: true,
    });
});
exports.createMiscSettings = createMiscSettings;
