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
exports.uploadFiles = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const client_1 = require("../../../../app/e2e/client");
const client_2 = require("../../../../app/settings/client");
const client_3 = require("../../../../app/utils/client");
const getFileExtension_1 = require("../../../../lib/utils/getFileExtension");
const FileUploadModal_1 = __importDefault(require("../../../views/room/modals/FileUploadModal"));
const imperativeModal_1 = require("../../imperativeModal");
const prependReplies_1 = require("../../utils/prependReplies");
const getHeightAndWidthFromDataUrl = (dataURL) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            resolve({
                height: img.height,
                width: img.width,
            });
        };
        img.src = dataURL;
    });
};
const uploadFiles = (chat, files, resetFileInput) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const replies = (_b = (_a = chat.composer) === null || _a === void 0 ? void 0 : _a.quotedMessages.get()) !== null && _b !== void 0 ? _b : [];
    const msg = yield (0, prependReplies_1.prependReplies)('', replies);
    const room = yield chat.data.getRoom();
    const queue = [...files];
    const uploadFile = (file, extraData, getContent, fileContent) => {
        var _a;
        chat.uploads.send(file, Object.assign({ msg }, extraData), getContent, fileContent);
        (_a = chat.composer) === null || _a === void 0 ? void 0 : _a.clear();
        imperativeModal_1.imperativeModal.close();
        uploadNextFile();
    };
    const uploadNextFile = () => {
        var _a, _b, _c;
        const file = queue.pop();
        if (!file) {
            (_a = chat.composer) === null || _a === void 0 ? void 0 : _a.dismissAllQuotedMessages();
            return;
        }
        imperativeModal_1.imperativeModal.open({
            component: FileUploadModal_1.default,
            props: {
                file,
                fileName: file.name,
                fileDescription: (_c = (_b = chat.composer) === null || _b === void 0 ? void 0 : _b.text) !== null && _c !== void 0 ? _c : '',
                showDescription: room && !(0, core_typings_1.isRoomFederated)(room),
                onClose: () => {
                    imperativeModal_1.imperativeModal.close();
                    uploadNextFile();
                },
                onSubmit: (fileName, description) => __awaiter(void 0, void 0, void 0, function* () {
                    Object.defineProperty(file, 'name', {
                        writable: true,
                        value: fileName,
                    });
                    // encrypt attachment description
                    const e2eRoom = yield client_1.e2e.getInstanceByRoomId(room._id);
                    if (!e2eRoom) {
                        uploadFile(file, { description });
                        return;
                    }
                    if (!client_2.settings.get('E2E_Enable_Encrypt_Files')) {
                        uploadFile(file, { description });
                        return;
                    }
                    const shouldConvertSentMessages = yield e2eRoom.shouldConvertSentMessages({ msg });
                    if (!shouldConvertSentMessages) {
                        uploadFile(file, { description });
                        return;
                    }
                    const encryptedFile = yield e2eRoom.encryptFile(file);
                    if (encryptedFile) {
                        const getContent = (_id, fileUrl) => __awaiter(void 0, void 0, void 0, function* () {
                            const attachments = [];
                            const attachment = {
                                title: file.name,
                                type: 'file',
                                description,
                                title_link: fileUrl,
                                title_link_download: true,
                                encryption: {
                                    key: encryptedFile.key,
                                    iv: encryptedFile.iv,
                                },
                                hashes: {
                                    sha256: encryptedFile.hash,
                                },
                            };
                            if (/^image\/.+/.test(file.type)) {
                                const dimensions = yield getHeightAndWidthFromDataUrl(window.URL.createObjectURL(file));
                                attachments.push(Object.assign(Object.assign(Object.assign({}, attachment), { image_url: fileUrl, image_type: file.type, image_size: file.size }), (dimensions && {
                                    image_dimensions: dimensions,
                                })));
                            }
                            else if (/^audio\/.+/.test(file.type)) {
                                attachments.push(Object.assign(Object.assign({}, attachment), { audio_url: fileUrl, audio_type: file.type, audio_size: file.size }));
                            }
                            else if (/^video\/.+/.test(file.type)) {
                                attachments.push(Object.assign(Object.assign({}, attachment), { video_url: fileUrl, video_type: file.type, video_size: file.size }));
                            }
                            else {
                                attachments.push(Object.assign(Object.assign({}, attachment), { size: file.size, format: (0, getFileExtension_1.getFileExtension)(file.name) }));
                            }
                            const files = [
                                {
                                    _id,
                                    name: file.name,
                                    type: file.type,
                                    size: file.size,
                                    // "format": "png"
                                },
                            ];
                            return e2eRoom.encryptMessageContent({
                                attachments,
                                files,
                                file: files[0],
                            });
                        });
                        const fileContentData = {
                            type: file.type,
                            typeGroup: file.type.split('/')[0],
                            name: fileName,
                            encryption: {
                                key: encryptedFile.key,
                                iv: encryptedFile.iv,
                            },
                            hashes: {
                                sha256: encryptedFile.hash,
                            },
                        };
                        const fileContent = {
                            raw: fileContentData,
                            encrypted: yield e2eRoom.encryptMessageContent(fileContentData),
                        };
                        uploadFile(encryptedFile.file, {
                            t: 'e2e',
                        }, getContent, fileContent);
                    }
                }),
                invalidContentType: !(0, client_3.fileUploadIsValidContentType)(file === null || file === void 0 ? void 0 : file.type),
            },
        });
    };
    uploadNextFile();
    resetFileInput === null || resetFileInput === void 0 ? void 0 : resetFileInput();
});
exports.uploadFiles = uploadFiles;
