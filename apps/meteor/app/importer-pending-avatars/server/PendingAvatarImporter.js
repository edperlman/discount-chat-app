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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PendingAvatarImporter = void 0;
const models_1 = require("@rocket.chat/models");
const server_1 = require("../../importer/server");
const setUserAvatar_1 = require("../../lib/server/functions/setUserAvatar");
class PendingAvatarImporter extends server_1.Importer {
    prepareFileCount() {
        const _super = Object.create(null, {
            updateProgress: { get: () => super.updateProgress }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.debug('start preparing import operation');
            yield _super.updateProgress.call(this, server_1.ProgressStep.PREPARING_STARTED);
            const fileCount = yield models_1.Users.countAllUsersWithPendingAvatar();
            if (fileCount === 0) {
                yield _super.updateProgress.call(this, server_1.ProgressStep.DONE);
                return 0;
            }
            this.progress.count.total += fileCount;
            yield this.updateRecord({
                'count.messages': fileCount,
                'count.total': fileCount,
                'messagesstatus': null,
                'status': server_1.ProgressStep.IMPORTING_FILES,
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
            const pendingFileUserList = models_1.Users.findAllUsersWithPendingAvatar();
            try {
                try {
                    for (var _d = true, pendingFileUserList_1 = __asyncValues(pendingFileUserList), pendingFileUserList_1_1; pendingFileUserList_1_1 = yield pendingFileUserList_1.next(), _a = pendingFileUserList_1_1.done, !_a; _d = true) {
                        _c = pendingFileUserList_1_1.value;
                        _d = false;
                        const user = _c;
                        try {
                            const { _pendingAvatarUrl: url, name, _id } = user;
                            try {
                                if (!(url === null || url === void 0 ? void 0 : url.startsWith('http'))) {
                                    continue;
                                }
                                try {
                                    yield (0, setUserAvatar_1.setAvatarFromServiceWithValidation)(_id, url, undefined, 'url');
                                    yield models_1.Users.updateOne({ _id }, { $unset: { _pendingAvatarUrl: '' } });
                                }
                                catch (error) {
                                    this.logger.warn(`Failed to set ${name}'s avatar from url ${url}`);
                                }
                            }
                            finally {
                                yield this.addCountCompleted(1);
                            }
                        }
                        catch (error) {
                            this.logger.error(error);
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = pendingFileUserList_1.return)) yield _b.call(pendingFileUserList_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            catch (error) {
                // If the cursor expired, restart the method
                if (this.isCursorNotFoundError(error)) {
                    this.logger.info('CursorNotFound');
                    return this.startImport(importSelection);
                }
                yield _super.updateProgress.call(this, server_1.ProgressStep.ERROR);
                throw error;
            }
            yield _super.updateProgress.call(this, server_1.ProgressStep.DONE);
            return this.getProgress();
        });
    }
}
exports.PendingAvatarImporter = PendingAvatarImporter;
