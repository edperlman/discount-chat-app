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
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const logger_1 = require("@rocket.chat/logger");
const models_1 = require("@rocket.chat/models");
const random_1 = require("@rocket.chat/random");
const server_fetch_1 = require("@rocket.chat/server-fetch");
const meteor_1 = require("meteor/meteor");
const getFileExtension_1 = require("../../../../../lib/utils/getFileExtension");
const server_1 = require("../../../../api/server");
const server_2 = require("../../../../file-upload/server");
const checkUrlForSsrf_1 = require("../../../../lib/server/functions/checkUrlForSsrf");
const server_3 = require("../../../../settings/server");
const customFields_1 = require("../../../server/api/lib/customFields");
const LivechatTyped_1 = require("../../../server/lib/LivechatTyped");
const logger = new logger_1.Logger('SMS');
const getUploadFile = (details, fileUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const isSsrfSafe = yield (0, checkUrlForSsrf_1.checkUrlForSsrf)(fileUrl);
    if (!isSsrfSafe) {
        throw new meteor_1.Meteor.Error('error-invalid-url', 'Invalid URL');
    }
    const response = yield (0, server_fetch_1.serverFetch)(fileUrl, { redirect: 'error' });
    const content = Buffer.from(yield response.arrayBuffer());
    const contentSize = content.length;
    if (response.status !== 200 || contentSize === 0) {
        throw new meteor_1.Meteor.Error('error-invalid-file-uploaded', 'Invalid file uploaded');
    }
    const fileStore = server_2.FileUpload.getStore('Uploads');
    return fileStore.insert(Object.assign(Object.assign({}, details), { size: contentSize }), content);
});
const defineDepartment = (idOrName) => __awaiter(void 0, void 0, void 0, function* () {
    if (!idOrName || idOrName === '') {
        return;
    }
    const department = yield models_1.LivechatDepartment.findOneByIdOrName(idOrName, { projection: { _id: 1 } });
    return department === null || department === void 0 ? void 0 : department._id;
});
const defineVisitor = (smsNumber, targetDepartment) => __awaiter(void 0, void 0, void 0, function* () {
    const visitor = yield models_1.LivechatVisitors.findOneVisitorByPhone(smsNumber);
    let data = {
        token: (visitor === null || visitor === void 0 ? void 0 : visitor.token) || random_1.Random.id(),
    };
    if (!visitor) {
        data = Object.assign(data, {
            username: smsNumber.replace(/[^0-9]/g, ''),
            phone: {
                number: smsNumber,
            },
        });
    }
    if (targetDepartment) {
        data.department = targetDepartment;
    }
    const livechatVisitor = yield LivechatTyped_1.Livechat.registerGuest(data);
    if (!livechatVisitor) {
        throw new meteor_1.Meteor.Error('error-invalid-visitor', 'Invalid visitor');
    }
    return livechatVisitor;
});
const normalizeLocationSharing = (payload) => {
    const { extra: { fromLatitude: latitude, fromLongitude: longitude } = {} } = payload;
    if (!latitude || !longitude) {
        return;
    }
    return {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
    };
};
// @ts-expect-error - this is an special endpoint that requires the return to not be wrapped as regular returns
server_1.API.v1.addRoute('livechat/sms-incoming/:service', {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { service } = this.urlParams;
            if (!(yield core_services_1.OmnichannelIntegration.isConfiguredSmsService(service))) {
                return server_1.API.v1.failure('Invalid service');
            }
            const smsDepartment = server_3.settings.get('SMS_Default_Omnichannel_Department');
            const SMSService = yield core_services_1.OmnichannelIntegration.getSmsService(service);
            if (!SMSService.validateRequest(this.request)) {
                return server_1.API.v1.failure('Invalid request');
            }
            const sms = SMSService.parse(this.bodyParams);
            const { department } = this.queryParams;
            let targetDepartment = yield defineDepartment(department || smsDepartment);
            if (!targetDepartment) {
                targetDepartment = yield defineDepartment(smsDepartment);
            }
            const visitor = yield defineVisitor(sms.from, targetDepartment);
            if (!visitor) {
                return server_1.API.v1.success(SMSService.error(new Error('Invalid visitor')));
            }
            const roomInfo = {
                sms: {
                    from: sms.to,
                },
                source: {
                    type: core_typings_1.OmnichannelSourceType.SMS,
                    alias: service,
                    destination: sms.to,
                },
            };
            const { token } = visitor;
            const room = (_a = (yield models_1.LivechatRooms.findOneOpenByVisitorTokenAndDepartmentIdAndSource(token, targetDepartment, core_typings_1.OmnichannelSourceType.SMS))) !== null && _a !== void 0 ? _a : (yield LivechatTyped_1.Livechat.createRoom({
                visitor,
                roomInfo,
            }));
            const location = normalizeLocationSharing(sms);
            const rid = room === null || room === void 0 ? void 0 : room._id;
            let file;
            const attachments = [];
            const [media] = (sms === null || sms === void 0 ? void 0 : sms.media) || [];
            if (media) {
                const { url: smsUrl, contentType } = media;
                const details = {
                    name: 'Upload File',
                    type: contentType,
                    rid,
                    visitorToken: token,
                };
                try {
                    const uploadedFile = yield getUploadFile(details, smsUrl);
                    file = { _id: uploadedFile._id, name: uploadedFile.name || 'file', type: uploadedFile.type };
                    const fileUrl = server_2.FileUpload.getPath(`${file._id}/${encodeURI(file.name || 'file')}`);
                    const fileType = file.type;
                    if (/^image\/.+/.test(fileType)) {
                        const attachment = {
                            title: file.name,
                            type: 'file',
                            description: file.description,
                            title_link: fileUrl,
                            image_url: fileUrl,
                            image_type: fileType,
                            image_size: file.size,
                        };
                        if ((_b = file.identify) === null || _b === void 0 ? void 0 : _b.size) {
                            attachment.image_dimensions = file === null || file === void 0 ? void 0 : file.identify.size;
                        }
                        attachments.push(attachment);
                    }
                    else if (/^audio\/.+/.test(fileType)) {
                        const attachment = {
                            title: file.name,
                            type: 'file',
                            description: file.description,
                            title_link: fileUrl,
                            audio_url: fileUrl,
                            audio_type: fileType,
                            audio_size: file.size,
                            title_link_download: true,
                        };
                        attachments.push(attachment);
                    }
                    else if (/^video\/.+/.test(fileType)) {
                        const attachment = {
                            title: file.name,
                            type: 'file',
                            description: file.description,
                            title_link: fileUrl,
                            video_url: fileUrl,
                            video_type: fileType,
                            video_size: file.size,
                            title_link_download: true,
                        };
                        attachments.push(attachment);
                    }
                    else {
                        const attachment = {
                            title: file.name,
                            type: 'file',
                            description: file.description,
                            format: (0, getFileExtension_1.getFileExtension)(file.name),
                            title_link: fileUrl,
                            title_link_download: true,
                            size: file.size,
                        };
                        attachments.push(attachment);
                    }
                }
                catch (err) {
                    logger.error({ msg: 'Attachment upload failed', err });
                    const attachment = {
                        title: 'Attachment upload failed',
                        type: 'file',
                        description: 'An attachment was received, but upload to server failed',
                        fields: [
                            {
                                title: 'User upload failed',
                                value: 'An attachment was received, but upload to server failed',
                                short: true,
                            },
                        ],
                        color: 'yellow',
                    };
                    attachments.push(attachment);
                }
            }
            const sendMessage = {
                guest: visitor,
                roomInfo,
                message: Object.assign(Object.assign(Object.assign({ _id: random_1.Random.id(), rid,
                    token, msg: sms.body }, (location && { location })), (attachments && { attachments: attachments.filter((a) => !!a) })), (file && { file })),
            };
            try {
                yield LivechatTyped_1.Livechat.sendMessage(sendMessage);
                const msg = SMSService.response();
                setImmediate(() => __awaiter(this, void 0, void 0, function* () {
                    if (sms.extra) {
                        if (sms.extra.fromCountry) {
                            yield (0, customFields_1.setCustomField)(sendMessage.message.token, 'country', sms.extra.fromCountry);
                        }
                        if (sms.extra.fromState) {
                            yield (0, customFields_1.setCustomField)(sendMessage.message.token, 'state', sms.extra.fromState);
                        }
                        if (sms.extra.fromCity) {
                            yield (0, customFields_1.setCustomField)(sendMessage.message.token, 'city', sms.extra.fromCity);
                        }
                        if (sms.extra.fromZip) {
                            yield (0, customFields_1.setCustomField)(sendMessage.message.token, 'zip', sms.extra.fromZip);
                        }
                    }
                }));
                return msg;
            }
            catch (e) {
                return SMSService.error(e);
            }
        });
    },
});
