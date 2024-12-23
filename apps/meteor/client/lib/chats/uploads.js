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
exports.createUploadsAPI = void 0;
const emitter_1 = require("@rocket.chat/emitter");
const random_1 = require("@rocket.chat/random");
const UserAction_1 = require("../../../app/ui/client/lib/UserAction");
const SDKClient_1 = require("../../../app/utils/client/lib/SDKClient");
const errorHandling_1 = require("../errorHandling");
let uploads = [];
const emitter = new emitter_1.Emitter();
const updateUploads = (update) => {
    uploads = update(uploads);
    emitter.emit('update');
};
const get = () => uploads;
const subscribe = (callback) => emitter.on('update', callback);
const cancel = (id) => {
    emitter.emit(`cancelling-${id}`);
};
const wipeFailedOnes = () => {
    updateUploads((uploads) => uploads.filter((upload) => !upload.error));
};
const send = (file_1, _a, getContent_1, fileContent_1) => __awaiter(void 0, [file_1, _a, getContent_1, fileContent_1], void 0, function* (file, { description, msg, rid, tmid, t, }, getContent, fileContent) {
    const id = random_1.Random.id();
    updateUploads((uploads) => [
        ...uploads,
        {
            id,
            name: (fileContent === null || fileContent === void 0 ? void 0 : fileContent.raw.name) || file.name,
            percentage: 0,
        },
    ]);
    try {
        yield new Promise((resolve, reject) => {
            const xhr = SDKClient_1.sdk.rest.upload(`/v1/rooms.media/${rid}`, Object.assign({ file }, (fileContent && {
                content: JSON.stringify(fileContent.encrypted),
            })), {
                load: (event) => {
                    resolve(event);
                },
                progress: (event) => {
                    if (!event.lengthComputable) {
                        return;
                    }
                    const progress = (event.loaded / event.total) * 100;
                    if (progress === 100) {
                        return;
                    }
                    updateUploads((uploads) => uploads.map((upload) => {
                        if (upload.id !== id) {
                            return upload;
                        }
                        return Object.assign(Object.assign({}, upload), { percentage: Math.round(progress) || 0 });
                    }));
                },
                error: (event) => {
                    updateUploads((uploads) => uploads.map((upload) => {
                        if (upload.id !== id) {
                            return upload;
                        }
                        return Object.assign(Object.assign({}, upload), { percentage: 0, error: new Error(xhr.responseText) });
                    }));
                    reject(event);
                },
            });
            xhr.onload = () => __awaiter(void 0, void 0, void 0, function* () {
                if (xhr.readyState === xhr.DONE && xhr.status === 200) {
                    const result = JSON.parse(xhr.responseText);
                    let content;
                    if (getContent) {
                        content = yield getContent(result.file._id, result.file.url);
                    }
                    yield SDKClient_1.sdk.rest.post(`/v1/rooms.mediaConfirm/${rid}/${result.file._id}`, {
                        msg,
                        tmid,
                        description,
                        t,
                        content,
                    });
                }
            });
            if (uploads.length) {
                UserAction_1.UserAction.performContinuously(rid, UserAction_1.USER_ACTIVITIES.USER_UPLOADING, { tmid });
            }
            emitter.once(`cancelling-${id}`, () => {
                xhr.abort();
                updateUploads((uploads) => uploads.filter((upload) => upload.id !== id));
            });
        });
        updateUploads((uploads) => uploads.filter((upload) => upload.id !== id));
    }
    catch (error) {
        updateUploads((uploads) => uploads.map((upload) => {
            if (upload.id !== id) {
                return upload;
            }
            return Object.assign(Object.assign({}, upload), { percentage: 0, error: new Error((0, errorHandling_1.getErrorMessage)(error)) });
        }));
    }
    finally {
        if (!uploads.length) {
            UserAction_1.UserAction.stop(rid, UserAction_1.USER_ACTIVITIES.USER_UPLOADING, { tmid });
        }
    }
});
const createUploadsAPI = ({ rid, tmid }) => ({
    get,
    subscribe,
    wipeFailedOnes,
    cancel,
    send: (file, { description, msg, t }, getContent, fileContent) => send(file, { description, msg, rid, tmid, t }, getContent, fileContent),
});
exports.createUploadsAPI = createUploadsAPI;
