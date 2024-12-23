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
exports.PendingFileImporter = void 0;
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const random_1 = require("@rocket.chat/random");
const server_1 = require("../../file-upload/server");
const server_2 = require("../../importer/server");
class PendingFileImporter extends server_2.Importer {
    constructor(info, importRecord, converterOptions = {}) {
        super(info, importRecord, converterOptions);
    }
    prepareFileCount() {
        const _super = Object.create(null, {
            updateProgress: { get: () => super.updateProgress }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.debug('start preparing import operation');
            yield _super.updateProgress.call(this, server_2.ProgressStep.PREPARING_STARTED);
            const fileCount = yield models_1.Messages.countAllImportedMessagesWithFilesToDownload();
            if (fileCount === 0) {
                yield _super.updateProgress.call(this, server_2.ProgressStep.DONE);
                return 0;
            }
            this.progress.count.total += fileCount;
            yield this.updateRecord({
                'count.messages': fileCount,
                'count.total': fileCount,
                'messagesstatus': null,
                'status': server_2.ProgressStep.IMPORTING_FILES,
            });
            this.reportProgress();
            setImmediate(() => {
                void this.startImport({});
            });
            return fileCount;
        });
    }
    startImport(importSelection) {
        const _super = Object.create(null, {
            updateProgress: { get: () => super.updateProgress }
        });
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            const downloadedFileIds = [];
            const maxFileCount = 10;
            const maxFileSize = 1024 * 1024 * 500;
            let count = 0;
            let currentSize = 0;
            let nextSize = 0;
            const waitForFiles = () => __awaiter(this, void 0, void 0, function* () {
                if (count + 1 < maxFileCount && currentSize + nextSize < maxFileSize) {
                    return;
                }
                return new Promise((resolve) => {
                    const handler = setInterval(() => {
                        if (count + 1 >= maxFileCount) {
                            return;
                        }
                        if (currentSize + nextSize >= maxFileSize && count > 0) {
                            return;
                        }
                        clearInterval(handler);
                        resolve();
                    }, 1000);
                });
            });
            const completeFile = (details) => __awaiter(this, void 0, void 0, function* () {
                yield this.addCountCompleted(1);
                count--;
                currentSize -= details.size;
            });
            const logError = this.logger.error.bind(this.logger);
            try {
                const pendingFileMessageList = models_1.Messages.findAllImportedMessagesWithFilesToDownload();
                const importedRoomIds = new Set();
                try {
                    for (var _d = true, pendingFileMessageList_1 = __asyncValues(pendingFileMessageList), pendingFileMessageList_1_1; pendingFileMessageList_1_1 = yield pendingFileMessageList_1.next(), _a = pendingFileMessageList_1_1.done, !_a; _d = true) {
                        _c = pendingFileMessageList_1_1.value;
                        _d = false;
                        const message = _c;
                        try {
                            const { _importFile } = message;
                            if (!_importFile || _importFile.downloaded || downloadedFileIds.includes(_importFile.id)) {
                                yield this.addCountCompleted(1);
                                continue;
                            }
                            const url = _importFile.downloadUrl;
                            if (!(url === null || url === void 0 ? void 0 : url.startsWith('http'))) {
                                yield this.addCountCompleted(1);
                                continue;
                            }
                            const details = {
                                message_id: `${message._id}-file-${_importFile.id}`,
                                name: _importFile.name || random_1.Random.id(),
                                size: _importFile.size || 0,
                                userId: message.u._id,
                                rid: message.rid,
                            };
                            const requestModule = /https/i.test(url) ? https_1.default : http_1.default;
                            const fileStore = server_1.FileUpload.getStore('Uploads');
                            nextSize = details.size;
                            yield waitForFiles();
                            count++;
                            currentSize += nextSize;
                            downloadedFileIds.push(_importFile.id);
                            requestModule.get(url, (res) => {
                                const contentType = res.headers['content-type'];
                                if (!details.type && contentType) {
                                    details.type = contentType;
                                }
                                const rawData = [];
                                res.on('data', (chunk) => {
                                    rawData.push(chunk);
                                    // Update progress more often on large files
                                    this.reportProgress();
                                });
                                res.on('error', (error) => __awaiter(this, void 0, void 0, function* () {
                                    yield completeFile(details);
                                    logError(error);
                                }));
                                res.on('end', () => __awaiter(this, void 0, void 0, function* () {
                                    try {
                                        // Bypass the fileStore filters
                                        const file = yield fileStore._doInsert(details, Buffer.concat(rawData));
                                        const url = server_1.FileUpload.getPath(`${file._id}/${encodeURI(file.name || '')}`);
                                        const attachment = this.getMessageAttachment(file, url);
                                        yield models_1.Messages.setImportFileRocketChatAttachment(_importFile.id, url, attachment);
                                        yield completeFile(details);
                                        importedRoomIds.add(message.rid);
                                    }
                                    catch (error) {
                                        yield completeFile(details);
                                        logError(error);
                                    }
                                }));
                            });
                        }
                        catch (error) {
                            this.logger.error(error);
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = pendingFileMessageList_1.return)) yield _b.call(pendingFileMessageList_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                void core_services_1.api.broadcast('notify.importedMessages', { roomIds: Array.from(importedRoomIds) });
            }
            catch (error) {
                // If the cursor expired, restart the method
                if (this.isCursorNotFoundError(error)) {
                    this.logger.info('CursorNotFound');
                    return this.startImport(importSelection);
                }
                yield _super.updateProgress.call(this, server_2.ProgressStep.ERROR);
                throw error;
            }
            yield _super.updateProgress.call(this, server_2.ProgressStep.DONE);
            return this.getProgress();
        });
    }
    getMessageAttachment(file, url) {
        if (file.type) {
            if (/^image\/.+/.test(file.type)) {
                return {
                    title: file.name,
                    title_link: url,
                    image_url: url,
                    image_type: file.type,
                    image_size: file.size,
                    image_dimensions: file.identify ? file.identify.size : undefined,
                };
            }
            if (/^audio\/.+/.test(file.type)) {
                return {
                    title: file.name,
                    title_link: url,
                    audio_url: url,
                    audio_type: file.type,
                    audio_size: file.size,
                };
            }
            if (/^video\/.+/.test(file.type)) {
                return {
                    title: file.name,
                    title_link: url,
                    video_url: url,
                    video_type: file.type,
                    video_size: file.size,
                };
            }
        }
        return {
            title: file.name,
            title_link: url,
        };
    }
}
exports.PendingFileImporter = PendingFileImporter;
