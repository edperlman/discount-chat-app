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
const chai_1 = require("chai");
const mimeTypes_1 = require("./mimeTypes");
const mimeTypeToExtension = {
    'text/plain': 'txt',
    'image/x-icon': 'ico',
    'image/vnd.microsoft.icon': 'ico',
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'image/bmp': 'bmp',
    'image/tiff': 'tif',
    'audio/wav': 'wav',
    'audio/wave': 'wav',
    'audio/aac': 'aac',
    'audio/x-aac': 'aac',
    'audio/mp4': 'm4a',
    'audio/mpeg': 'mpga',
    'audio/ogg': 'oga',
    'application/octet-stream': 'bin',
};
const extensionToMimeType = {
    lst: 'text/plain',
    txt: 'text/plain',
    ico: 'image/x-icon',
    png: 'image/png',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    bmp: 'image/bmp',
    tiff: 'image/tiff',
    tif: 'image/tiff',
    wav: 'audio/wav',
    aac: 'audio/aac',
    mp3: 'audio/mpeg',
    ogg: 'audio/ogg',
    oga: 'audio/ogg',
    m4a: 'audio/mp4',
    mpga: 'audio/mpeg',
    mp4: 'video/mp4',
    bin: 'application/octet-stream',
};
describe('mimeTypes', () => {
    describe('getExtension', () => {
        for (const [mimeType, extension] of Object.entries(mimeTypeToExtension)) {
            it(`should return the correct extension ${extension} for the given mimeType ${mimeType}`, () => __awaiter(void 0, void 0, void 0, function* () {
                (0, chai_1.expect)((0, mimeTypes_1.getExtension)(mimeType)).to.be.eql(extension);
            }));
        }
        it('should return an empty string if the mimeType is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)((0, mimeTypes_1.getExtension)('application/unknown')).to.be.eql('');
        }));
    });
    describe('getMimeType', () => {
        for (const [extension, mimeType] of Object.entries(extensionToMimeType)) {
            it(`should return the correct mimeType ${mimeType} for the given fileName file.${extension} passing the correct mimeType`, () => __awaiter(void 0, void 0, void 0, function* () {
                (0, chai_1.expect)((0, mimeTypes_1.getMimeType)(mimeType, `file.${extension}`)).to.be.eql(mimeType);
            }));
        }
        it('should return the correct mimeType for the given fileName', () => __awaiter(void 0, void 0, void 0, function* () {
            for (const [extension, mimeType] of Object.entries(extensionToMimeType)) {
                (0, chai_1.expect)((0, mimeTypes_1.getMimeType)('application/unknown', `file.${extension}`)).to.be.eql(mimeType);
            }
        }));
        it('should return the correct mimeType for the given fileName when informed mimeType is application/octet-stream', () => __awaiter(void 0, void 0, void 0, function* () {
            for (const [extension, mimeType] of Object.entries(extensionToMimeType)) {
                (0, chai_1.expect)((0, mimeTypes_1.getMimeType)('application/octet-stream', `file.${extension}`)).to.be.eql(mimeType);
            }
        }));
        it('should return the mimeType if it is not application/octet-stream', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)((0, mimeTypes_1.getMimeType)('audio/wav', 'file.wav')).to.be.eql('audio/wav');
        }));
        it('should return application/octet-stream if the mimeType is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)((0, mimeTypes_1.getMimeType)('application/octet-stream', 'file.unknown')).to.be.eql('application/octet-stream');
        }));
    });
});
