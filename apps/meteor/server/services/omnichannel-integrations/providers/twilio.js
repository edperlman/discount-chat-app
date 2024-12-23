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
exports.Twilio = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const filesize_1 = __importDefault(require("filesize"));
const twilio_1 = __importDefault(require("twilio"));
const server_1 = require("../../../../app/settings/server");
const restrictions_1 = require("../../../../app/utils/server/restrictions");
const i18n_1 = require("../../../lib/i18n");
const system_1 = require("../../../lib/logger/system");
const isTwilioData = (data) => {
    if (typeof data !== 'object' || data === null) {
        return false;
    }
    const { From, To, Body } = data;
    return typeof From === 'string' && typeof To === 'string' && typeof Body === 'string';
};
const MAX_FILE_SIZE = 5242880;
const notifyAgent = (userId, rid, msg) => userId &&
    rid &&
    void core_services_1.api.broadcast('notify.ephemeralMessage', userId, rid, {
        msg,
    });
class Twilio {
    parse(data) {
        let numMedia = 0;
        if (!isTwilioData(data)) {
            throw new Error('Invalid data');
        }
        const returnData = {
            from: data.From,
            to: data.To,
            body: data.Body,
            extra: {
                toCountry: data.ToCountry,
                toState: data.ToState,
                toCity: data.ToCity,
                toZip: data.ToZip,
                fromCountry: data.FromCountry,
                fromState: data.FromState,
                fromCity: data.FromCity,
                fromZip: data.FromZip,
                fromLatitude: data.Latitude,
                fromLongitude: data.Longitude,
            },
        };
        if (data.NumMedia) {
            numMedia = parseInt(data.NumMedia, 10);
        }
        if (isNaN(numMedia)) {
            system_1.SystemLogger.error(`Error parsing NumMedia ${data.NumMedia}`);
            return returnData;
        }
        returnData.media = [];
        for (let mediaIndex = 0; mediaIndex < numMedia; mediaIndex++) {
            const media = {
                url: '',
                contentType: '',
            };
            const mediaUrl = data[`MediaUrl${mediaIndex}`];
            const contentType = data[`MediaContentType${mediaIndex}`];
            media.url = mediaUrl;
            media.contentType = contentType;
            returnData.media.push(media);
        }
        return returnData;
    }
    getClient(rid, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sid = server_1.settings.get('SMS_Twilio_Account_SID');
            const token = server_1.settings.get('SMS_Twilio_authToken');
            if (!sid || !token) {
                yield notifyAgent(userId, rid, i18n_1.i18n.t('SMS_Twilio_NotConfigured'));
                return;
            }
            try {
                return (0, twilio_1.default)(sid, token);
            }
            catch (error) {
                yield notifyAgent(userId, rid, i18n_1.i18n.t('SMS_Twilio_InvalidCredentials'));
                system_1.SystemLogger.error(`(Twilio) -> ${error}`);
            }
        });
    }
    validateFileUpload(extraData, lang) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rid, userId, fileUpload: { size, type, publicFilePath } = { size: 0, type: 'invalid' } } = extraData;
            const user = userId ? yield models_1.Users.findOne({ _id: userId }, { projection: { language: 1 } }) : null;
            const lng = (user === null || user === void 0 ? void 0 : user.language) || lang;
            let reason;
            if (!server_1.settings.get('SMS_Twilio_FileUpload_Enabled')) {
                reason = i18n_1.i18n.t('FileUpload_Disabled', { lng });
            }
            else if (size > MAX_FILE_SIZE) {
                reason = i18n_1.i18n.t('File_exceeds_allowed_size_of_bytes', {
                    size: (0, filesize_1.default)(MAX_FILE_SIZE),
                    lng,
                });
            }
            else if (!(0, restrictions_1.fileUploadIsValidContentType)(type, server_1.settings.get('SMS_Twilio_FileUpload_MediaTypeWhiteList'))) {
                reason = i18n_1.i18n.t('File_type_is_not_accepted', { lng });
            }
            else if (!publicFilePath) {
                reason = i18n_1.i18n.t('FileUpload_NotAllowed', { lng });
            }
            // Check if JWT is set for public file uploads when protect_files is on
            // If it's not, notify user upload won't go to twilio
            const protectFileUploads = server_1.settings.get('FileUpload_ProtectFiles');
            const jwtEnabled = server_1.settings.get('FileUpload_Enable_json_web_token_for_files');
            const isJWTKeySet = jwtEnabled && !!server_1.settings.get('FileUpload_json_web_token_secret_for_files');
            if (protectFileUploads && (!jwtEnabled || !isJWTKeySet)) {
                reason = i18n_1.i18n.t('FileUpload_ProtectFilesEnabled_JWTNotSet', { lng });
            }
            if (reason) {
                yield notifyAgent(userId, rid, reason);
                system_1.SystemLogger.error(`(Twilio) -> ${reason}`);
                return '';
            }
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return publicFilePath;
        });
    }
    send(fromNumber, toNumber, message, extraData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rid, userId } = extraData || {};
            const client = yield this.getClient(rid, userId);
            if (!client) {
                return {
                    isSuccess: false,
                    resultMsg: 'Twilio not configured',
                };
            }
            let body = message;
            let mediaUrl;
            const defaultLanguage = server_1.settings.get('Language') || 'en';
            if (extraData === null || extraData === void 0 ? void 0 : extraData.fileUpload) {
                const publicFilePath = yield this.validateFileUpload(extraData, defaultLanguage);
                if (!publicFilePath) {
                    return {
                        isSuccess: false,
                        resultMsg: 'File upload not allowed',
                    };
                }
                mediaUrl = [publicFilePath];
            }
            let persistentAction;
            if (extraData === null || extraData === void 0 ? void 0 : extraData.location) {
                const [longitude, latitude] = extraData.location.coordinates;
                persistentAction = `geo:${latitude},${longitude}`;
                body = i18n_1.i18n.t('Location', { lng: defaultLanguage });
            }
            try {
                const result = yield client.messages.create(Object.assign(Object.assign({ to: toNumber, from: fromNumber, body }, (mediaUrl && { mediaUrl })), (persistentAction && { persistentAction })));
                if (result.errorCode) {
                    yield notifyAgent(userId, rid, result.errorMessage);
                    system_1.SystemLogger.error(`(Twilio) -> ${result.errorCode}`);
                }
                return {
                    isSuccess: result.status !== 'failed',
                    resultMsg: result.status,
                };
            }
            catch (e) {
                yield notifyAgent(userId, rid, e.message);
                return {
                    isSuccess: false,
                    resultMsg: e.message,
                };
            }
        });
    }
    response() {
        return {
            headers: {
                'Content-Type': 'text/xml',
            },
            body: '<Response></Response>',
        };
    }
    isRequestFromTwilio(signature, request) {
        const authToken = server_1.settings.get('SMS_Twilio_authToken');
        let siteUrl = server_1.settings.get('Site_Url');
        if (siteUrl.endsWith('/')) {
            siteUrl = siteUrl.replace(/.$/, '');
        }
        if (!authToken || !siteUrl) {
            system_1.SystemLogger.error(`(Twilio) -> URL or Twilio token not configured.`);
            return false;
        }
        const twilioUrl = request.originalUrl ? `${siteUrl}${request.originalUrl}` : `${siteUrl}/api/v1/livechat/sms-incoming/twilio`;
        return twilio_1.default.validateRequest(authToken, signature, twilioUrl, request.body);
    }
    validateRequest(request) {
        // We're not getting original twilio requests on CI :p
        if (process.env.TEST_MODE === 'true') {
            return true;
        }
        const twilioHeader = request.headers['x-twilio-signature'] || '';
        const twilioSignature = Array.isArray(twilioHeader) ? twilioHeader[0] : twilioHeader;
        return this.isRequestFromTwilio(twilioSignature, request);
    }
    error(error) {
        let message = '';
        if (error.reason) {
            message = `<Message>${error.reason}</Message>`;
        }
        return {
            headers: {
                'Content-Type': 'text/xml',
            },
            body: `<Response>${message}</Response>`,
        };
    }
}
exports.Twilio = Twilio;
