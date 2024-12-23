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
exports.MediaService = void 0;
const stream_1 = __importDefault(require("stream"));
const core_services_1 = require("@rocket.chat/core-services");
const exif_be_gone_1 = __importDefault(require("exif-be-gone"));
const file_type_1 = __importDefault(require("file-type"));
const is_svg_1 = __importDefault(require("is-svg"));
const sharp_1 = __importDefault(require("sharp"));
class MediaService extends core_services_1.ServiceClassInternal {
    constructor() {
        super(...arguments);
        this.name = 'media';
        this.imageExts = new Set([
            'jpg',
            'png',
            'gif',
            'webp',
            'flif',
            'cr2',
            'tif',
            'bmp',
            'jxr',
            'psd',
            'ico',
            'bpg',
            'jp2',
            'jpm',
            'jpx',
            'heic',
            'cur',
            'dcm',
        ]);
    }
    resizeFromBuffer(input, width, height, keepType, blur, enlarge, fit) {
        return __awaiter(this, void 0, void 0, function* () {
            const stream = this.bufferToStream(input);
            return this.resizeFromStream(stream, width, height, keepType, blur, enlarge, fit);
        });
    }
    resizeFromStream(input, width, height, keepType, blur, enlarge, fit) {
        return __awaiter(this, void 0, void 0, function* () {
            const transformer = (0, sharp_1.default)().resize({ width, height, fit, withoutEnlargement: !enlarge });
            if (!keepType) {
                transformer.jpeg();
            }
            if (blur) {
                transformer.blur();
            }
            const result = transformer.toBuffer({ resolveWithObject: true });
            input.pipe(transformer);
            const { data, info: { width: widthInfo, height: heightInfo }, } = yield result;
            return {
                data,
                width: widthInfo,
                height: heightInfo,
            };
        });
    }
    isImage(buff) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield file_type_1.default.fromBuffer(buff);
            if (!(data === null || data === void 0 ? void 0 : data.ext)) {
                return false || this.isSvgImage(buff);
            }
            return this.imageExts.has(data.ext) || this.isSvgImage(buff);
        });
    }
    isSvgImage(buff) {
        return (0, is_svg_1.default)(buff);
    }
    stripExifFromBuffer(buffer) {
        return this.streamToBuffer(this.stripExifFromImageStream(this.bufferToStream(buffer)));
    }
    stripExifFromImageStream(stream) {
        return stream.pipe(new exif_be_gone_1.default());
    }
    bufferToStream(buffer) {
        const bufferStream = new stream_1.default.PassThrough();
        bufferStream.end(buffer);
        return bufferStream;
    }
    streamToBuffer(stream) {
        return new Promise((resolve) => {
            const chunks = [];
            stream.on('data', (data) => chunks.push(data)).on('end', () => resolve(Buffer.concat(chunks)));
        });
    }
}
exports.MediaService = MediaService;
