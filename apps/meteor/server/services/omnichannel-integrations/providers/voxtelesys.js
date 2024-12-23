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
exports.Voxtelesys = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const server_fetch_1 = require("@rocket.chat/server-fetch");
const filesize_1 = __importDefault(require("filesize"));
const server_1 = require("../../../../app/settings/server");
const mimeTypes_1 = require("../../../../app/utils/lib/mimeTypes");
const restrictions_1 = require("../../../../app/utils/server/restrictions");
const i18n_1 = require("../../../lib/i18n");
const system_1 = require("../../../lib/logger/system");
const isVoxtelesysData = (data) => {
    if (typeof data !== 'object' || data === null) {
        return false;
    }
    const { from, to, body } = data;
    return typeof from === 'string' && typeof to === 'string' && typeof body === 'string';
};
const MAX_FILE_SIZE = 5242880;
const notifyAgent = (userId, rid, msg) => void core_services_1.api.broadcast('notify.ephemeralMessage', userId, rid, {
    msg,
});
class Voxtelesys {
    constructor() {
        this.authToken = server_1.settings.get('SMS_Voxtelesys_authToken');
        this.URL = server_1.settings.get('SMS_Voxtelesys_URL');
        this.fileUploadEnabled = server_1.settings.get('SMS_Voxtelesys_FileUpload_Enabled');
        this.mediaTypeWhiteList = server_1.settings.get('SMS_Voxtelesys_FileUpload_MediaTypeWhiteList');
    }
    parse(data) {
        var _a;
        if (!isVoxtelesysData(data)) {
            throw new Error('Invalid data');
        }
        const returnData = {
            from: data.from,
            to: data.to,
            body: data.body,
            media: [],
            extra: {
                received_at: data.received_at,
            },
        };
        if (!data.media) {
            return returnData;
        }
        for (let mediaIndex = 0; mediaIndex < data.media.length; mediaIndex++) {
            const media = {
                url: '',
                contentType: '',
            };
            const mediaUrl = data.media[mediaIndex];
            const contentType = mimeTypes_1.mime.lookup(new URL(data.media[mediaIndex]).pathname);
            media.url = mediaUrl;
            media.contentType = contentType;
            (_a = returnData === null || returnData === void 0 ? void 0 : returnData.media) === null || _a === void 0 ? void 0 : _a.push(media);
        }
        return returnData;
    }
    send(fromNumber, toNumber, message, extraData) {
        return __awaiter(this, void 0, void 0, function* () {
            let media;
            const defaultLanguage = server_1.settings.get('Language') || 'en';
            if (extraData === null || extraData === void 0 ? void 0 : extraData.fileUpload) {
                const { rid, userId, fileUpload: { size, type, publicFilePath }, } = extraData;
                const user = userId ? yield models_1.Users.findOne({ _id: userId }, { projection: { language: 1 } }) : null;
                const lng = (user === null || user === void 0 ? void 0 : user.language) || defaultLanguage;
                let reason;
                if (!this.fileUploadEnabled) {
                    reason = i18n_1.i18n.t('FileUpload_Disabled', { lng });
                }
                else if (size > MAX_FILE_SIZE) {
                    reason = i18n_1.i18n.t('File_exceeds_allowed_size_of_bytes', {
                        size: (0, filesize_1.default)(MAX_FILE_SIZE),
                        lng,
                    });
                }
                else if (!(0, restrictions_1.fileUploadIsValidContentType)(type, this.mediaTypeWhiteList)) {
                    reason = i18n_1.i18n.t('File_type_is_not_accepted', { lng });
                }
                if (reason) {
                    rid && userId && (yield notifyAgent(userId, rid, reason));
                    return system_1.SystemLogger.error(`(Voxtelesys) -> ${reason}`);
                }
                media = [publicFilePath];
            }
            const options = {
                headers: {
                    Authorization: `Bearer ${this.authToken}`,
                },
                body: Object.assign({ to: [toNumber], from: fromNumber, body: message }, (media && { media })),
                method: 'POST',
            };
            try {
                yield (0, server_fetch_1.serverFetch)(this.URL || 'https://smsapi.voxtelesys.net/api/v1/sms', options);
            }
            catch (err) {
                system_1.SystemLogger.error({ msg: 'Error connecting to Voxtelesys SMS API', err });
            }
        });
    }
    response() {
        return {
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                success: true,
            },
        };
    }
    validateRequest(_request) {
        return true;
    }
    error(error) {
        let message = '';
        if (error.reason) {
            message = error.reason;
        }
        return {
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                success: false,
                error: message,
            },
        };
    }
}
exports.Voxtelesys = Voxtelesys;
