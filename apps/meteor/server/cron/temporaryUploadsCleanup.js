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
exports.temporaryUploadCleanupCron = temporaryUploadCleanupCron;
const cron_1 = require("@rocket.chat/cron");
const models_1 = require("@rocket.chat/models");
const server_1 = require("../../app/file-upload/server");
function temporaryUploadCleanup() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        const files = yield models_1.Uploads.findExpiredTemporaryFiles({ projection: { _id: 1 } }).toArray();
        try {
            for (var _d = true, files_1 = __asyncValues(files), files_1_1; files_1_1 = yield files_1.next(), _a = files_1_1.done, !_a; _d = true) {
                _c = files_1_1.value;
                _d = false;
                const file = _c;
                yield server_1.FileUpload.getStore('Uploads').deleteById(file._id);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = files_1.return)) yield _b.call(files_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
function temporaryUploadCleanupCron() {
    return __awaiter(this, void 0, void 0, function* () {
        yield cron_1.cronJobs.add('temporaryUploadCleanup', '31 * * * *', () => __awaiter(this, void 0, void 0, function* () { return temporaryUploadCleanup(); }));
    });
}
