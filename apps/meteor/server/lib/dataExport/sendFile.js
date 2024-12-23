"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.sendFile = void 0;
const promises_1 = require("fs/promises");
const os_1 = require("os");
const path_1 = __importStar(require("path"));
const getURL_1 = require("../../../app/utils/server/getURL");
const i18n_1 = require("../i18n");
const copyFileUpload_1 = require("./copyFileUpload");
const exportRoomMessagesToFile_1 = require("./exportRoomMessagesToFile");
const getPath_1 = require("./getPath");
const getRoomData_1 = require("./getRoomData");
const makeZipFile_1 = require("./makeZipFile");
const sendEmail_1 = require("./sendEmail");
const uploadZipFile_1 = require("./uploadZipFile");
const sendFile = (data, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    const exportType = data.format;
    const baseDir = yield (0, promises_1.mkdtemp)((0, path_1.join)((0, os_1.tmpdir)(), 'exportFile-'));
    const exportPath = baseDir;
    const assetsPath = path_1.default.join(baseDir, 'assets');
    yield (0, promises_1.mkdir)(exportPath, { recursive: true });
    yield (0, promises_1.mkdir)(assetsPath, { recursive: true });
    const roomData = yield (0, getRoomData_1.getRoomData)(data.rid);
    roomData.targetFile = `${(data.format === 'json' && roomData.roomName) || roomData.roomId}.${data.format}`;
    const fullFileList = [];
    const roomsToExport = [roomData];
    const filter = !data.dateFrom && !data.dateTo
        ? {}
        : {
            ts: Object.assign(Object.assign({}, (data.dateFrom && { $gte: data.dateFrom })), (data.dateTo && { $lte: data.dateTo })),
        };
    const exportMessages = () => __awaiter(void 0, void 0, void 0, function* () {
        const { fileList } = yield (0, exportRoomMessagesToFile_1.exportRoomMessagesToFile)(exportPath, assetsPath, exportType, roomsToExport, user, filter, {}, false);
        fullFileList.push(...fileList);
        const [roomData] = roomsToExport;
        if (roomData.status !== 'completed') {
            yield exportMessages();
        }
    });
    yield exportMessages();
    const promises = [];
    try {
        for (var _d = true, fullFileList_1 = __asyncValues(fullFileList), fullFileList_1_1; fullFileList_1_1 = yield fullFileList_1.next(), _a = fullFileList_1_1.done, !_a; _d = true) {
            _c = fullFileList_1_1.value;
            _d = false;
            const attachmentData = _c;
            promises.push((0, copyFileUpload_1.copyFileUpload)(attachmentData, assetsPath));
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = fullFileList_1.return)) yield _b.call(fullFileList_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    yield Promise.all(promises);
    const exportFile = `${baseDir}-export.zip`;
    yield (0, makeZipFile_1.makeZipFile)(exportPath, exportFile);
    const file = yield (0, uploadZipFile_1.uploadZipFile)(exportFile, user._id, exportType);
    const subject = i18n_1.i18n.t('Channel_Export');
    const body = i18n_1.i18n.t('UserDataDownload_EmailBody', {
        download_link: (0, getURL_1.getURL)((0, getPath_1.getPath)(file._id), { cdn: false, full: true }),
    });
    yield (0, sendEmail_1.sendEmail)(user, subject, body);
});
exports.sendFile = sendFile;
